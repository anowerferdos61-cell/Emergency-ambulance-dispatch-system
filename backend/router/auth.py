from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone
from typing import Annotated, Optional
from database import SessionLocal
from models import User, Ambulance
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt

router = APIRouter()

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
OAuth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/login')

SECRET_KEY = '86746eeb8285ca279c6251e0bd83cdd50c88027b934a93f19d8b9af782139516'
ALGORITHM = 'HS256'


class CreateUsers(BaseModel):
    email: str
    username: str
    password: str
    phone_number: Optional[str] = None
    role: str = "user"  # "admin", "driver", "user"
    driving_license: Optional[str] = None
    vehicle_number: Optional[str] = None
    ambulance_type: Optional[str] = "AC Ambulance"
    base_location: Optional[str] = "Dhanmondi"


class UpdateUser(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    phone_number: Optional[str] = None
    driving_license: Optional[str] = None
    vehicle_number: Optional[str] = None


class UpdatePassword(BaseModel):
    current_password: str
    new_password: str


class ForgotPassword(BaseModel):
    email: str
    new_password: str


def authenticate_user(username: str, password: str, db: Session):
    user = db.query(User).filter((User.username == username) | (User.email == username)).first()
    if user is None:
        return False
    if not bcrypt_context.verify(password, user.hash_password):
        return False
    return user


def create_access_token(username: str, user_id: int, role: str, expires_delta: timedelta):
    encode = {'sub': username, 'id': user_id, 'role': role}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: Annotated[str, Depends(OAuth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        role: str = payload.get('role')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user.')
        return {'username': username, 'id': user_id, 'role': role}
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user.')


oauth2_optional = OAuth2PasswordBearer(tokenUrl='auth/login', auto_error=False)


def get_optional_current_user(token: Annotated[Optional[str], Depends(oauth2_optional)]):
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        role: str = payload.get('role')
        if username is None or user_id is None:
            return None
        return {'username': username, 'id': user_id, 'role': role}
    except Exception:
        return None


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]
optional_user_dependency = Annotated[Optional[dict], Depends(get_optional_current_user)]


@router.post('/signup')
def create_users(db: db_dependency, new_user: CreateUsers):
    existing_user = db.query(User).filter(
        (User.username == new_user.username) | (User.email == new_user.email)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or Email already registered")

    # If driver, check vehicle number uniqueness if provided
    if new_user.role == "driver" and new_user.vehicle_number:
        existing_vehicle = db.query(Ambulance).filter(Ambulance.vehicle_number == new_user.vehicle_number).first()
        if existing_vehicle:
            raise HTTPException(status_code=400, detail="An ambulance with this vehicle number is already registered")

    # Drivers start with pending verification by admin
    is_verified = True if new_user.role != "driver" else False

    user_model = User(
        email=new_user.email,
        username=new_user.username,
        phone_number=new_user.phone_number,
        hash_password=bcrypt_context.hash(new_user.password),
        is_active=True,
        is_verified=is_verified,
        role=new_user.role,
        driving_license=new_user.driving_license,
        vehicle_number=new_user.vehicle_number,
    )

    db.add(user_model)
    db.commit()
    db.refresh(user_model)

    # If new user is a driver, automatically create or link their Ambulance in the fleet
    if new_user.role == "driver":
        v_num = new_user.vehicle_number if new_user.vehicle_number else f"DHA-AMB-{user_model.id}"
        amb_type = new_user.ambulance_type if new_user.ambulance_type else "AC Ambulance"
        base_loc = new_user.base_location if new_user.base_location else "Dhanmondi"

        existing_amb = db.query(Ambulance).filter(Ambulance.vehicle_number == v_num).first()
        if existing_amb:
            existing_amb.driver_user_id = user_model.id
            existing_amb.driver_name = user_model.username
            existing_amb.driver_phone = user_model.phone_number or ""
            existing_amb.ambulance_type = amb_type
            existing_amb.base_location = base_loc
            existing_amb.status = "maintenance"
        else:
            fare = 1500.0
            if "ICU" in amb_type:
                fare = 3500.0
            elif "Freezer" in amb_type:
                fare = 2500.0
            elif "Non-AC" in amb_type:
                fare = 1200.0

            new_ambulance = Ambulance(
                vehicle_number=v_num,
                ambulance_type=amb_type,
                driver_name=user_model.username,
                driver_phone=user_model.phone_number or "",
                driver_user_id=user_model.id,
                base_location=base_loc,
                base_fare=fare,
                price_per_km=50.0,
                status="maintenance",  # Maintenance / Inactive until admin approves the driver
            )
            db.add(new_ambulance)
        db.commit()

    msg = "Account created successfully!" if new_user.role != "driver" else "Driver and ambulance registered successfully! Awaiting admin verification."
    return JSONResponse(status_code=201, content={'message': msg, 'is_verified': is_verified})


@router.post('/login')
def login_user(db: db_dependency, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=401, detail='Invalid username or password.')

    token = create_access_token(user.username, user.id, user.role, timedelta(hours=24))
    return {
        'access_token': token,
        'token_type': 'bearer',
        'role': user.role,
        'username': user.username,
        'user_id': user.id,
        'is_verified': user.is_verified,
    }


@router.get('/me')
def get_user_profile(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail='Failed Authentication')
    db_user = db.query(User).filter(User.id == user.get('id')).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "phone_number": db_user.phone_number,
        "role": db_user.role,
        "is_verified": db_user.is_verified,
        "driving_license": db_user.driving_license,
        "vehicle_number": db_user.vehicle_number,
        "created_at": db_user.created_at
    }


@router.post('/forgot-password')
def forgot_password(data: ForgotPassword, db: db_dependency):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User with this email not found")

    user.hash_password = bcrypt_context.hash(data.new_password)
    db.commit()
    return JSONResponse(status_code=200, content={'message': 'Password has been reset successfully'})


@router.put('/profile')
@router.put('/me')
def update_user_profile(user: user_dependency, data: UpdateUser, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail='Failed Authentication')
    db_user = db.query(User).filter(User.id == user.get('id')).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if username changed and is unique
    if data.username and data.username != db_user.username:
        existing_u = db.query(User).filter(User.username == data.username, User.id != db_user.id).first()
        if existing_u:
            raise HTTPException(status_code=400, detail="Username is already taken by another account")
        db_user.username = data.username

    # Check if email changed and is unique
    if data.email and data.email != db_user.email:
        existing_e = db.query(User).filter(User.email == data.email, User.id != db_user.id).first()
        if existing_e:
            raise HTTPException(status_code=400, detail="Email is already in use by another account")
        db_user.email = data.email

    if data.phone_number is not None:
        db_user.phone_number = data.phone_number

    if data.driving_license is not None and db_user.role == 'driver':
        db_user.driving_license = data.driving_license

    if data.vehicle_number is not None and db_user.role == 'driver':
        db_user.vehicle_number = data.vehicle_number

    # Sync with linked Ambulance if user is a driver
    if db_user.role == 'driver':
        amb = db.query(Ambulance).filter(Ambulance.driver_user_id == db_user.id).first()
        if amb:
            if data.username:
                amb.driver_name = db_user.username
            if data.phone_number is not None:
                amb.driver_phone = db_user.phone_number
            if data.vehicle_number is not None:
                amb.vehicle_number = db_user.vehicle_number

    db.commit()
    db.refresh(db_user)

    return {
        "message": "Profile updated successfully!",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
            "phone_number": db_user.phone_number,
            "role": db_user.role,
            "is_verified": db_user.is_verified,
            "driving_license": db_user.driving_license,
            "vehicle_number": db_user.vehicle_number,
            "created_at": str(db_user.created_at) if db_user.created_at else None
        }
    }


@router.put('/change-password')
@router.post('/change-password')
def change_password(user: user_dependency, data: UpdatePassword, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail='Failed Authentication')
    db_user = db.query(User).filter(User.id == user.get('id')).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not bcrypt_context.verify(data.current_password, db_user.hash_password):
        raise HTTPException(status_code=400, detail="Current password does not match")

    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters long")

    db_user.hash_password = bcrypt_context.hash(data.new_password)
    db.commit()
    return JSONResponse(status_code=200, content={'message': 'Password changed successfully!'})