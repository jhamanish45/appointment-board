# Appointment Board

A full-stack appointment management application for a small team.

The application allows users to view, create, edit, complete, cancel, and filter appointments while preventing overlapping time slots.

## Features

- View all appointments
- Add new appointments
- Edit existing appointments
- Mark appointments as completed
- Cancel appointments
- Filter appointments by date
- Filter appointments by status
- Prevent overlapping appointment time slots
- Validate required fields
- Validate that end time is later than start time
- Keep cancelled appointments visible
- Display clear success and error messages
- Includes sample appointments for immediate review

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
│   │   ├── services/
│   │   │   └── appointmentApi.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## How It Works

```text
React Frontend
      ↓
Axios
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
```

The frontend communicates with the FastAPI backend using REST APIs. The backend validates appointment data, checks for time conflicts, applies business rules, and stores data in SQLite.

## Appointment Data

Each appointment contains:

- ID
- Title
- Description
- Date
- Start time
- End time
- Status
- Created timestamp
- Updated timestamp

Possible statuses:

```text
scheduled
completed
cancelled
```

Example:

```json
{
  "id": 1,
  "title": "Client Meeting",
  "description": "Discuss project requirements",
  "date": "2026-09-15",
  "start_time": "10:00:00",
  "end_time": "11:00:00",
  "status": "scheduled"
}
```

## Validation Rules

The application checks:

- Title is required
- Date is required
- Start time is required
- End time is required
- End time must be later than start time
- Active appointments cannot overlap on the same date

### Time Conflict Rule

```python
new_start < existing_end and new_end > existing_start
```

If an appointment exists from:

```text
10:00 - 11:00
```

then this is rejected:

```text
10:30 - 11:30
```

But this is allowed:

```text
11:00 - 12:00
```

## Appointment Status Rules

### Scheduled
A scheduled appointment can be:
- Edited
- Completed
- Cancelled

### Completed
A completed appointment:
- Remains visible
- Cannot be cancelled
- Continues to block its original time slot

### Cancelled
A cancelled appointment:
- Remains visible
- Is clearly marked as cancelled
- Cannot be completed
- Does not block its previous time slot

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API information |
| GET | `/health` | Health check |
| GET | `/appointments` | Get all appointments |
| GET | `/appointments/{id}` | Get one appointment |
| POST | `/appointments` | Create appointment |
| PUT | `/appointments/{id}` | Update appointment |
| PATCH | `/appointments/{id}/complete` | Mark appointment completed |
| PATCH | `/appointments/{id}/cancel` | Cancel appointment |

## Filtering

Filter by date:

```text
GET /appointments?date=2026-09-15
```

Filter by status:

```text
GET /appointments?status=scheduled
```

Filter by both:

```text
GET /appointments?date=2026-09-15&status=scheduled
```

## Run Locally

### Backend

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\\Scripts\\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Add sample data:

```bash
python seed.py
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Environment Variables

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

The frontend API configuration should use:

```javascript
baseURL: import.meta.env.VITE_API_BASE_URL
```

Do not commit `.env` files to GitHub.

## Deployment

### Frontend on Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Set the Root Directory to:

```text
frontend
```

4. Use:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

5. Add this Vercel environment variable:

```text
Key:
VITE_API_BASE_URL

Value:
https://your-deployed-backend-url.com
```

Use **Config** type because `VITE_` variables are exposed to the browser and should not contain secrets.

6. Deploy the project.

### Backend Deployment

The FastAPI backend must have a public URL for the deployed frontend to work.

For production deployment, SQLite is not recommended on serverless platforms with ephemeral filesystems. A persistent database such as PostgreSQL is recommended.

After deploying the backend, update the frontend environment variable:

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

Also add your Vercel frontend URL to FastAPI CORS:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-project.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Sample Appointments

Examples included in the seed data:

```text
Daily Team Standup
09:00 - 09:30
Scheduled
```

```text
Client Meeting
10:00 - 11:00
Scheduled
```

```text
Project Review
11:30 - 12:00
Completed
```

```text
Design Discussion
14:00 - 15:00
Cancelled
```

## Assumptions

1. Time conflicts are checked only for appointments on the same date.
2. Cancelled appointments remain visible.
3. Cancelled appointments do not block their previous time slot.
4. Completed appointments continue to occupy their original time slot.
5. Appointments that start exactly when another appointment ends are allowed.
6. Only scheduled appointments can be edited.
7. Only scheduled appointments can be completed or cancelled.
8. Authentication is outside the scope of this practical task.
9. SQLite is used for local development and assignment simplicity.

## Error Examples

```text
Title is required.
```

```text
End time must be later than start time.
```

```text
Time slot conflicts with 'Client Meeting'.
```

```text
Cancelled appointment cannot be completed.
```

```text
Completed appointment cannot be cancelled.
```

## Future Improvements

- Authentication
- Team member assignment
- Calendar view
- Appointment reminders
- Email notifications
- Search
- Pagination
- PostgreSQL
- Docker deployment
- Automated testing
- Role-based access control

## Author

Developed as a practical full-stack assignment using React, FastAPI, SQLAlchemy, and SQLite.
