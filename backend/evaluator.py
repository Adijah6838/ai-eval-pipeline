import random
import hashlib
import time

class CodeEvaluator:
    """
    A safe mock evaluator that calculates scores based on code structure 
    without executing the arbitrary code.
    """
    def evaluate(self, source_code: str, language: str):
        # Use a hash of the code to make the evaluation deterministic (same code = same score)
        code_hash = int(hashlib.md5(source_code.encode()).hexdigest(), 16)
        
        # Mock Test Execution
        total_tests = 5
        # Deterministic mock: some codes pass all, some fail. 
        passed_tests = code_hash % (total_tests + 1) 
        failed_tests = total_tests - passed_tests
        
        # Mock Execution Time (between 0.1s and 2.0s)
        execution_time = round(0.1 + (code_hash % 19) / 10, 2)

        # Scoring Rubric (out of 100)
        # 1. Functional correctness (40) - based on passed tests
        score_functional = (passed_tests / total_tests) * 40
        
        # 2. Test case coverage (20) - assume full coverage if all passed
        score_coverage = 20 if passed_tests == total_tests else (passed_tests / total_tests) * 20
        
        # 3. Code quality (15) - basic heuristic
        score_quality = 15 if len(source_code) > 50 else 10
        
        # 4. Error handling (10)
        has_error_handling = "try" in source_code or "except" in source_code or "if" in source_code
        score_error = 10 if has_error_handling else 5
        
        # 5. Performance (10) - inverse to execution time
        score_performance = 10 if execution_time < 1.0 else 5
        
        # 6. Documentation (5)
        has_comments = "#" in source_code or "//" in source_code or "/*" in source_code
        score_doc = 5 if has_comments else 0

        total_score = score_functional + score_coverage + score_quality + score_error + score_performance + score_doc
        
        return {
            "overall_score": round(total_score, 2),
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "execution_time": execution_time,
            "status": "Passed" if passed_tests == total_tests else "Failed"
        }
