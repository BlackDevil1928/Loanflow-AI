from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import agents
from agents.master_agent import master_agent
from agents.underwriting_agent import underwriting_agent
from agents.sanction_agent import sanction_agent

# Import models
from models.schemas import ChatMessage, ChatResponse

# Create FastAPI app
app = FastAPI(
    title="AI Loan Sales Assistant API",
    description="Backend API for AI-driven loan processing system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Loan Sales Assistant API",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI Loan Sales Assistant",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """
    Main chat endpoint - routes messages to appropriate agents
    """
    try:
        # Route message through master agent
        result = master_agent.route_message(
            user_id=message.user_id,
            message=message.message,
            has_file=message.has_file
        )
        
        response_text = result.get('response', '')
        next_stage = result.get('next_stage', '')
        
        # Update stage
        if next_stage:
            master_agent.update_state(message.user_id, stage=next_stage)
        
        # Auto-trigger underwriting if needed
        if result.get('trigger_underwriting'):
            underwriting_result = underwriting_agent.process(
                message.user_id,
                '',
                master_agent
            )
            response_text += "\n\n" + underwriting_result['response']
            
            # Auto-trigger sanction if approved
            if underwriting_result.get('trigger_sanction'):
                sanction_result = sanction_agent.process(
                    message.user_id,
                    '',
                    master_agent
                )
                response_text += "\n\n" + sanction_result['response']
                
                return ChatResponse(
                    response=response_text,
                    data=sanction_result.get('data')
                )
        
        return ChatResponse(
            response=response_text,
            data=result.get('data')
        )
    
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return ChatResponse(
            response="I apologize, but I encountered an error. Please try again or contact support if the issue persists."
        )

# Include KYC routes
from routes.kyc_routes import router as kyc_router
app.include_router(kyc_router, prefix="/api", tags=["KYC"])


@app.get("/api/download-sanction/{filename}")
async def download_sanction(filename: str):
    """
    Download sanction letter PDF
    """
    try:
        pdf_path = os.path.join(os.path.dirname(__file__), 'generated_pdfs', filename)
        
        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        return FileResponse(
            pdf_path,
            media_type='application/pdf',
            filename=filename
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/{user_id}/applications")
async def get_user_applications(user_id: str):
    """
    Get all loan applications for a user
    """
    from services.supabase_client import supabase_client
    
    try:
        # This would fetch from Supabase in production
        return {
            "applications": [],
            "message": "Feature requires Supabase configuration"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
