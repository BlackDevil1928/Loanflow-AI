import os
import base64
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class GeminiOCRService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None
    
    def extract_text_from_image(self, image_path: str) -> dict:
        """
        Extract text and structured data from image using Gemini Vision API
        Returns: dict with 'success', 'text', 'structured_data', and 'error' keys
        """
        if not self.api_key or not self.model:
            return {
                'success': False,
                'text': '',
                'structured_data': {},
                'error': 'Gemini API key not configured'
            }
        
        try:
            # Read and encode image
            with open(image_path, 'rb') as image_file:
                image_data = image_file.read()
            
            # Create prompt for document extraction
            prompt = """Analyze this document image and extract all text and structured information.

If this is an ID card (PAN/Aadhaar), extract:
- Document Type (PAN Card/Aadhaar Card/Other)
- Name
- Father's Name
- Date of Birth
- Document Number (PAN/Aadhaar)
- Address (if available)

If this is an ITR (Income Tax Return), extract:
- Assessment Year
- Total Income
- Tax Paid
- PAN Number
- Name of Taxpayer

If this is a Balance Sheet, extract:
- Company/Individual Name
- Financial Year
- Total Assets
- Total Liabilities
- Net Worth

Provide the response in this exact JSON format:
{
    "document_type": "type here",
    "extracted_data": {
        "field_name": "value"
    },
    "raw_text": "all extracted text here",
    "confidence": "high/medium/low"
}"""

            # Upload image and generate content
            response = self.model.generate_content([
                prompt,
                {
                    'mime_type': 'image/jpeg',
                    'data': image_data
                }
            ])
            
            # Parse response
            result_text = response.text
            
            # Try to extract JSON from response
            import json
            import re
            
            # Find JSON in response
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                try:
                    structured_data = json.loads(json_match.group())
                except:
                    structured_data = {
                        'document_type': 'Unknown',
                        'extracted_data': {},
                        'raw_text': result_text,
                        'confidence': 'medium'
                    }
            else:
                structured_data = {
                    'document_type': 'Unknown',
                    'extracted_data': {},
                    'raw_text': result_text,
                    'confidence': 'medium'
                }
            
            return {
                'success': True,
                'text': result_text,
                'structured_data': structured_data,
                'error': None
            }
        
        except Exception as e:
            return {
                'success': False,
                'text': '',
                'structured_data': {},
                'error': str(e)
            }
    
    def validate_kyc_document(self, extracted_data: dict, document_type: str = 'PAN') -> dict:
        """
        Validate KYC documents based on extracted data
        """
        if not extracted_data:
            return {
                'valid': False,
                'document_type': document_type,
                'message': 'No data extracted from document'
            }
        
        # Check if we have minimum required fields
        has_data = bool(extracted_data.get('extracted_data'))
        
        if has_data:
            return {
                'valid': True,
                'document_type': extracted_data.get('document_type', document_type),
                'message': 'Document verified successfully',
                'confidence': extracted_data.get('confidence', 'medium')
            }
        else:
            return {
                'valid': False,
                'document_type': document_type,
                'message': 'Could not extract sufficient data from document'
            }

# Singleton instance
gemini_ocr_service = GeminiOCRService()
