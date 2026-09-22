from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Annotated, Optional
from database import SessionLocal
from models import Ambulance, EmergencyRequest, User
from fastapi.responses import JSONResponse
from router.auth import get_current_user

router = APIRouter()


class AmbulanceCreate(BaseModel):
    vehicle_number: str = Field(..., max_length=100)
    ambulance_type: str = Field(..., max_length=100)  # ICU, AC, Non-AC, Basic Life Support
    driver_name: str = Field(..., max_length=100)
    driver_phone: str = Field(..., max_length=50)
    base_location: str = Field(..., max_length=200)
    base_fare: float = Field(default=1500.0, gt=0)
    price_per_km: float = Field(default=50.0, gt=0)
    status: Optional[str] = "available"  # available, dispatched, maintenance
    image_url: Optional[str] = None


class AmbulanceUpdate(BaseModel):
    vehicle_number: Optional[str] = Field(None, max_length=100)
    ambulance_type: Optional[str] = Field(None, max_length=100)
    driver_name: Optional[str] = Field(None, max_length=100)
    driver_phone: Optional[str] = Field(None, max_length=50)
    base_location: Optional[str] = Field(None, max_length=200)
    base_fare: Optional[float] = Field(None, gt=0)
    price_per_km: Optional[float] = Field(None, gt=0)
    status: Optional[str] = None
    image_url: Optional[str] = None


class AssignAmbulance(BaseModel):
    request_id: int
    ambulance_id: int


class UpdateDispatchStatus(BaseModel):
    status: str  # assigned, on_the_way, completed, cancelled


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


# --- Ambulance Fleet CRUD ---

@router.post("/ambulances")
def create_ambulance(ambulance: AmbulanceCreate, db: db_dependency, current_user: user_dependency):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required.")

    existing = db.query(Ambulance).filter(Ambulance.vehicle_number == ambulance.vehicle_number).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ambulance with this vehicle number already exists.")

    new_ambulance = Ambulance(**ambulance.model_dump())
    db.add(new_ambulance)
    db.commit()
    db.refresh(new_ambulance)
    return JSONResponse(
        content={"message": "Ambulance added successfully", "ambulance_id": new_ambulance.id},
        status_code=201
    )


@router.put("/ambulances/{ambulance_id}")
def update_ambulance(ambulance_id: int, ambulance: AmbulanceUpdate, db: db_dependency, current_user: user_dependency):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required.")

    existing_ambulance = db.query(Ambulance).filter(Ambulance.id == ambulance_id).first()
    if not existing_ambulance:
        raise HTTPException(status_code=404, detail="Ambulance not found")

    update_data = ambulance.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(existing_ambulance, key, value)

    db.commit()
    return JSONResponse(content={"message": "Ambulance updated successfully"}, status_code=200)


@router.delete("/ambulances/{ambulance_id}")
def delete_ambulance(ambulance_id: int, db: db_dependency, current_user: user_dependency):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required.")

    existing_ambulance = db.query(Ambulance).filter(Ambulance.id == ambulance_id).first()
    if not existing_ambulance:
        raise HTTPException(status_code=404, detail="Ambulance not found")

    db.delete(existing_ambulance)
    db.commit()
    return JSONResponse(content={"message": "Ambulance deleted successfully"}, status_code=200)


# --- Dispatch & Request Management ---

@router.get("/dispatches")
def get_all_dispatches(db: db_dependency, current_user: user_dependency, status: Optional[str] = None):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required.")

    query = db.query(EmergencyRequest)
    if status:
        query = query.filter(EmergencyRequest.status == status)

    dispatches = query.order_by(EmergencyRequest.requested_at.desc()).all()
    return dispatches


