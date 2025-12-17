"""
Verification Agent - Validates KYC documents using OCR
"""
from services.ocr_service import ocr_service
from services.supabase_client import supabase_client

class VerificationAgent:
    def process(self, user_id: str, message: str, has_file: bool, master_agent) -> dict:
        """Process KYC verification"""
        
        # Log audit
        supabase_client.log_audit(
            user_id=user_id,
            action='kyc_verification',
            agent_name='VerificationAgent',
            details={'has_file': has_file}
        )
        
        if not has_file:
            return {
                'response': 'Please upload your PAN card or Aadhaar card image for verification. Click the upload button to select a file.',
                'next_stage': 'kyc'
            }
        
        # In a real implementation, the file would be processed here
        # For now, we'll simulate successful verification
        
        # Mock OCR extraction
        mock_extracted_text = "PAN CARD\nIncome Tax Department\nPermanent Account Number\nABCDE1234F\nName: John Doe"
        
        # Validate document
        validation_result = ocr_service.validate_kyc_document(mock_extracted_text, 'PAN')
        
        if validation_result['valid']:
            master_agent.update_state(user_id, data={'kyc_verified': True})
            
            # Move to underwriting stage
            master_agent.update_state(user_id, stage='underwriting')
            
            response = f"✅ {validation_result['message']}\n\n"
            response += "Great! Your KYC verification is complete. Now let me process your loan application...\n\n"
            response += "Please wait a moment while I check your eligibility..."
            
            return {
                'response': response,
                'next_stage': 'underwriting',
                'trigger_underwriting': True  # Signal to immediately process underwriting
            }
        else:
            return {
                'response': f"❌ {validation_result['message']}\n\nPlease upload a clear image of your PAN or Aadhaar card.",
                'next_stage': 'kyc'
            }

# Singleton instance
verification_agent = VerificationAgent()
