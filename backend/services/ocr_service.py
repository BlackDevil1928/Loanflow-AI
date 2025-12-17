import os
import requests
from dotenv import load_dotenv

load_dotenv()

class OCRService:
    def __init__(self):
        self.api_key = os.getenv("OCR_SPACE_API_KEY", "")
        self.api_url = "https://api.ocr.space/parse/image"
    
    def extract_text_from_image(self, image_path: str) -> dict:
        """
        Extract text from image using OCR.space API
        Returns: dict with 'success', 'text', and 'error' keys
        """
        if not self.api_key:
            return {
                'success': False,
                'text': '',
                'error': 'OCR API key not configured'
            }
        
        try:
            with open(image_path, 'rb') as image_file:
                payload = {
                    'apikey': self.api_key,
                    'language': 'eng',
                    'isOverlayRequired': False,
                }
                
                files = {
                    'file': image_file
                }
                
                response = requests.post(self.api_url, data=payload, files=files)
                result = response.json()
                
                if result.get('IsErroredOnProcessing'):
                    return {
                        'success': False,
                        'text': '',
                        'error': result.get('ErrorMessage', ['Unknown error'])[0]
                    }
                
                # Extract text from parsed results
                text = ''
                if result.get('ParsedResults'):
                    text = result['ParsedResults'][0].get('ParsedText', '')
                
                return {
                    'success': True,
                    'text': text,
                    'error': None
                }
        
        except Exception as e:
            return {
                'success': False,
                'text': '',
                'error': str(e)
            }
    
    def validate_kyc_document(self, extracted_text: str, document_type: str = 'PAN') -> dict:
        """
        Mock validation of KYC documents
        In production, this would use actual validation logic
        """
        text_upper = extracted_text.upper()
        
        if document_type == 'PAN':
            # Mock PAN validation - check for PAN-like pattern
            if 'PAN' in text_upper or len(extracted_text) > 20:
                return {
                    'valid': True,
                    'document_type': 'PAN',
                    'message': 'PAN card verified successfully'
                }
        elif document_type == 'AADHAAR':
            # Mock Aadhaar validation
            if 'AADHAAR' in text_upper or 'GOVERNMENT' in text_upper:
                return {
                    'valid': True,
                    'document_type': 'AADHAAR',
                    'message': 'Aadhaar card verified successfully'
                }
        
        # If text is extracted but doesn't match patterns
        if len(extracted_text) > 10:
            return {
                'valid': True,
                'document_type': 'UNKNOWN',
                'message': 'Document uploaded successfully. Manual verification may be required.'
            }
        
        return {
            'valid': False,
            'document_type': document_type,
            'message': 'Could not verify document. Please ensure the image is clear and readable.'
        }

# Singleton instance
ocr_service = OCRService()
