"""
Master Agent - Orchestrates the entire loan application workflow
"""

class MasterAgent:
    def __init__(self):
        self.conversation_state = {}
    
    def get_or_create_state(self, user_id: str) -> dict:
        """Get or create conversation state for a user"""
        if user_id not in self.conversation_state:
            self.conversation_state[user_id] = {
                'stage': 'greeting',  # greeting, collect_info, kyc, underwriting, sanction
                'data': {},
                'application_id': None
            }
        return self.conversation_state[user_id]
    
    def update_state(self, user_id: str, stage: str = None, data: dict = None):
        """Update conversation state"""
        state = self.get_or_create_state(user_id)
        if stage:
            state['stage'] = stage
        if data:
            state['data'].update(data)
    
    def get_current_stage(self, user_id: str) -> str:
        """Get current conversation stage"""
        state = self.get_or_create_state(user_id)
        return state['stage']
    
    def get_state_data(self, user_id: str) -> dict:
        """Get all state data for user"""
        state = self.get_or_create_state(user_id)
        return state['data']
    
    def set_application_id(self, user_id: str, application_id: str):
        """Set the loan application ID"""
        state = self.get_or_create_state(user_id)
        state['application_id'] = application_id
    
    def get_application_id(self, user_id: str) -> str:
        """Get the loan application ID"""
        state = self.get_or_create_state(user_id)
        return state.get('application_id')
    
    def reset_state(self, user_id: str):
        """Reset conversation state"""
        if user_id in self.conversation_state:
            del self.conversation_state[user_id]
    
    def route_message(self, user_id: str, message: str, has_file: bool = False) -> dict:
        """
        Route message to appropriate agent based on current stage
        Returns: dict with 'response', 'next_stage', and optional 'data'
        """
        current_stage = self.get_current_stage(user_id)
        
        # Import agents here to avoid circular imports
        from agents.sales_agent import sales_agent
        from agents.verification_agent import verification_agent
        from agents.underwriting_agent import underwriting_agent
        from agents.sanction_agent import sanction_agent
        
        if current_stage == 'greeting' or current_stage == 'collect_info':
            return sales_agent.process(user_id, message, self)
        
        elif current_stage == 'kyc':
            return verification_agent.process(user_id, message, has_file, self)
        
        elif current_stage == 'underwriting':
            return underwriting_agent.process(user_id, message, self)
        
        elif current_stage == 'sanction':
            return sanction_agent.process(user_id, message, self)
        
        else:
            return {
                'response': 'I apologize, but something went wrong. Let\'s start over. What\'s your name?',
                'next_stage': 'greeting'
            }

# Singleton instance
master_agent = MasterAgent()
