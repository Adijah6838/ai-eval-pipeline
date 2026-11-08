from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Developer(Base):
    __tablename__ = "developers"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    skill_level = Column(String) # e.g., Junior, Mid, Senior
    registered_at = Column(DateTime, default=datetime.utcnow)

    submissions = relationship("Submission", back_populates="developer")

class Challenge(Base):
    __tablename__ = "challenges"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    difficulty = Column(String) # e.g., Easy, Medium, Hard
    language = Column(String)
    time_limit = Column(Integer) # In seconds
    expected_input = Column(Text)
    expected_output = Column(Text)
    test_cases = Column(Text) # JSON string or raw text for now
    evaluation_criteria = Column(Text)

    submissions = relationship("Submission", back_populates="challenge")

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, index=True)
    developer_id = Column(Integer, ForeignKey("developers.id"))
    challenge_id = Column(Integer, ForeignKey("challenges.id"))
    source_code = Column(Text)
    status = Column(String, default="Pending") # Pending, Processing, Passed, Failed, Evaluation Error
    submitted_at = Column(DateTime, default=datetime.utcnow)

    developer = relationship("Developer", back_populates="submissions")
    challenge = relationship("Challenge", back_populates="submissions")
    evaluation = relationship("Evaluation", back_populates="submission", uselist=False)

class Evaluation(Base):
    __tablename__ = "evaluations"
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"), unique=True)
    overall_score = Column(Float, default=0.0)
    passed_tests = Column(Integer, default=0)
    failed_tests = Column(Integer, default=0)
    execution_time = Column(Float, default=0.0)
    ai_feedback = Column(Text, nullable=True)
    evaluated_at = Column(DateTime, default=datetime.utcnow)

    submission = relationship("Submission", back_populates="evaluation")
