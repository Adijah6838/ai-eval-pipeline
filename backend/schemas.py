from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Developer Schemas
class DeveloperBase(BaseModel):
    full_name: str
    email: EmailStr
    skill_level: str

class DeveloperCreate(DeveloperBase): pass

class DeveloperResponse(DeveloperBase):
    id: int
    registered_at: datetime
    class Config: from_attributes = True

# Challenge Schemas
class ChallengeBase(BaseModel):
    title: str
    description: str
    difficulty: str
    language: str
    time_limit: int
    expected_input: str
    expected_output: str
    test_cases: str
    evaluation_criteria: str

class ChallengeCreate(ChallengeBase): pass

class ChallengeResponse(ChallengeBase):
    id: int
    class Config: from_attributes = True

# Submission Schemas
class SubmissionBase(BaseModel):
    developer_id: int
    challenge_id: int
    source_code: str

class SubmissionCreate(SubmissionBase): pass

class SubmissionResponse(SubmissionBase):
    id: int
    status: str
    submitted_at: datetime
    class Config: from_attributes = True

# Evaluation Schemas
class EvaluationResponse(BaseModel):
    id: int
    submission_id: int
    overall_score: float
    passed_tests: int
    failed_tests: int
    execution_time: float
    ai_feedback: Optional[str]
    evaluated_at: datetime
    class Config: from_attributes = True
