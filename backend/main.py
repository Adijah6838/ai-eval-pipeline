from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from database import engine, get_db
import models, schemas
from evaluator import CodeEvaluator
from reviewer import AICodeReviewer

models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="AI Eval Pipeline API")

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

@app.get("/")
def root(): return {"message": "AI Evaluation Pipeline API is running"}

# --- DEVELOPER ROUTES ---
@app.post("/api/developers", response_model=schemas.DeveloperResponse)
def create_developer(dev: schemas.DeveloperCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Developer).filter(models.Developer.email == dev.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_dev = models.Developer(**dev.model_dump())
    db.add(new_dev); db.commit(); db.refresh(new_dev)
    return new_dev

@app.get("/api/developers", response_model=List[schemas.DeveloperResponse])
def get_developers(db: Session = Depends(get_db)):
    return db.query(models.Developer).all()

# --- CHALLENGE ROUTES ---
@app.post("/api/challenges", response_model=schemas.ChallengeResponse)
def create_challenge(challenge: schemas.ChallengeCreate, db: Session = Depends(get_db)):
    new_challenge = models.Challenge(**challenge.model_dump())
    db.add(new_challenge); db.commit(); db.refresh(new_challenge)
    return new_challenge

@app.get("/api/challenges", response_model=List[schemas.ChallengeResponse])
def get_challenges(db: Session = Depends(get_db)):
    return db.query(models.Challenge).all()

# --- SUBMISSION ROUTES ---
@app.post("/api/submissions", response_model=schemas.SubmissionResponse)
def create_submission(sub: schemas.SubmissionCreate, db: Session = Depends(get_db)):
    new_sub = models.Submission(**sub.model_dump(), status="Pending")
    db.add(new_sub); db.commit(); db.refresh(new_sub)
    return new_sub

@app.get("/api/submissions", response_model=List[schemas.SubmissionResponse])
def get_submissions(db: Session = Depends(get_db)):
    return db.query(models.Submission).all()

# --- EVALUATION ROUTES (Feature 4 & 5) ---
@app.post("/api/evaluations/{submission_id}/run", response_model=schemas.EvaluationResponse)
def run_evaluation(submission_id: int, db: Session = Depends(get_db)):
    submission = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    if submission.evaluation:
        raise HTTPException(status_code=400, detail="Submission already evaluated")

    challenge = submission.challenge
    if not challenge:
        raise HTTPException(status_code=400, detail="Challenge associated with submission not found")

    # 1. Run Automated Evaluator
    evaluator = CodeEvaluator()
    eval_result = evaluator.evaluate(submission.source_code, challenge.language)

    # 2. Run AI Code Review
    reviewer = AICodeReviewer()
    ai_feedback = reviewer.generate_feedback(submission.source_code, challenge.language)

    # 3. Save Evaluation to DB
    new_eval = models.Evaluation(
        submission_id=submission.id,
        overall_score=eval_result["overall_score"],
        passed_tests=eval_result["passed_tests"],
        failed_tests=eval_result["failed_tests"],
        execution_time=eval_result["execution_time"],
        ai_feedback=ai_feedback
    )
    db.add(new_eval)
    
    # 4. Update Submission Status
    submission.status = eval_result["status"]
    
    db.commit()
    db.refresh(new_eval)
    
    return new_eval
