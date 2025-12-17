"""
Sales Agent - Greets users, explains loan products, and collects application details
"""
from services.supabase_client import supabase_client
import uuid

class SalesAgent:
    def __init__(self):
        self.questions = {
            'name': 'Great! Now, could you please tell me your monthly income in INR?',
            'income': 'Thank you! What is your employment type? (e.g., Salaried, Self-Employed, Business, Professional)',
            'employment': 'Perfect! Now I need to verify your identity. Please upload a photo of your PAN card or Aadhaar card for KYC verification.'
        }
    
    def process(self, user_id: str, message: str, master_agent) -> dict:
        """Process sales conversation"""
        state_data = master_agent.get_state_data(user_id)
        current_stage = master_agent.get_current_stage(user_id)
        
        # Log audit
        supabase_client.log_audit(
            user_id=user_id,
            action='sales_interaction',
            agent_name='SalesAgent',
            details={'message': message}
        )
        
        # Greeting stage - collect name
        if current_stage == 'greeting':
            name = message.strip()
            master_agent.update_state(user_id, stage='collect_info', data={'name': name})
            
            response = f"Nice to meet you, {name}! 😊\n\n"
            response += "I'm here to help you get a personal loan quickly. "
            response += "We offer competitive interest rates starting from 10.5% with flexible repayment options.\n\n"
            response += self.questions['name']
            
            return {
                'response': response,
                'next_stage': 'collect_info'
            }
        
        # Collect income
        elif 'income' not in state_data:
            try:
                # Extract numbers from message
                income = float(''.join(filter(str.isdigit, message)))
                
                if income < 10000:
                    return {
                        'response': 'The minimum monthly income requirement is ₹10,000. Please enter a valid monthly income.',
                        'next_stage': 'collect_info'
                    }
                
                master_agent.update_state(user_id, data={'income': income})
                
                return {
                    'response': self.questions['income'],
                    'next_stage': 'collect_info'
                }
            except ValueError:
                return {
                    'response': 'Please enter a valid monthly income amount in numbers (e.g., 50000)',
                    'next_stage': 'collect_info'
                }
        
        # Collect employment type
        elif 'employment_type' not in state_data:
            employment_type = message.strip()
            master_agent.update_state(user_id, data={'employment_type': employment_type})
            
            # Create loan application record
            application_data = {
                'id': str(uuid.uuid4()),
                'user_id': user_id,
                'income': state_data['income'],
                'employment_type': employment_type,
                'status': 'PENDING'
            }
            
            result = supabase_client.create_loan_application(application_data)
            if result:
                master_agent.set_application_id(user_id, application_data['id'])
            
            # Move to KYC stage
            master_agent.update_state(user_id, stage='kyc')
            
            return {
                'response': self.questions['employment'],
                'next_stage': 'kyc'
            }
        
        return {
            'response': 'Please provide the requested information.',
            'next_stage': 'collect_info'
        }

# Singleton instance
sales_agent = SalesAgent()
