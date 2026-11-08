# AI-Powered Software Development & Evaluation Pipeline

This platform automates the submission, testing, evaluation, and reporting process for coding challenges. It includes a FastAPI backend with an automated evaluation engine and a rule-based AI code reviewer, plus a React analytics dashboard.

## 🏗️ Technical Architecture

```text
[ React Frontend (Vite/TS) ]
          |
          | REST API (JSON)
          v
[ FastAPI Backend (Python) ]
          |
          +---> [ SQLAlchemy ORM ] ---> [ SQLite Database ]
          |
          +---> [ CodeEvaluator ] ---> (Deterministic Mock Scoring)
          |
          +---> [ AICodeReviewer ] ---> (Rule-Based Static Analysis)