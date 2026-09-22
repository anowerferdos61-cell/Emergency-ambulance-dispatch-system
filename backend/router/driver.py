from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Annotated, Optional, List
from database import SessionLocal
from models import Ambulance, EmergencyRequest, User
from fastapi.responses import JSONResponse
from router.auth import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


class DriverStatusUpdate(BaseModel):
    status: str  # available, on_trip, maintenance


class DriverVehicleLink(BaseModel):
    vehicle_number: str
    ambulance_type: str
    base_location: str
    base_fare: float = 1500.0


# 1. Get Driver Info & Linked Ambulance
@router.get("/me")
def get_driver_me(user: user_dependency, db: db_dependency):
    if user['role'] != 'driver':
        raise HTTPException(status_code=403, detail="Driver access required.")

    driver_user = db.query(User).filter(User.id == user['id']).first()
    if not driver_user:
        raise HTTPException(status_code=404, detail="Driver profile not found")

    # Find linked ambulance or ambulance matching vehicle number
    ambulance = None
    if driver_user.vehicle_number:
        ambulance = db.query(Ambulance).filter(Ambulance.vehicle_number == driver_user.vehicle_number).first()
    if not ambulance:
        ambulance = db.query(Ambulance).filter(Ambulance.driver_user_id == driver_user.id).first()

    return {
        "id": driver_user.id,
        "username": driver_user.username,
        "email": driver_user.email,
        "phone_number": driver_user.phone_number,
        "is_verified": driver_user.is_verified,
        "driving_license": driver_user.driving_license,
        "vehicle_number": driver_user.vehicle_number,
        "ambulance": ambulance
    }


# 2. Toggle Driver / Ambulance Status
@router.put("/status")
def update_driver_status(payload: DriverStatusUpdate, user: user_dependency, db: db_dependency):
    if user['role'] != 'driver':
        raise HTTPException(status_code=403, detail="Driver access required.")

    driver_user = db.query(User).filter(User.id == user['id']).first()
    if not driver_user.is_verified:
        raise HTTPException(status_code=403, detail="Your driver account is pending admin verification.")

    ambulance = db.query(Ambulance).filter(
        (Ambulance.vehicle_number == driver_user.vehicle_number) | (Ambulance.driver_user_id == driver_user.id)
    ).first()

    if ambulance:
        ambulance.status = payload.status
        db.commit()

    return {"message": f"Status updated to {payload.status}", "status": payload.status}


# 3. Get Incoming Available Emergency Requests (Pending Dispatches in Dhaka)
@router.get("/incoming_requests")
def get_incoming_requests(user: user_dependency, db: db_dependency):
    if user['role'] != 'driver':
        raise HTTPException(status_code=403, detail="Driver access required.")

    driver_user = db.query(User).filter(User.id == user['id']).first()
    if not driver_user.is_verified:
        return []

    # Get pending requests or requests specifically assigned to this driver
    requests = db.query(EmergencyRequest).filter(
        (EmergencyRequest.status == "pending") | (EmergencyRequest.driver_user_id == driver_user.id)
    ).order_by(EmergencyRequest.requested_at.desc()).all()

    return requests


# 4. Get My Active & Completed Trips
@router.get("/my_trips")
def get_driver_trips(user: user_dependency, db: db_dependency):
    if user['role'] != 'driver':
        raise HTTPException(status_code=403, detail="Driver access required.")

    driver_user = db.query(User).filter(User.id == user['id']).first()
    trips = db.query(EmergencyRequest).filter(
        EmergencyRequest.driver_user_id == driver_user.id
    ).order_by(EmergencyRequest.requested_at.desc()).all()

    completed_count = sum(1 for t in trips if t.status == "completed")
    total_earnings = sum(t.total_fare for t in trips if t.status == "completed")

    return {
        "trips": trips,
        "completed_count": completed_count,
        "total_earnings": total_earnings
    }


# 5. Accept Emergency Trip
@router.post("/accept_trip/{request_id}")
def accept_trip(request_id: int, user: user_dependency, db: db_dependency):
    if user['role'] != 'driver':
        raise HTTPException(status_code=403, detail="Driver access required.")

    driver_user = db.query(User).filter(User.id == user['id']).first()
    if not driver_user.is_verified:
        raise HTTPException(status_code=403, detail="You must be verified by admin to accept trips.")

    req = db.query(EmergencyRequest).filter(EmergencyRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    if req.status not in ["pending", "assigned"]:
        raise HTTPException(status_code=400, detail="This trip is no longer available for acceptance.")

    ambulance = db.query(Ambulance).filter(
        (Ambulance.vehicle_number == driver_user.vehicle_number) | (Ambulance.driver_user_id == driver_user.id)
    ).first()

    req.driver_user_id = driver_user.id
    req.status = "on_the_way"
    if ambulance:
        req.ambulance_id = ambulance.id
        req.total_fare = ambulance.base_fare
        ambulance.status = "on_trip"

    db.commit()
    return {"message": "Emergency trip accepted! On the way to patient location.", "status": "on_the_way"}


# 6. Cancel / Reject Trip
@router.post("/cancel_trip/{request_id}")
def cancel_trip(request_id: int, user: user_dependency, db: db_dependency):
    if user['role'] != 'driver':
        raise HTTPException(status_code=403, detail="Driver access required.")

    driver_user = db.query(User).filter(User.id == user['id']).first()
    req = db.query(EmergencyRequest).filter(EmergencyRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    if req.driver_user_id != driver_user.id and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to cancel this trip")

    req.driver_user_id = None
    req.status = "pending"

    # Free ambulance back to available
    if req.ambulance_id:
        ambulance = db.query(Ambulance).filter(Ambulance.id == req.ambulance_id).first()
        if ambulance:
            ambulance.status = "available"

    db.commit()
    return {"message": "Trip cancelled and returned to emergency queue", "status": "pending"}


# 7. Complete Trip
@router.post("/complete_trip/{request_id}")
def complete_trip(request_id: int, user: user_dependency, db: db_dependency):
    if user['role'] != 'driver':
        raise HTTPException(status_code=403, detail="Driver access required.")

    driver_user = db.query(User).filter(User.id == user['id']).first()
    req = db.query(EmergencyRequest).filter(EmergencyRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    if req.driver_user_id != driver_user.id:
        raise HTTPException(status_code=403, detail="You are not assigned to this trip")

    req.status = "completed"
    req.completed_at = datetime.utcnow()

    # Free ambulance back to available
    if req.ambulance_id:
        ambulance = db.query(Ambulance).filter(Ambulance.id == req.ambulance_id).first()
        if ambulance:
            ambulance.status = "available"

    db.commit()
    return {"message": "Trip successfully completed!", "status": "completed"}
