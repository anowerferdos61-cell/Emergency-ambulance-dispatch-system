from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from typing import Annotated, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel, Field

import models
from database import engine, SessionLocal
from router import auth, admin, driver
from router.auth import get_current_user, get_optional_current_user

app = FastAPI(title="Emergency Ambulance Dispatch System API")

# Setup CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Automatically create all tables on PostgreSQL (Neon)
models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(driver.router, prefix="/driver", tags=["Driver"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]
optional_user_dependency = Annotated[Optional[dict], Depends(get_optional_current_user)]


class EmergencyRequestCreate(BaseModel):
    pickup_location: str
    patient_name: Optional[str] = "Emergency Patient"
    contact_number: Optional[str] = "01303-446161"
    hospital_destination: Optional[str] = None
    destination_hospital: Optional[str] = None
    emergency_severity: Optional[str] = "Urgent"  # Critical, Urgent, Normal
    emergency_type: Optional[str] = None
    notes: Optional[str] = None
    ambulance_id: Optional[int] = None
    booking_date: Optional[str] = None  # Date string or None for immediate
    is_scheduled: Optional[bool] = False


class GuestEmergencyBookingCreate(BaseModel):
    patient_name: str = "Emergency Patient"
    contact_number: str = "01303-446161"
    pickup_location: str
    hospital_destination: Optional[str] = "Nearest Emergency Hospital in Dhaka"
    emergency_severity: Optional[str] = "Urgent"
    notes: Optional[str] = None
    ambulance_id: Optional[int] = None
    booking_date: Optional[str] = None
    is_scheduled: Optional[bool] = False


class QuickSOSRequest(BaseModel):
    pickup_location: str
    contact_number: Optional[str] = None
    patient_name: Optional[str] = "Emergency Patient"
    hospital_destination: Optional[str] = "Nearest Emergency Hospital"
    emergency_severity: Optional[str] = "Critical"
    ambulance_id: Optional[int] = None
    booking_date: Optional[str] = None


# --- Quick SOS & Nearest Ambulances ---

@app.get("/emergency/nearest", tags=["Emergency Requests"])
def get_nearest_ambulances(
    db: db_dependency,
    location: Optional[str] = Query(None, description="Current user location or area"),
    limit: int = Query(5, description="Number of nearest drivers to return")
):
    # Only available ambulances
    query = db.query(models.Ambulance).filter(models.Ambulance.status == "available")
    
    # Filter out ambulances where the linked driver is not yet verified
    unverified_driver_ids = [
        u.id for u in db.query(models.User).filter(models.User.role == "driver", models.User.is_verified == False).all()
    ]
    if unverified_driver_ids:
        query = query.filter(~models.Ambulance.driver_user_id.in_(unverified_driver_ids))

    if location:
        pattern = f"%{location}%"
        # Match nearest in same city/area first
        matched = query.filter(models.Ambulance.base_location.ilike(pattern)).limit(limit).all()
        if len(matched) < limit:
            remaining = limit - len(matched)
            matched_ids = [m.id for m in matched]
            others = query.filter(~models.Ambulance.id.in_(matched_ids)).limit(remaining).all() if matched_ids else query.limit(remaining).all()
            return matched + others
        return matched
    return query.limit(limit).all()


@app.post("/emergency/quick_sos", tags=["Emergency Requests"])
def create_quick_sos(
    payload: QuickSOSRequest,
    user: user_dependency,
    db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # De-duplication check: prevent multiple duplicate requests from same user within 45 seconds
    cutoff = datetime.utcnow() - timedelta(seconds=45)
    existing_recent = db.query(models.EmergencyRequest).filter(
        models.EmergencyRequest.user_id == user["id"],
        models.EmergencyRequest.status.in_(["pending", "assigned", "on_the_way"]),
        models.EmergencyRequest.requested_at >= cutoff
    ).first()

    if existing_recent:
        return {
            "message": "🚨 Active emergency dispatch in progress!",
            "request_id": existing_recent.id,
            "status": existing_recent.status
        }

    contact = payload.contact_number or user.get("phone_number") or "Emergency Contact"
    patient = payload.patient_name or user.get("username") or "Emergency Patient"

    new_request = models.EmergencyRequest(
        user_id=user["id"],
        patient_name=patient,
        contact_number=contact,
        pickup_location=payload.pickup_location,
        hospital_destination=payload.hospital_destination or "Nearest Emergency Hospital",
        emergency_severity=payload.emergency_severity or "Critical",
        ambulance_id=payload.ambulance_id,
        status="pending"
    )

    if payload.ambulance_id:
        ambulance = db.query(models.Ambulance).filter(models.Ambulance.id == payload.ambulance_id).first()
        if ambulance and ambulance.status == "available":
            ambulance.status = "dispatched"
            new_request.status = "assigned"
            new_request.total_fare = ambulance.base_fare
            new_request.driver_user_id = ambulance.driver_user_id

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return {
        "message": "🚨 1-Click SOS Dispatch Triggered! Emergency team notified.",
        "request_id": new_request.id,
        "status": new_request.status
    }



# --- Ambulance Catalog (Search, Filter, Sort, Pagination) ---

@app.get("/ambulances/all", tags=["Ambulances"])
def get_all_ambulances(
    db: db_dependency,
    search: Optional[str] = Query(None, description="Search by vehicle number, driver name, or location"),
    ambulance_type: Optional[str] = Query(None, description="Filter by type (ICU, AC, Non-AC, Basic Life Support)"),
    status: Optional[str] = Query(None, description="Filter by status (available, dispatched, maintenance)"),
    sort_by: Optional[str] = Query("newest", description="Sort by: newest, price_asc, price_desc, vehicle_number"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page")
):
    query = db.query(models.Ambulance)

    # Search
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                models.Ambulance.vehicle_number.ilike(search_pattern),
                models.Ambulance.driver_name.ilike(search_pattern),
                models.Ambulance.base_location.ilike(search_pattern)
            )
        )

    # Filter
    if ambulance_type:
        query = query.filter(models.Ambulance.ambulance_type == ambulance_type)
    if status:
        query = query.filter(models.Ambulance.status == status)

    # Sorting
    if sort_by == "newest":
        query = query.order_by(desc(models.Ambulance.created_at))
    elif sort_by == "price_asc":
        query = query.order_by(asc(models.Ambulance.base_fare))
    elif sort_by == "price_desc":
        query = query.order_by(desc(models.Ambulance.base_fare))
    elif sort_by == "vehicle_number":
        query = query.order_by(asc(models.Ambulance.vehicle_number))

    # Pagination
    total_count = query.count()
    total_pages = (total_count + limit - 1) // limit
    ambulances = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "total_count": total_count,
        "total_pages": total_pages,
        "current_page": page,
        "limit": limit,
        "data": ambulances
    }


