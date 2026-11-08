from evaluator import CodeEvaluator
from reviewer import AICodeReviewer

def test_evaluator_scoring():
    evaluator = CodeEvaluator()
    # Good code with comments and error handling
    good_code = "# A comment\ntry:\n    def my_func():\n        return True\nexcept:\n    pass"
    result = evaluator.evaluate(good_code, "Python")
    
    assert result["overall_score"] <= 100
    assert result["overall_score"] >= 0
    assert result["passed_tests"] + result["failed_tests"] == 5

def test_ai_reviewer_comments():
    reviewer = AICodeReviewer()
    code_with_comments = "# This is a comment\ndef test(): return True"
    feedback = reviewer.generate_feedback(code_with_comments, "Python")
    # AI should detect comments and return statement, so it shouldn't complain about them
    assert "Readability: Consider adding comments" not in feedback

def test_ai_reviewer_no_error_handling():
    reviewer = AICodeReviewer()
    code_no_try = "def test(): return True"
    feedback = reviewer.generate_feedback(code_no_try, "Python")
    assert "Potential Bug: Missing explicit error handling" in feedback
