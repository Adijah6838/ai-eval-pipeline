from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "AI Evaluation Pipeline API is running"}

def test_create_developer():
    response = client.post("/api/developers", json={
        "full_name": "Test Dev", "email": "test@dev.com", "skill_level": "Junior"
    })
    assert response.status_code == 200
    assert response.json()["full_name"] == "Test Dev"

def test_create_developer_duplicate_email():
    # Try creating the same developer again
    response = client.post("/api/developers", json={
        "full_name": "Test Dev 2", "email": "test@dev.com", "skill_level": "Junior"
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_get_developers():
    response = client.get("/api/developers")
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_create_challenge():
    response = client.post("/api/challenges", json={
        "title": "Test Challenge", "description": "Test Desc", "difficulty": "Easy", "language": "Python",
        "time_limit": 60, "expected_input": "in", "expected_output": "out", "test_cases": "tc", "evaluation_criteria": "ec"
    })
    assert response.status_code == 200
    assert response.json()["title"] == "Test Challenge"

def test_get_challenges():
    response = client.get("/api/challenges")
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_create_submission():
    response = client.post("/api/submissions", json={
        "developer_id": 1, "challenge_id": 1, "source_code": "print('hello')"
    })
    assert response.status_code == 200
    assert response.json()["status"] == "Pending"

def test_get_submissions():
    response = client.get("/api/submissions")
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_run_evaluation_invalid_submission():
    response = client.post("/api/evaluations/9999/run")
    assert response.status_code == 404
    assert response.json()["detail"] == "Submission not found"
