from fastapi import FastAPI, HTTPException, Depends, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import random

app = FastAPI(title="CareerPrep Hub API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Configuration
SECRET_KEY = "b2b23ef4c58772f96fc831d3a5147ad2ff8b62239ed773607f43e6a4ae8a4c9a"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

# In-memory databases (replace with real database in production)
users_db = {}
resumes_db = {}
user_progress_db = {}

# Auth Models
class User(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    disabled: Optional[bool] = False

class UserInDB(User):
    hashed_password: str

class UserCreate(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Existing Models
class Resume(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    education: str
    experience: Optional[str] = ""
    skills: List[str]
    summary: Optional[str] = ""

class InterviewQuestion(BaseModel):
    question: str
    answer: Optional[str] = None

class PracticeQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer: str
    category: str

class PracticeAnswer(BaseModel):
    question_id: int
    selected_option: str

class UserProgress(BaseModel):
    user_id: str
    resume_completed: bool = False
    interviews_taken: int = 0
    practice_score: int = 0

# Authentication Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)
    return None

def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Mock data
INTERVIEW_QUESTIONS = [
    {"id": 1, "question": "Tell me about yourself.", "type": "general"},
    {"id": 2, "question": "What are your strengths and weaknesses?", "type": "general"},
    {"id": 3, "question": "Why do you want to work for our company?", "type": "general"},
    {"id": 4, "question": "Describe a challenging project you worked on.", "type": "technical"},
    {"id": 5, "question": "How do you handle tight deadlines?", "type": "behavioral"},
    {"id": 6, "question": "What are your salary expectations?", "type": "general"},
]

PRACTICE_QUESTIONS = [
    {
        "id": 1,
        "question": "What is the time complexity of binary search?",
        "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        "correct_answer": "O(log n)",
        "category": "Technical"
    },
    {
        "id": 2,
        "question": "Which HTTP method is used to update a resource?",
        "options": ["GET", "POST", "PUT", "DELETE"],
        "correct_answer": "PUT",
        "category": "Technical"
    },
    {
        "id": 3,
        "question": "What does SQL stand for?",
        "options": ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"],
        "correct_answer": "Structured Query Language",
        "category": "Technical"
    },
    {
        "id": 4,
        "question": "In a team meeting, you disagree with a colleague's approach. What do you do?",
        "options": ["Stay silent", "Argue publicly", "Discuss privately later", "Present alternative respectfully"],
        "correct_answer": "Present alternative respectfully",
        "category": "HR"
    },
    {
        "id": 5,
        "question": "What is 15% of 200?",
        "options": ["25", "30", "35", "40"],
        "correct_answer": "30",
        "category": "Aptitude"
    }
]

# Authentication Endpoints
@app.post("/api/auth/register", status_code=201)
def register(user: UserCreate):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email already exists
    for existing_user in users_db.values():
        if existing_user["email"] == user.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    users_db[user.username] = {
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "disabled": False
    }
    
    # Initialize user progress
    user_progress_db[user.username] = {
        "resume_completed": False,
        "interviews_taken": 0,
        "practice_score": 0
    }
    
    return {"message": "User registered successfully"}

@app.post("/api/auth/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.post("/api/auth/logout")
async def logout(current_user: User = Depends(get_current_active_user)):
    # In a real application, you would invalidate the token
    return {"message": "Successfully logged out"}

# Protected Endpoints
@app.get("/")
async def root():
    return {"message": "CareerPrep Hub API is running!"}

# Resume Builder Endpoints (Protected)
@app.post("/api/resume/build")
async def build_resume(resume: Resume, current_user: User = Depends(get_current_active_user)):
    resume_id = f"resume_{len(resumes_db) + 1}"
    resume_data = resume.dict()
    resume_data["owner"] = current_user.username
    resumes_db[resume_id] = resume_data
    
    # Update user progress
    if current_user.username not in user_progress_db:
        user_progress_db[current_user.username] = {"resume_completed": False, "interviews_taken": 0, "practice_score": 0}
    user_progress_db[current_user.username]["resume_completed"] = True
    
    return {
        "message": "Resume created successfully",
        "resume_id": resume_id,
        "resume": resume.dict()
    }

@app.get("/api/resume/{resume_id}")
async def get_resume(resume_id: str, current_user: User = Depends(get_current_active_user)):
    if resume_id not in resumes_db:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    resume = resumes_db[resume_id]
    if resume["owner"] != current_user.username:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {"resume": resume}

@app.get("/api/resume/user/list")
async def get_user_resumes(current_user: User = Depends(get_current_active_user)):
    user_resumes = [
        {"id": resume_id, "resume": resume}
        for resume_id, resume in resumes_db.items()
        if resume.get("owner") == current_user.username
    ]
    return {"resumes": user_resumes}

# Mock Interview Endpoints (Protected)
@app.get("/api/interview/questions")
async def get_interview_questions(current_user: User = Depends(get_current_active_user)):
    selected = random.sample(INTERVIEW_QUESTIONS, min(3, len(INTERVIEW_QUESTIONS)))
    return {"questions": selected}

@app.post("/api/interview/answer")
async def submit_interview_answer(
    data: dict = Body(...), 
    current_user: User = Depends(get_current_active_user)
):
    question = data.get("question", "")
    answer = data.get("answer", "")
    
    score = min(10, max(1, len(answer.split()) // 5))
    
    feedback_options = [
        "Good structure in your answer!",
        "Try to be more specific with examples.",
        "Great use of the STAR method!",
        "Consider adding more technical details.",
        "Well articulated response!"
    ]
    feedback = random.choice(feedback_options)
    
    # Update user progress
    if current_user.username not in user_progress_db:
        user_progress_db[current_user.username] = {"resume_completed": False, "interviews_taken": 0, "practice_score": 0}
    user_progress_db[current_user.username]["interviews_taken"] += 1
    
    return {
        "score": score,
        "feedback": feedback,
        "suggestions": "Practice speaking clearly and provide concrete examples."
    }

# Job Preparation Q&A Endpoints (Protected)
@app.get("/api/practice/questions")
async def get_practice_questions(current_user: User = Depends(get_current_active_user)):
    return {"questions": PRACTICE_QUESTIONS}

@app.get("/api/practice/questions/{category}")
async def get_questions_by_category(
    category: str, 
    current_user: User = Depends(get_current_active_user)
):
    filtered = [q for q in PRACTICE_QUESTIONS if q["category"].lower() == category.lower()]
    return {"questions": filtered}

@app.post("/api/practice/submit")
async def submit_practice_answers(
    data: dict = Body(...), 
    current_user: User = Depends(get_current_active_user)
):
    answers = data.get("answers", [])
    
    correct = 0
    results = []
    
    for ans in answers:
        question_id = ans.get("question_id")
        selected = ans.get("selected_option")
        
        question = next((q for q in PRACTICE_QUESTIONS if q["id"] == question_id), None)
        if question:
            is_correct = question["correct_answer"] == selected
            if is_correct:
                correct += 1
            
            results.append({
                "question_id": question_id,
                "question": question["question"],
                "selected": selected,
                "correct_answer": question["correct_answer"],
                "is_correct": is_correct
            })
    
    total = len(answers)
    percentage = (correct / total * 100) if total > 0 else 0
    
    # Update user progress
    if current_user.username not in user_progress_db:
        user_progress_db[current_user.username] = {"resume_completed": False, "interviews_taken": 0, "practice_score": 0}
    user_progress_db[current_user.username]["practice_score"] = max(
        user_progress_db[current_user.username]["practice_score"], 
        percentage
    )
    
    return {
        "score": correct,
        "total": total,
        "percentage": round(percentage, 2),
        "results": results
    }

# Dashboard Endpoints (Protected)
@app.get("/api/dashboard/progress")
async def get_user_progress(current_user: User = Depends(get_current_active_user)):
    progress = user_progress_db.get(current_user.username, {
        "resume_completed": False,
        "interviews_taken": 0,
        "practice_score": 0
    })
    return {"progress": progress}

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_active_user)):
    total_resumes = len(resumes_db)
    total_users = len(users_db)
    avg_practice_score = sum(p.get("practice_score", 0) for p in user_progress_db.values()) / max(1, total_users)
    
    return {
        "total_resumes": total_resumes,
        "total_users": total_users,
        "avg_practice_score": round(avg_practice_score, 2)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
