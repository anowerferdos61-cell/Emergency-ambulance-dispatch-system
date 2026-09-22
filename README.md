# Emergency Ambulance Dispatch System

A full-stack emergency ambulance booking, dispatch, and fleet management platform. The system connects patients, verified ambulance drivers, and dispatch administrators in real time to coordinate critical medical transport.

---

## Features

### Authentication & Role Management
- Secure JWT-based authentication with bcrypt password hashing.
- Role-based access control with distinct dashboards and permissions for:
  - **Admin**: Fleet management, driver verification, dispatch monitoring, and system metrics.
  - **Driver**: Vehicle status toggling, trip acceptance, live trip management, and earnings summary.
  - **User**: Emergency SOS requests, scheduled bookings, and past request history.
  - **Guest**: Advance scheduled booking without requiring instant authentication.
- Password recovery and profile management.

### Emergency Dispatch & Booking
- **1-Click SOS**: Fast emergency dispatch flow with automated nearby ambulance assignment.
- **Advance Scheduled Booking**: Pre-booking for future hospital transfers with date selection.
- **Live Status Tracking**: Real-time request progression tracking (`pending` -> `assigned` -> `on_the_way` -> `completed`).

### Fleet Catalog & Data Management
- Complete ambulance directory with support for ICU, AC, Non-AC, and Freezer van types.
- Live search by vehicle number, driver name, and base location.
- Multi-criteria filtering by ambulance category and availability status.
- Configurable sorting (newest, price low to high, price high to low, vehicle number).
- Paginated catalog with custom page size support.

---

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (Neon Cloud Serverless)
- **ORM**: SQLAlchemy
- **Authentication**: JWT (python-jose) with Passlib & Bcrypt
- **Validation**: Pydantic v2
- **Documentation**: Swagger UI & OpenAPI

### Frontend
- **Framework**: React 19 with Vite
- **Routing**: React Router DOM (v7) with protected route guards
- **Styling**: Tailwind CSS & DaisyUI
- **Icons & Notifications**: React Icons, React Hot Toast
- **HTTP Client**: Axios

---

## Project Structure

```text
.
├── backend/
│   ├── database.py              # Database connection and session management
│   ├── main.py                  # FastAPI application entry point & public endpoints
│   ├── models.py                # SQLAlchemy database models
│   ├── requirements.txt         # Backend Python dependencies
│   ├── router/
│   │   ├── admin.py             # Admin fleet and user management routes
│   │   ├── auth.py              # Authentication, signup, login, and profile routes
│   │   └── driver.py            # Driver dashboard, trip acceptance, and updates
│   └── seed_dhaka_ambulances.py # Seed script for demo fleet data
│
└── frontend/
    ├── src/
    │   ├── components/          # Reusable UI components (Navbar, Modals, Cards)
    │   ├── context/             # AuthContext state provider
    │   ├── layouts/             # Root layout and wrappers
    │   ├── pages/               # Pages (Home, Ambulances, Dashboards, Auth)
    │   ├── routes/              # Application route configuration
    │   └── services/            # Axios API client
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Getting Started Locally

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate   # On Windows: .venv\Scripts\activate
   ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. The API and interactive documentation will be available at:
   - API Docs: `http://127.0.0.1:8000/docs`

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

---

## API Endpoints Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | Public | Register new user or driver |
| `POST` | `/auth/login` | Public | Login and receive JWT access token |
| `GET` | `/auth/me` | Authenticated | Get logged-in user profile |
| `POST` | `/auth/forgot-password` | Public | Reset account password |
| `GET` | `/ambulances/all` | Public | Get paginated, filtered, sorted ambulance list |
| `POST` | `/emergency/quick_sos` | User | Trigger rapid 1-click emergency dispatch |
| `POST` | `/emergency/request` | User | Submit regular or scheduled booking request |
| `POST` | `/emergency/guest_booking` | Guest | Submit advance scheduled booking without login |
| `GET` | `/emergency/status/{id}` | Public | Live tracking for specific emergency request |
| `GET` | `/admin/dashboard_stats` | Admin | Real-time fleet and request counts |
| `POST` | `/admin/ambulances` | Admin | Add new ambulance to fleet |
| `POST` | `/admin/assign_ambulance` | Admin | Assign available ambulance to emergency request |
| `GET` | `/driver/my_trips` | Driver | View assigned active and completed trips |
| `POST` | `/driver/accept_trip/{id}` | Driver | Accept and begin emergency trip |
| `POST` | `/driver/complete_trip/{id}` | Driver | Mark trip as completed |

---

## License
This project is developed for educational and academic assessment purposes.
