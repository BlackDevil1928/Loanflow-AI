import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

class SupabaseClient:
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not url or not key:
            print("Warning: Supabase credentials not found in environment variables")
            self.client = None
        else:
            self.client: Client = create_client(url, key)
    
    def get_user(self, user_id: str):
        """Get user profile"""
        if not self.client:
            return None
        
        try:
            response = self.client.table('users').select('*').eq('id', user_id).single().execute()
            return response.data
        except Exception as e:
            print(f"Error fetching user: {e}")
            return None
    
    def create_loan_application(self, data: dict):
        """Create a new loan application"""
        if not self.client:
            return None
        
        try:
            response = self.client.table('loan_applications').insert(data).execute()
            return response.data
        except Exception as e:
            print(f"Error creating loan application: {e}")
            return None
    
    def update_loan_application(self, application_id: str, data: dict):
        """Update loan application"""
        if not self.client:
            return None
        
        try:
            response = self.client.table('loan_applications').update(data).eq('id', application_id).execute()
            return response.data
        except Exception as e:
            print(f"Error updating loan application: {e}")
            return None
    
    def log_audit(self, user_id: str, action: str, agent_name: str, details: dict = None):
        """Log audit trail"""
        if not self.client:
            return None
        
        try:
            data = {
                'user_id': user_id,
                'action': action,
                'agent_name': agent_name,
                'details': details or {}
            }
            response = self.client.table('audit_logs').insert(data).execute()
            return response.data
        except Exception as e:
            print(f"Error logging audit: {e}")
            return None

# Singleton instance
supabase_client = SupabaseClient()
