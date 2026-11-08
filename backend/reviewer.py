class AICodeReviewer:
    """
    Rule-based mock AI that provides feedback based on static analysis.
    """
    def generate_feedback(self, source_code: str, language: str) -> str:
        feedback = []
        
        if len(source_code) < 50:
            feedback.append("- Code is very short. Consider adding more robust logic and edge case handling.")
        else:
            feedback.append("- Code length is appropriate for the challenge.")

        if "try" not in source_code and "except" not in source_code:
            feedback.append("- Potential Bug: Missing explicit error handling (try/except blocks).")
        
        if "#" not in source_code and "//" not in source_code:
            feedback.append("- Readability: Consider adding comments to explain complex logic.")
            
        if "for" in source_code or "while" in source_code:
            feedback.append("- Performance: Ensure loops have proper termination conditions to avoid infinite loops.")
            
        if "print(" in source_code and "return" not in source_code:
            feedback.append("- Best Practice: Functions should return values rather than just printing them.")

        if not feedback:
            feedback.append("- Excellent job! No major issues detected.")

        return "\n".join(feedback)
