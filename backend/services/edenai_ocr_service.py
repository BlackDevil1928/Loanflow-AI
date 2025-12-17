import os
import requests
import json
import base64
from typing import Dict, Any, Optional

class EdenAIOCRService:
    """
    EdenAI OCR Service for document text extraction and data parsing.
    Supports PAN Card, Aadhaar Card, ITR, and Balance Sheet documents.
    """
    
    def __init__(self):
        self.api_key = os.getenv('EDENAI_API_KEY')
        if not self.api_key:
            raise ValueError("EDENAI_API_KEY not found in environment variables")
        
        self.base_url = "https://api.edenai.run/v2"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def extract_text_from_image(self, image_path: str, document_type: str = "general") -> Dict[str, Any]:
        """
        Extract text and structured data from document image using EdenAI OCR.
        
        Args:
            image_path: Path to the image file
            document_type: Type of document (pan, aadhaar, itr, balance_sheet, general)
        
        Returns:
            Dictionary containing extracted text and structured data
        """
        try:
            # Read and encode image
            with open(image_path, 'rb') as image_file:
                image_data = base64.b64encode(image_file.read()).decode('utf-8')
            
            # Determine which EdenAI API to use based on document type
            if document_type.lower() in ['pan', 'aadhaar', 'pan_card', 'aadhaar_card']:
                return self._extract_identity_document(image_data, document_type)
            elif document_type.lower() in ['itr', 'income_tax', 'tax_return']:
                return self._extract_financial_document(image_data, 'itr')
            elif document_type.lower() in ['balance_sheet', 'financial_statement']:
                return self._extract_financial_document(image_data, 'balance_sheet')
            else:
                return self._extract_general_ocr(image_data)
                
        except FileNotFoundError:
            return {
                'success': False,
                'error': f'Image file not found: {image_path}'
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'OCR extraction failed: {str(e)}'
            }
    
    def _extract_identity_document(self, image_data: str, doc_type: str) -> Dict[str, Any]:
        """Extract data from identity documents (PAN/Aadhaar) using EdenAI Identity Parser."""
        
        url = f"{self.base_url}/ocr/identity_parser"
        
        payload = {
            "providers": "amazon,google,microsoft",  # Use multiple providers for accuracy
            "file": f"data:image/jpeg;base64,{image_data}",
            "fallback_providers": "google,microsoft"
        }
        
        try:
            response = requests.post(url, json=payload, headers=self.headers)
            response.raise_for_status()
            result = response.json()
            
            # Parse the response based on document type
            if doc_type.lower() in ['pan', 'pan_card']:
                return self._parse_pan_response(result)
            else:  # Aadhaar
                return self._parse_aadhaar_response(result)
                
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'EdenAI API request failed: {str(e)}'
            }
    
    def _extract_financial_document(self, image_data: str, doc_type: str) -> Dict[str, Any]:
        """Extract data from financial documents (ITR/Balance Sheet) using EdenAI Financial Parser."""
        
        url = f"{self.base_url}/ocr/financial_parser"
        
        payload = {
            "providers": "amazon,google,microsoft",
            "file": f"data:image/jpeg;base64,{image_data}",
            "document_type": "invoice",  # EdenAI financial parser
            "fallback_providers": "google,microsoft"
        }
        
        try:
            response = requests.post(url, json=payload, headers=self.headers)
            response.raise_for_status()
            result = response.json()
            
            if doc_type == 'itr':
                return self._parse_itr_response(result)
            else:
                return self._parse_balance_sheet_response(result)
                
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'EdenAI API request failed: {str(e)}'
            }
    
    def _extract_general_ocr(self, image_data: str) -> Dict[str, Any]:
        """Extract text using general OCR for any document type."""
        
        url = f"{self.base_url}/ocr/ocr"
        
        payload = {
            "providers": "amazon,google,microsoft",
            "file": f"data:image/jpeg;base64,{image_data}",
            "language": "en",
            "fallback_providers": "google,microsoft"
        }
        
        try:
            response = requests.post(url, json=payload, headers=self.headers)
            response.raise_for_status()
            result = response.json()
            
            # Extract text from the best provider
            extracted_text = ""
            if 'amazon' in result and result['amazon'].get('status') == 'success':
                extracted_text = result['amazon'].get('text', '')
            elif 'google' in result and result['google'].get('status') == 'success':
                extracted_text = result['google'].get('text', '')
            elif 'microsoft' in result and result['microsoft'].get('status') == 'success':
                extracted_text = result['microsoft'].get('text', '')
            
            return {
                'success': True,
                'document_type': 'general',
                'raw_text': extracted_text,
                'extracted_data': {},
                'confidence': 'high'
            }
            
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': f'EdenAI API request failed: {str(e)}'
            }
    
    def _parse_pan_response(self, result: Dict) -> Dict[str, Any]:
        """Parse PAN card data from EdenAI response."""
        
        extracted_data = {}
        
        # Try to get data from the best provider
        for provider in ['amazon', 'google', 'microsoft']:
            if provider in result and result[provider].get('status') == 'success':
                data = result[provider].get('extracted_data', [{}])[0] if result[provider].get('extracted_data') else {}
                
                extracted_data = {
                    'name': data.get('given_names', {}).get('value', '') + ' ' + data.get('last_name', {}).get('value', ''),
                    'panNumber': data.get('document_id', {}).get('value', ''),
                    'dob': data.get('birth_date', {}).get('value', ''),
                    'fatherName': data.get('mrz', {}).get('value', ''),  # May need adjustment
                }
                break
        
        return {
            'success': True,
            'document_type': 'PAN Card',
            'extracted_data': {k: v for k, v in extracted_data.items() if v},
            'raw_text': str(result),
            'confidence': 'high'
        }
    
    def _parse_aadhaar_response(self, result: Dict) -> Dict[str, Any]:
        """Parse Aadhaar card data from EdenAI response."""
        
        extracted_data = {}
        
        for provider in ['amazon', 'google', 'microsoft']:
            if provider in result and result[provider].get('status') == 'success':
                data = result[provider].get('extracted_data', [{}])[0] if result[provider].get('extracted_data') else {}
                
                extracted_data = {
                    'name': data.get('given_names', {}).get('value', '') + ' ' + data.get('last_name', {}).get('value', ''),
                    'aadhaarNumber': data.get('document_id', {}).get('value', ''),
                    'dob': data.get('birth_date', {}).get('value', ''),
                    'address': data.get('address', {}).get('value', ''),
                }
                break
        
        return {
            'success': True,
            'document_type': 'Aadhaar Card',
            'extracted_data': {k: v for k, v in extracted_data.items() if v},
            'raw_text': str(result),
            'confidence': 'high'
        }
    
    def _parse_itr_response(self, result: Dict) -> Dict[str, Any]:
        """Parse ITR document data from EdenAI response."""
        
        extracted_data = {}
        
        for provider in ['amazon', 'google', 'microsoft']:
            if provider in result and result[provider].get('status') == 'success':
                data = result[provider].get('extracted_data', [{}])[0] if result[provider].get('extracted_data') else {}
                
                extracted_data = {
                    'assessmentYear': data.get('invoice_number', {}).get('value', ''),
                    'totalIncome': data.get('invoice_total', {}).get('value', ''),
                    'taxPaid': data.get('taxes', [{}])[0].get('value', '') if data.get('taxes') else '',
                    'panNumber': data.get('customer_tax_id', {}).get('value', ''),
                    'taxpayerName': data.get('customer_name', {}).get('value', ''),
                }
                break
        
        return {
            'success': True,
            'document_type': 'Income Tax Return',
            'extracted_data': {k: v for k, v in extracted_data.items() if v},
            'raw_text': str(result),
            'confidence': 'high'
        }
    
    def _parse_balance_sheet_response(self, result: Dict) -> Dict[str, Any]:
        """Parse Balance Sheet data from EdenAI response."""
        
        extracted_data = {}
        
        for provider in ['amazon', 'google', 'microsoft']:
            if provider in result and result[provider].get('status') == 'success':
                data = result[provider].get('extracted_data', [{}])[0] if result[provider].get('extracted_data') else {}
                
                extracted_data = {
                    'companyName': data.get('customer_name', {}).get('value', ''),
                    'financialYear': data.get('date', {}).get('value', ''),
                    'totalAssets': data.get('invoice_total', {}).get('value', ''),
                    'totalLiabilities': data.get('subtotal', {}).get('value', ''),
                    'netWorth': '',  # Calculate or extract
                }
                break
        
        return {
            'success': True,
            'document_type': 'Balance Sheet',
            'extracted_data': {k: v for k, v in extracted_data.items() if v},
            'raw_text': str(result),
            'confidence': 'high'
        }
    
    def validate_kyc_document(self, image_path: str, document_type: str) -> Dict[str, Any]:
        """
        Validate KYC document and extract data.
        
        Args:
            image_path: Path to document image
            document_type: Type of document (pan, aadhaar, itr, balance_sheet)
        
        Returns:
            Validation result with extracted data
        """
        extracted_data = self.extract_text_from_image(image_path, document_type)
        
        if not extracted_data.get('success'):
            return {
                'valid': False,
                'document_type': document_type,
                'message': extracted_data.get('error', 'Extraction failed'),
                'extracted_data': {}
            }
        
        # Check if we have meaningful data
        has_data = bool(extracted_data.get('extracted_data'))
        
        if has_data:
            return {
                'valid': True,
                'document_type': extracted_data.get('document_type', document_type),
                'message': 'Document verified successfully',
                'confidence': extracted_data.get('confidence', 'medium'),
                'extracted_data': extracted_data.get('extracted_data', {})
            }
        else:
            return {
                'valid': False,
                'document_type': document_type,
                'message': 'Could not extract sufficient data from document',
                'extracted_data': {}
            }
