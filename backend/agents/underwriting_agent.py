"""
Underwriting Agent - Applies credit scoring logic and makes approval decisions
"""
from services.credit_scoring import credit_scoring_service
from services.supabase_client import supabase_client

class UnderwritingAgent:
    def process(self, user_id: str, message: str, master_agent) -> dict:
        """Process loan underwriting and approval"""
        
        state_data = master_agent.get_state_data(user_id)
        application_id = master_agent.get_application_id(user_id)
        
        # Get applicant data
        income = state_data.get('income', 0)
        employment_type = state_data.get('employment_type', 'other')
        
        # Calculate credit score
        credit_score = credit_scoring_service.calculate_credit_score(income, employment_type)
        
        # Calculate loan eligibility
        eligibility = credit_scoring_service.calculate_loan_eligibility(income, credit_score)
        
        # Determine approval status
        if income >= 30000 and credit_score >= 700:
            status = 'APPROVED'
            decision_message = "🎉 Congratulations! Your loan application has been APPROVED!"
        elif income >= 20000 and credit_score >= 650:
            status = 'REVIEW'
            decision_message = "📋 Your application is under REVIEW. Our team will contact you within 24 hours."
        else:
            status = 'REJECTED'
            decision_message = "😔 We're sorry, but we cannot approve your loan application at this time."
        
        # Update loan application in database
        update_data = {
            'credit_score': credit_score,
            'loan_amount': eligibility['max_loan_amount'],
            'interest_rate': eligibility['interest_rate'],
            'status': status
        }
        
        if application_id:
            supabase_client.update_loan_application(application_id, update_data)
        
        # Log audit
        supabase_client.log_audit(
            user_id=user_id,
            action='underwriting_decision',
            agent_name='UnderwritingAgent',
            details={
                'credit_score': credit_score,
                'status': status,
                'loan_amount': eligibility['max_loan_amount']
            }
        )
        
        # Update state
        master_agent.update_state(user_id, data={
            'credit_score': credit_score,
            'loan_amount': eligibility['max_loan_amount'],
            'interest_rate': eligibility['interest_rate'],
            'tenure_months': eligibility['tenure_months'],
            'status': status
        })
        
        # Build response
        response = f"{decision_message}\n\n"
        response += f"📊 **Application Details:**\n"
        response += f"• Credit Score: {credit_score}\n"
        response += f"• Approved Amount: ₹{eligibility['max_loan_amount']:,.2f}\n"
        response += f"• Interest Rate: {eligibility['interest_rate']}% per annum\n"
        response += f"• Tenure: {eligibility['tenure_months']} months\n"
        response += f"• Risk Level: {eligibility['risk_level']}\n\n"
        
        if status == 'APPROVED':
            master_agent.update_state(user_id, stage='sanction')
            response += "I'll now generate your sanction letter. Please wait a moment..."
            
            return {
                'response': response,
                'next_stage': 'sanction',
                'trigger_sanction': True
            }
        else:
            response += "Thank you for applying with us. You can start a new application anytime from your dashboard."
            master_agent.reset_state(user_id)
            
            return {
                'response': response,
                'next_stage': 'complete'
            }

# Singleton instance
underwriting_agent = UnderwritingAgent()
