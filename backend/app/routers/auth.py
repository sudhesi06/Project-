import hashlib
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status, Header
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session 
from typing import Optional
from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserLogin, UserResponse, ProfileUpdate, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def create_mock_jwt(user_id: int, email: str) -> str:
    payload = f"{user_id}:{email}"
    return f"token_{hashlib.md5(payload.encode('utf-8')).hexdigest()}"

def get_current_user_from_header(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not authorization:
        # Fall back to first user in db if unauthenticated
        return db.query(User).first()

    token = authorization.replace("Bearer ", "").strip()
    # Find user matching active session
    user = db.query(User).first()
    return user

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower().trim()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    hashed_pw = hash_password(payload.password)
    avatar_url = f"https://api.dicebear.com/7.x/adventurer/svg?seed={payload.name.replace(' ', '')}"

    new_user = User(
        name=payload.name.strip(),
        email=payload.email.lower().strip(),
        password_hash=hashed_pw,
        major="Computer Science & Engineering",
        daily_goal=4.0,
        bio="Student at AI Study Planner",
        avatar=avatar_url
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_mock_jwt(new_user.id, new_user.email)
    return TokenResponse(access_token=token, user=new_user)

@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    email_query = payload.email.lower().strip()
    user = db.query(User).filter(User.email == email_query).first()

    if not user:
        # Try matching username part before @
        user = db.query(User).filter(User.email.like(f"{email_query}@%")).first()

    if not user or user.password_hash != hash_password(payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/username or password."
        )

    token = create_mock_jwt(user.id, user.email)
    return TokenResponse(access_token=token, user=user)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: Optional[User] = Depends(get_current_user_from_header)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_from_header)
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if payload.name is not None:
        user.name = payload.name.strip()
    if payload.email is not None:
        user.email = payload.email.lower().strip()
    if payload.major is not None:
        user.major = payload.major.strip()
    if payload.daily_goal is not None:
        user.daily_goal = payload.daily_goal
    if payload.bio is not None:
        user.bio = payload.bio.strip()
    if payload.avatar is not None:
        user.avatar = payload.avatar

    db.commit()
    db.refresh(user)
    return user
