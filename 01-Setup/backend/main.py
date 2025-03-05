from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from groq import Groq
import uuid
from fastapi.middleware.cors import CORSMiddleware


from dotenv import load_dotenv

load_dotenv()
# Initialize FastAPI app
app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

# Add after creating the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React development server
        "http://127.0.0.1:3000",   # Alternative local address
        # Add production URLs here when deployed
        # "https://your-production-domain.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
    expose_headers=["*"]
)
# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# System prompt configuration
system_prompt = {
    "role": "system",
    "content": "You are a helpful assistant. You reply with very short answers."
}

# In-memory storage for chat sessions
sessions = {}

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    response: str
    session_id: str

class SessionResponse(BaseModel):
    session_id: str

# Endpoints
@app.post("/start-session", response_model=SessionResponse)
def start_session():
    """Create a new chat session"""
    session_id = str(uuid.uuid4())
    sessions[session_id] = [system_prompt.copy()]
    return {"session_id": session_id}

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """Process a user message and return assistant response"""
    session_id = request.session_id
    
    # Validate session
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    chat_history = sessions[session_id]
    
    # Add user message to history
    chat_history.append({"role": "user", "content": request.message})
    
    try:
        # Get AI response
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=chat_history,
            max_tokens=100,
            temperature=1.2
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # Extract and store assistant response
    assistant_message = response.choices[0].message.content
    chat_history.append({"role": "assistant", "content": assistant_message})
    
    return {"response": assistant_message, "session_id": session_id}