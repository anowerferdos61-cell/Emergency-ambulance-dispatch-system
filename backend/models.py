from database import Base
from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hash_password = Column(String)
    phone_number = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)  # Admin verifies drivers
    role = Column(String, default="user")  # "admin", "driver", "user"
    driving_license = Column(String, nullable=True)
    vehicle_number = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Ambulance(Base):
    __tablename__ = "ambulances"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_number = Column(String, unique=True, index=True)
    ambulance_type = Column(String, index=True)  # ICU, AC, Non-AC, Freezer Van
    driver_name = Column(String)
    driver_phone = Column(String)
    driver_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    base_location = Column(String, index=True)
    base_fare = Column(Float, default=1500.0)
    price_per_km = Column(Float, default=50.0)
    status = Column(String, default="available")  # available, on_trip, dispatched, maintenance
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class EmergencyRequest(Base):
    __tablename__ = "emergency_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    ambulance_id = Column(Integer, ForeignKey("ambulances.id"), nullable=True)
    driver_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    patient_name = Column(String)
    contact_number = Column(String)
    pickup_location = Column(String)
    hospital_destination = Column(String)
    emergency_severity = Column(String, default="Urgent")  # Critical, Urgent, Normal
    notes = Column(Text, nullable=True)
    booking_date = Column(String, nullable=True)  # Format: YYYY-MM-DD or readable date
    is_scheduled = Column(Boolean, default=False)  # True for future scheduled bookings
    is_guest = Column(Boolean, default=False)      # True for non-logged-in guest bookings
    status = Column(String, default="pending")  # pending, assigned, on_the_way, completed, cancelled
    total_fare = Column(Float, default=0.0)
    requested_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)