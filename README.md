# Appointment Board

A simple full-stack appointment management application for a small team.

The application allows users to view, create, edit, complete, cancel, and filter appointments while preventing overlapping time slots.

---

## Features

- View all appointments
- Add a new appointment
- Edit an existing appointment
- Mark an appointment as completed
- Cancel an appointment
- Filter appointments by date
- Filter appointments by status
- Prevent overlapping appointment time slots
- Validate required fields
- Validate that the end time is later than the start time
- Keep cancelled appointments visible
- Display success and error messages
- Includes sample appointments for immediate review

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios

### Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic

### Database

- SQLite

---

## Project Structure

```text
appointment-board/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── services.py
│   ├── seed.py
│   ├── requirements.txt
│   └── appointments.db
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppointmentCard.jsx
│   │   │   ├── AppointmentModal.jsx
│   │   │   └── AppointmentFilters.jsx
│   │   │
│   │   ├── services/
│   │   │   └── appointmentApi.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md


How the Application Works

The React frontend communicates with the FastAPI backend using Axios.

The backend handles validation, appointment business rules, and database operations through SQLAlchemy and SQLite.

React Frontend
      ↓
Axios API Requests
      ↓
FastAPI
      ↓
Service Layer
      ↓
CRUD Layer
      ↓
SQLAlchemy
      ↓
SQLite

Appointment Data

Each appointment contains:

ID

Title

Description

Date

Start time

End time

Status

Created timestamp

Updated timestamp

Possible statuses are:

scheduled
completed
cancelled

Example:

{
  "id": 1,
  "title": "Client Meeting",
  "description": "Discuss project requirements",
  "date": "2026-09-15",
  "start_time": "10:00:00",
  "end_time": "11:00:00",
  "status": "scheduled"
}

Validation

The application validates the following before saving an appointment:

Title is required

Date is required

Start time is required

End time is required

End time must be later than start time

The selected time slot must not overlap another active appointment

Conflict Detection

Two active appointments cannot overlap on the same date.

For example, if this appointment already exists:

10:00 - 11:00

then this appointment is rejected:

10:30 - 11:30

The backend uses this overlap rule:

new_start < existing_end and new_end > existing_start

Appointments that touch but do not overlap are allowed:

Appointment A: 10:00 - 11:00
Appointment B: 11:00 - 12:00

Appointment Status Rules

Scheduled

A scheduled appointment can be edited, completed, or cancelled.

Completed

A completed appointment remains visible and cannot be cancelled.

Cancelled

A cancelled appointment:

Remains visible on the board

Is clearly marked as cancelled

Cannot be completed

Does not block its previous time slot

Filtering

Appointments can be filtered by date:

GET /appointments?date=2026-09-15

By status:

GET /appointments?status=scheduled

Or by both:

GET /appointments?date=2026-09-15&status=scheduled

API Endpoints

Method

Endpoint

Description

GET

/

API information

GET

/health

Health check

GET

/appointments

Get all appointments

GET

/appointments/{id}

Get one appointment

POST

/appointments

Create appointment

PUT

/appointments/{id}

Update appointment

PATCH

/appointments/{id}/complete

Mark appointment completed

PATCH

/appointments/{id}/cancel

Cancel appointment

Running the Application

Backend

Open a terminal and go to the backend folder:

cd backend

Create a virtual environment:

python -m venv venv

Activate it on Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Add sample appointments:

python seed.py

Start the FastAPI server:

uvicorn main:app --reload

Backend:

http://127.0.0.1:8000

Swagger API documentation:

http://127.0.0.1:8000/docs

Frontend

Open another terminal:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Frontend:

http://localhost:5173

Sample Appointments

The project includes sample appointments so the board can be reviewed immediately.

Examples:

Daily Team Standup
09:00 - 09:30
Scheduled

Client Meeting
10:00 - 11:00
Scheduled

Project Review
11:30 - 12:00
Completed

Design Discussion
14:00 - 15:00
Cancelled

Assumptions

Time-slot conflicts are checked only for appointments on the same date.

Cancelled appointments remain visible for historical purposes.

Cancelled appointments do not block their previous time slot.

Completed appointments continue to occupy their original time slot.

Appointments that start exactly when another appointment ends are allowed.

Only scheduled appointments can be edited.

Only scheduled appointments can be completed or cancelled.

Authentication and user accounts are outside the scope of this task.

SQLite is sufficient because the application is intended for a small team.

Error Handling

Examples of errors displayed by the application:

Title is required.

End time must be later than start time.

Time slot conflicts with 'Client Meeting'.

Cancelled appointment cannot be completed.

Completed appointment cannot be cancelled.

Future Improvements

Possible future improvements include:

User authentication

Team member assignment

Calendar view

Appointment reminders

Email notifications

Search

Pagination

Automated tests

PostgreSQL support

Docker deployment

Role-based access control

Author

Developed as a practical full-stack assignment using React, FastAPI, SQLAlchemy, and SQLite.