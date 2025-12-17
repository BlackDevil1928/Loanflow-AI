import random

class CreditScoringService:
    """
    Mock credit scoring service
    In production, this would integrate with actual credit bureaus
    """
    
    @staticmethod
    def calculate_credit_score(income: float, employment_type: str) -> int:
        """
        Calculate a mock credit score based on income and employment
        Returns: Credit score between 300-850
        """
        base_score = 600
        
        # Income factor (higher income = better score)
        if income >= 100000:
            income_score = 150
        elif income >= 50000:
            income_score = 100
        elif income >= 30000:
            income_score = 50
        else:
            income_score = 0
        
        # Employment factor
        employment_scores = {
            'salaried': 80,
            'self-employed': 50,
            'business': 60,
            'professional': 70,
            'other': 20
        }
        
        employment_score = employment_scores.get(employment_type.lower(), 30)
        
        # Add some randomness for realism
        random_factor = random.randint(-20, 20)
        
        # Calculate final score
        final_score = base_score + income_score + employment_score + random_factor
        
        # Ensure score is within valid range
        final_score = max(300, min(850, final_score))
        
        return final_score
    
    @staticmethod
    def assess_risk(credit_score: int, income: float) -> str:
        """
        Assess risk level based on credit score and income
        Returns: 'LOW', 'MEDIUM', or 'HIGH'
        """
        if credit_score >= 750 and income >= 50000:
            return 'LOW'
        elif credit_score >= 650 and income >= 30000:
            return 'MEDIUM'
        else:
            return 'HIGH'
    
    @staticmethod
    def calculate_loan_eligibility(income: float, credit_score: int) -> dict:
        """
        Calculate loan eligibility and terms
        Returns: dict with loan_amount, interest_rate, tenure
        """
        # Maximum loan amount (typically 10-15x monthly income)
        max_loan = income * 12
        
        # Interest rate based on credit score
        if credit_score >= 750:
            interest_rate = 10.5
        elif credit_score >= 700:
            interest_rate = 12.0
        elif credit_score >= 650:
            interest_rate = 14.5
        else:
            interest_rate = 16.0
        
        # Recommended tenure in months
        if max_loan >= 500000:
            tenure = 60  # 5 years
        elif max_loan >= 200000:
            tenure = 48  # 4 years
        else:
            tenure = 36  # 3 years
        
        return {
            'max_loan_amount': round(max_loan, 2),
            'interest_rate': interest_rate,
            'tenure_months': tenure,
            'risk_level': CreditScoringService.assess_risk(credit_score, income)
        }

# Singleton instance
credit_scoring_service = CreditScoringService()