@router.post("/assign_ambulance")
def assign_ambulance(payload: AssignAmbulance, db: db_dependency, current_user: user_dependency):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required.")

    req = db.query(EmergencyRequest).filter(EmergencyRequest.id == payload.request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Emergency request not found")

    ambulance = db.query(Ambulance).filter(Ambulance.id == payload.ambulance_id).first()
    if not ambulance:
        raise HTTPException(status_code=404, detail="Ambulance not found")

    if ambulance.status != "available":
        raise HTTPException(status_code=400, detail="This ambulance is currently not available")

    # Assign and update status
    req.ambulance_id = ambulance.id
    req.driver_user_id = ambulance.driver_user_id
    req.total_fare = ambulance.base_fare
    req.status = "assigned"
    ambulance.status = "dispatched"

    db.commit()
    return JSONResponse(content={"message": "Ambulance assigned successfully"}, status_code=200)


@router.put("/dispatch_status/{request_id}")
def update_dispatch_status(request_id: int, payload: UpdateDispatchStatus, db: db_dependency, current_user: user_dependency):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required.")

    req = db.query(EmergencyRequest).filter(EmergencyRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Emergency request not found")

    req.status = payload.status

    # If completed or cancelled, free the ambulance
    if payload.status in ["completed", "cancelled"]:
        req.completed_at = datetime.utcnow()
        if req.ambulance_id:
            ambulance = db.query(Ambulance).filter(Ambulance.id == req.ambulance_id).first()
            if ambulance:
                ambulance.status = "available"

    db.commit()
    return JSONResponse(content={"message": f"Dispatch status updated to {payload.status}"}, status_code=200)


@router.get("/dashboard_stats")
def get_admin_dashboard_stats(db: db_dependency, current_user: user_dependency):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required.")

    total_ambulances = db.query(Ambulance).count()
    available_ambulances = db.query(Ambulance).filter(Ambulance.status == "available").count()
    dispatched_ambulances = db.query(Ambulance).filter(Ambulance.status == "dispatched").count()

    total_requests = db.query(EmergencyRequest).count()
    pending_requests = db.query(EmergencyRequest).filter(EmergencyRequest.status == "pending").count()
    scheduled_requests = db.query(EmergencyRequest).filter(EmergencyRequest.is_scheduled == True, EmergencyRequest.status == "pending").count()
    active_dispatches = db.query(EmergencyRequest).filter(EmergencyRequest.status.in_(["assigned", "on_the_way"])).count()
    completed_requests = db.query(EmergencyRequest).filter(EmergencyRequest.status == "completed").count()

    return {
        "total_ambulances": total_ambulances,
        "available_ambulances": available_ambulances,
        "dispatched_ambulances": dispatched_ambulances,
        "total_requests": total_requests,
        "pending_requests": pending_requests,
        "scheduled_requests": scheduled_requests,
        "active_dispatches": active_dispatches,
        "completed_requests": completed_requests
    }


# --- User Management ---

@router.get("/users")
def get_all_users(db: db_dependency, current_user: user_dependency):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required.")

    users = db.query(User).order_by(User.id.desc()).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "phone_number": u.phone_number,
            "role": u.role,
            "is_active": u.is_active,
            "is_verified": u.is_verified,
            "driving_license": u.driving_license,
            "vehicle_number": u.vehicle_number,
            "created_at": u.created_at
        }
        for u in users
    ]


# --- Driver Verification ---

@router.get("/drivers")
def get_all_drivers(db: db_dependency, current_user: user_dependency):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required.")

    drivers = db.query(User).filter(User.role == "driver").order_by(User.id.desc()).all()
    result = []
    for d in drivers:
        amb = db.query(Ambulance).filter(Ambulance.driver_user_id == d.id).first()
        result.append({
            "id": d.id,
            "username": d.username,
            "email": d.email,
            "phone_number": d.phone_number,
            "is_verified": d.is_verified,
            "driving_license": d.driving_license,
            "vehicle_number": d.vehicle_number or (amb.vehicle_number if amb else None),
            "ambulance_type": amb.ambulance_type if amb else "AC Ambulance",
            "base_location": amb.base_location if amb else "Dhanmondi",
            "ambulance_status": amb.status if amb else "maintenance",
            "ambulance_id": amb.id if amb else None,
            "created_at": d.created_at
        })
    return result


@router.put("/drivers/{driver_id}/verify")
def toggle_driver_verification(driver_id: int, db: db_dependency, current_user: user_dependency):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required.")

    driver = db.query(User).filter(User.id == driver_id, User.role == "driver").first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    driver.is_verified = not driver.is_verified

    # Sync linked Ambulance status
    ambulance = db.query(Ambulance).filter(Ambulance.driver_user_id == driver.id).first()
    if ambulance:
        if driver.is_verified:
            ambulance.status = "available"
        else:
            ambulance.status = "maintenance"
    elif driver.is_verified:
        # If driver didn't have an ambulance record yet, create one
        v_num = driver.vehicle_number if driver.vehicle_number else f"DHA-AMB-{driver.id}"
        new_amb = Ambulance(
            vehicle_number=v_num,
            ambulance_type="AC Ambulance",
            driver_name=driver.username,
            driver_phone=driver.phone_number or "",
            driver_user_id=driver.id,
            base_location="Dhanmondi",
            base_fare=1500.0,
            price_per_km=50.0,
            status="available"
        )
        db.add(new_amb)

    db.commit()

    status_str = "Verified & Ambulance Activated" if driver.is_verified else "Verification Revoked / Suspended"
    return {"message": f"Driver {driver.username}: {status_str}", "is_verified": driver.is_verified}