@app.get("/ambulances/nearest", tags=["Ambulances"])
def get_nearest_ambulances(
    db: db_dependency,
    location: Optional[str] = Query(None, description="Location to find nearest ambulances in Dhaka")
):
    query = db.query(models.Ambulance).filter(models.Ambulance.status == "available")
    if location:
        exact_matches = query.filter(models.Ambulance.base_location.ilike(f"%{location}%")).all()
        if exact_matches:
            return {"drivers": exact_matches, "count": len(exact_matches), "location": location}

    # Fallback to all available ambulances in Dhaka if exact hub is busy
    fallback = query.limit(10).all()
    return {"drivers": fallback, "count": len(fallback), "location": location or "Dhaka"}


@app.get("/ambulances/{ambulance_id}", tags=["Ambulances"])
def get_ambulance_by_id(ambulance_id: int, db: db_dependency):
    ambulance = db.query(models.Ambulance).filter(models.Ambulance.id == ambulance_id).first()
    if not ambulance:
        raise HTTPException(status_code=404, detail="Ambulance not found")
    return ambulance


# --- Emergency Dispatch Requests (User & Guest) ---

@app.post("/emergency/request", tags=["Emergency Requests"])
def create_emergency_request(
    payload: EmergencyRequestCreate,
    user: user_dependency,
    db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # De-duplication check: prevent multiple duplicate requests from same user within 45 seconds (only for immediate)
    if not payload.is_scheduled:
        cutoff = datetime.utcnow() - timedelta(seconds=45)
        existing_recent = db.query(models.EmergencyRequest).filter(
            models.EmergencyRequest.user_id == user["id"],
            models.EmergencyRequest.status.in_(["pending", "assigned", "on_the_way"]),
            models.EmergencyRequest.requested_at >= cutoff
        ).first()

        if existing_recent:
            return {
                "message": "🚨 Active emergency dispatch in progress!",
                "request_id": existing_recent.id,
                "status": existing_recent.status
            }

    hospital = payload.hospital_destination or payload.destination_hospital or "Nearest Emergency Hospital in Dhaka"
    patient = payload.patient_name or (user.get("username") if isinstance(user, dict) else "Emergency Patient")
    contact = payload.contact_number or (user.get("phone_number") if isinstance(user, dict) else "01303-446161") or "01303-446161"
    severity = payload.emergency_severity or "Urgent"

    new_request = models.EmergencyRequest(
        user_id=user["id"],
        patient_name=patient,
        contact_number=contact,
        pickup_location=payload.pickup_location,
        hospital_destination=hospital,
        emergency_severity=severity,
        notes=payload.notes or payload.emergency_type or ("Scheduled Ambulance Booking" if payload.is_scheduled else "Direct Emergency Dispatch"),
        ambulance_id=payload.ambulance_id,
        booking_date=payload.booking_date,
        is_scheduled=bool(payload.is_scheduled),
        is_guest=False,
        status="pending"
    )

    # For Immediate Emergency (not scheduled): If ambulance selected, dispatch directly without admin delay!
    if not payload.is_scheduled and payload.ambulance_id:
        ambulance = db.query(models.Ambulance).filter(models.Ambulance.id == payload.ambulance_id).first()
        if ambulance and ambulance.status == "available":
            ambulance.status = "dispatched"
            new_request.status = "assigned"
            new_request.total_fare = ambulance.base_fare
            new_request.driver_user_id = ambulance.driver_user_id

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    msg = "Emergency ambulance dispatched directly!" if not payload.is_scheduled else "Scheduled ambulance booking received for admin confirmation!"

    return {
        "message": msg,
        "request_id": new_request.id,
        "status": new_request.status,
        "is_scheduled": new_request.is_scheduled
    }


@app.post("/emergency/guest_booking", tags=["Emergency Requests"])
def create_guest_emergency_booking(
    payload: GuestEmergencyBookingCreate,
    db: db_dependency
):
    """
    Public Guest Booking endpoint:
    - Non-logged-in users can ONLY submit advance scheduled bookings.
    - Today / Immediate emergency dispatch strictly requires login.
    """
    today_str = datetime.utcnow().strftime("%Y-%m-%d")

    # If guest attempts immediate dispatch or today's date without login, reject with 403/400
    if not payload.is_scheduled or not payload.booking_date or payload.booking_date <= today_str:
        raise HTTPException(
            status_code=400,
            detail="🚨 Emergency instant dispatch requires user login! Guests can only place advance scheduled bookings (future date)."
        )

    new_request = models.EmergencyRequest(
        user_id=None,
        patient_name=payload.patient_name or "Guest Patient",
        contact_number=payload.contact_number or "01303-446161",
        pickup_location=payload.pickup_location,
        hospital_destination=payload.hospital_destination or "Nearest Emergency Hospital in Dhaka",
        emergency_severity=payload.emergency_severity or "Normal",
        notes=payload.notes or f"Guest Scheduled Advance Booking for {payload.booking_date}",
        ambulance_id=payload.ambulance_id,
        booking_date=payload.booking_date,
        is_scheduled=True,
        is_guest=True,
        status="pending"
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return {
        "message": f"📅 Your advance scheduled booking for {payload.booking_date} has been submitted! Our admin team will review and assign an ambulance.",
        "request_id": new_request.id,
        "status": new_request.status,
        "is_scheduled": True,
        "is_guest": True
    }


@app.get("/emergency/my_requests", tags=["Emergency Requests"])
def get_my_emergency_requests(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    requests = db.query(models.EmergencyRequest).filter(
        models.EmergencyRequest.user_id == user["id"]
    ).order_by(desc(models.EmergencyRequest.requested_at)).all()
    return requests


@app.get("/emergency/status/{request_id}", tags=["Emergency Requests"])
def get_emergency_status(request_id: int, db: db_dependency):
    # Publicly accessible for live tracking by request_id (both user & guest)
    req = db.query(models.EmergencyRequest).filter(models.EmergencyRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Emergency request not found")

    ambulance_details = None
    driver_details = None

    if req.ambulance_id:
        ambulance_details = db.query(models.Ambulance).filter(models.Ambulance.id == req.ambulance_id).first()

    driver_id = req.driver_user_id or (ambulance_details.driver_user_id if ambulance_details else None)
    if driver_id:
        d_user = db.query(models.User).filter(models.User.id == driver_id).first()
        if d_user:
            driver_details = {
                "id": d_user.id,
                "username": d_user.username,
                "phone_number": d_user.phone_number,
                "driving_license": d_user.driving_license,
                "vehicle_number": d_user.vehicle_number,
            }

    return {
        "request": req,
        "ambulance": ambulance_details,
        "driver": driver_details
    }


@app.delete("/emergency/cancel/{request_id}", tags=["Emergency Requests"])
@app.put("/emergency/cancel/{request_id}", tags=["Emergency Requests"])
def cancel_emergency_request(request_id: int, user: optional_user_dependency, db: db_dependency):
    req = db.query(models.EmergencyRequest).filter(models.EmergencyRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Emergency request not found")

    # If it is a registered user request, check user credentials
    if not req.is_guest and req.user_id is not None:
        if user is None:
            raise HTTPException(status_code=401, detail="Please login to cancel this request")
        if req.user_id != user.get("id") and user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Not authorized to cancel this request")

    if req.status in ["completed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Request cannot be cancelled at this stage")

    req.status = "cancelled"
    req.completed_at = datetime.utcnow()

    # Release assigned ambulance
    if req.ambulance_id:
        amb = db.query(models.Ambulance).filter(models.Ambulance.id == req.ambulance_id).first()
        if amb:
            amb.status = "available"

    db.commit()
    return {"message": "Emergency request cancelled successfully"}
