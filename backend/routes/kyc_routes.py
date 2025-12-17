"""
API endpoint for KYC document upload and verification using EdenAI OCR.
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.edenai_ocr_service import EdenAIOCRService
from services.supabase_client import supabase_client
import os
import uuid
from datetime import datetime

router = APIRouter()

# Initialize EdenAI OCR service
try:
    edenai_ocr = EdenAIOCRService()
except ValueError as e:
    print(f"Warning: EdenAI OCR service not initialized: {e}")
    edenai_ocr = None

@router.post("/upload-kyc")
async def upload_kyc_document(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    document_type: str = Form(...)
):
    """
    Upload and process KYC document using EdenAI OCR.
    
    Args:
        file: Document image file
        user_id: User ID from Supabase auth
        document_type: Type of document (pan, aadhaar, itr, balance_sheet)
    
    Returns:
        Extracted document data and verification status
    """
    
    if not edenai_ocr:
        raise HTTPException(
            status_code=500,
            detail="OCR service not configured. Please set EDENAI_API_KEY."
        )
    
    try:
        # Create temp directory if it doesn't exist
        temp_dir = "temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save uploaded file temporarily
        file_extension = os.path.splitext(file.filename)[1]
        temp_filename = f"{uuid.uuid4()}{file_extension}"
        temp_filepath = os.path.join(temp_dir, temp_filename)
        
        with open(temp_filepath, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Extract text and data using EdenAI
        extraction_result = edenai_ocr.extract_text_from_image(
            temp_filepath,
            document_type
        )
        
        # Validate the document
        validation_result = edenai_ocr.validate_kyc_document(
            temp_filepath,
            document_type
        )
        
        # Store document metadata in Supabase
        document_data = {
            'user_id': user_id,
            'document_type': document_type,
            'file_name': file.filename,
            'extracted_data': extraction_result.get('extracted_data', {}),
            'validation_status': 'verified' if validation_result.get('valid') else 'failed',
            'confidence': extraction_result.get('confidence', 'medium'),
            'created_at': datetime.utcnow().isoformat()
        }
        
        # Insert into kyc_documents table
        result = supabase_client.client.table('kyc_documents').insert(document_data).execute()
        
        # Clean up temp file
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)
        
        return {
            'success': True,
            'message': 'Document processed successfully',
            'document_id': result.data[0]['id'] if result.data else None,
            'extracted_data': extraction_result.get('extracted_data', {}),
            'validation': validation_result,
            'confidence': extraction_result.get('confidence', 'medium')
        }
        
    except Exception as e:
        # Clean up temp file on error
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)
        
        raise HTTPException(
            status_code=500,
            detail=f"Document processing failed: {str(e)}"
        )

@router.get("/kyc-documents/{user_id}")
async def get_user_kyc_documents(user_id: str):
    """
    Get all KYC documents for a user.
    
    Args:
        user_id: User ID from Supabase auth
    
    Returns:
        List of KYC documents with extracted data
    """
    try:
        result = supabase_client.client.table('kyc_documents')\
            .select('*')\
            .eq('user_id', user_id)\
            .order('created_at', desc=True)\
            .execute()
        
        return {
            'success': True,
            'documents': result.data
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch documents: {str(e)}"
        )

@router.post("/verify-document")
async def verify_specific_document(
    file: UploadFile = File(...),
    document_type: str = Form(...)
):
    """
    Verify a specific document without storing (for testing).
    
    Args:
        file: Document image file
        document_type: Type of document (pan, aadhaar, itr, balance_sheet)
    
    Returns:
        Extracted data and verification status
    """
    
    if not edenai_ocr:
        raise HTTPException(
            status_code=500,
            detail="OCR service not configured. Please set EDENAI_API_KEY."
        )
    
    try:
        # Create temp directory
        temp_dir = "temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save file temporarily
        file_extension = os.path.splitext(file.filename)[1]
        temp_filename = f"{uuid.uuid4()}{file_extension}"
        temp_filepath = os.path.join(temp_dir, temp_filename)
        
        with open(temp_filepath, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Extract and validate
        extraction_result = edenai_ocr.extract_text_from_image(
            temp_filepath,
            document_type
        )
        
        validation_result = edenai_ocr.validate_kyc_document(
            temp_filepath,
            document_type
        )
        
        # Clean up
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)
        
        return {
            'success': True,
            'extracted_data': extraction_result.get('extracted_data', {}),
            'raw_text': extraction_result.get('raw_text', ''),
            'validation': validation_result,
            'confidence': extraction_result.get('confidence', 'medium'),
            'document_type': extraction_result.get('document_type', document_type)
        }
        
    except Exception as e:
        # Clean up on error
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)
        
        raise HTTPException(
            status_code=500,
            detail=f"Document verification failed: {str(e)}"
        )
