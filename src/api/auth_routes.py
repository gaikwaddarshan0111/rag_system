from fastapi import APIRouter, Depends, HTTPException, status
from src.auth.dependencies import get_current_user
from sqlalchemy.orm import Session

from src.auth.database import get_db
from src.auth.models import User
from src.auth.schemas import LoginResponse, LoginRequest
from src.auth.security import(

    verify_password,
    create_access_token
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post(
    "/login",
    response_model=LoginResponse
)

def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db)
):

    # =============================
    # FIND USER
    # =============================

    user =(
        db.query(User)
        .filter(
            User.username == credentials.username
        )
        .first()
    )

    if not user:

         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )


    # ==========================================
    # CHECK ACTIVE
    # ==========================================

    if not user.is_active:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )


    # ==========================================
    # VERIFY PASSWORD
    # ==========================================

    if not verify_password(
        credentials.password,
        user.password_hash
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )



    # ==========================================
    # CREATE JWT
    # ==========================================

    access_token = create_access_token(
        username=user.username,
        role=user.role
    )


    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        username=user.username,
        role=user.role
    )

@router.get("/me")
def get_me(
    current_user=Depends(get_current_user)
):
    return{
        "username": current_user["username"],
        "role": current_user["role"]
    }