from datetime import date

from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    Query,
)

from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base
from fastapi.middleware.cors import CORSMiddleware

import crud
import schemas
import services


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Appointment Board API",
    version="1.0.0",
    description="API for managing team appointments",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
       " https://appointment-boards.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Appointment Board API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }

@app.post(
    "/appointments",
    response_model=schemas.AppointmentResponse,
    status_code=201,
)
def create_appointment(
    appointment: schemas.AppointmentCreate,
    db: Session = Depends(get_db),
):

    return services.create_appointment_service(
        db=db,
        appointment=appointment,
    )


@app.get(
    "/appointments",
    response_model=list[schemas.AppointmentResponse],
)
def get_appointments(
    date_filter: date | None = Query(
        default=None,
        alias="date",
    ),
    status: str | None = None,    
    db: Session = Depends(get_db),
):

    valid_statuses = {
        "scheduled",
        "completed",
        "cancelled",
    }

    if status and status not in valid_statuses:

        raise HTTPException(
            status_code=400,
            detail=(
                "Status must be scheduled, "
                "completed or cancelled"
            ),
        )

    return crud.get_appointments(
        db=db,
        appointment_date=date_filter,
        status=status,
    )

@app.get(
    "/appointments/{appointment_id}",
    response_model=schemas.AppointmentResponse,
)
def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
):

    appointment = crud.get_appointment(
        db,
        appointment_id,
    )

    if not appointment:

        raise HTTPException(
            status_code=404,
            detail="Appointment not found",
        )

    return appointment

@app.put(
    "/appointments/{appointment_id}",
    response_model=schemas.AppointmentResponse,
)
def update_appointment(
    appointment_id: int,
    appointment_update: schemas.AppointmentUpdate,
    db: Session = Depends(get_db),
):

    return services.update_appointment_service(
        db=db,
        appointment_id=appointment_id,
        appointment_update=appointment_update,
    )

@app.patch(
    "/appointments/{appointment_id}/cancel",
    response_model=schemas.AppointmentResponse,
)
def cancel_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
):

    return services.cancel_appointment_service(
        db=db,
        appointment_id=appointment_id,
    )



@app.patch(
    "/appointments/{appointment_id}/complete",
    response_model=schemas.AppointmentResponse,
)
def complete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
):

    return services.complete_appointment_service(
        db=db,
        appointment_id=appointment_id,
    )




















# @app.get(
#     "/appointments",
#     response_model=list[schemas.AppointmentResponse],
# )
# def get_appointments(
#     date_filter: date | None = Query(
#         default=None,
#         alias="date",
#     ),
#     status: str | None = None,    
#     db: Session = Depends(get_db),
# ):

#     valid_statuses = {
#         "scheduled",
#         "completed",
#         "cancelled",
#     }

#     if status and status not in valid_statuses:

#         raise HTTPException(
#             status_code=400,
#             detail=(
#                 "Status must be scheduled, "
#                 "completed or cancelled"
#             ),
#         )

#     return crud.get_appointments(
#         db=db,
#         appointment_date=date_filter,
#         status=status,
#     )

#
























# @app.post(
#     "/appointments",
#     response_model=schemas.AppointmentResponse,
#     status_code=201,
# )
# def create_appointment(
#     appointment: schemas.AppointmentCreate,
#     db: Session = Depends(get_db),
# ):

#     conflict = crud.check_time_conflict(
#         db=db,
#         appointment_date=appointment.date,
#         start_time=appointment.start_time,
#         end_time=appointment.end_time,
#     )

#     if conflict:

#         raise HTTPException(
#             status_code=409,
#             detail=(
#                 f"Time slot conflicts with "
#                 f"'{conflict.title}' "
#                 f"({conflict.start_time} - "
#                 f"{conflict.end_time})"
#             ),
#         )

#     return crud.create_appointment(
#         db,
#         appointment,
#     )

# @app.get(
#     "/appointments",
#     response_model=list[schemas.AppointmentResponse],
# )
# def get_appointments(
#     date_filter: date | None = Query(
#         default=None,
#         alias="date",
#     ),
#     status: str | None = None,    
#     db: Session = Depends(get_db),
# ):

#     valid_statuses = {
#         "scheduled",
#         "completed",
#         "cancelled",
#     }

#     if status and status not in valid_statuses:

#         raise HTTPException(
#             status_code=400,
#             detail=(
#                 "Status must be scheduled, "
#                 "completed or cancelled"
#             ),
#         )

#     return crud.get_appointments(
#         db=db,
#         appointment_date=date_filter,
#         status=status,
#     )

# @app.get(
#     "/appointments/{appointment_id}",
#     response_model=schemas.AppointmentResponse,
# )
# def get_appointment(
#     appointment_id: int,
#     db: Session = Depends(get_db),
# ):

#     appointment = crud.get_appointment(
#         db,
#         appointment_id,
#     )

#     if not appointment:

#         raise HTTPException(
#             status_code=404,
#             detail="Appointment not found",
#         )

#     return appointment

# @app.put(
#     "/appointments/{appointment_id}",
#     response_model=schemas.AppointmentResponse,
# )
# def update_appointment(
#     appointment_id: int,
#     appointment_update: schemas.AppointmentUpdate,
#     db: Session = Depends(get_db),
# ):

#     appointment = crud.get_appointment(
#         db,
#         appointment_id,
#     )

#     if not appointment:

#         raise HTTPException(
#             status_code=404,
#             detail="Appointment not found",
#         )

#     update_data = appointment_update.model_dump(
#         exclude_unset=True
#     )

#     new_date = update_data.get(
#         "date",
#         appointment.date,
#     )

#     new_start_time = update_data.get(
#         "start_time",
#         appointment.start_time,
#     )

#     new_end_time = update_data.get(
#         "end_time",
#         appointment.end_time,
#     )

#     # Validate times
#     if new_end_time <= new_start_time:

#         raise HTTPException(
#             status_code=400,
#             detail=(
#                 "End time must be later "
#                 "than start time"
#             ),
#         )

#     # Check appointment conflict
#     conflict = crud.check_time_conflict(
#         db=db,
#         appointment_date=new_date,
#         start_time=new_start_time,
#         end_time=new_end_time,
#         exclude_id=appointment_id,
#     )

#     if conflict:

#         raise HTTPException(
#             status_code=409,
#             detail=(
#                 f"Time slot conflicts with "
#                 f"'{conflict.title}' "
#                 f"({conflict.start_time} - "
#                 f"{conflict.end_time})"
#             ),
#         )

#     return crud.update_appointment(
#         db=db,
#         db_appointment=appointment,
#         appointment_data=update_data,
#     )


# @app.patch(
#     "/appointments/{appointment_id}/cancel",
#     response_model=schemas.AppointmentResponse,
# )
# def cancel_appointment(
#     appointment_id: int,
#     db: Session = Depends(get_db),
# ):

#     appointment = crud.get_appointment(
#         db,
#         appointment_id,
#     )

#     if not appointment:

#         raise HTTPException(
#             status_code=404,
#             detail="Appointment not found",
#         )

#     if appointment.status == "cancelled":

#         raise HTTPException(
#             status_code=400,
#             detail="Appointment is already cancelled",
#         )

#     if appointment.status == "completed":

#         raise HTTPException(
#             status_code=400,
#             detail=(
#                 "Completed appointment "
#                 "cannot be cancelled"
#             ),
#         )

#     return crud.change_status(
#         db=db,
#         db_appointment=appointment,
#         status="cancelled",
#     )



# @app.patch(
#     "/appointments/{appointment_id}/complete",
#     response_model=schemas.AppointmentResponse,
# )
# def complete_appointment(
#     appointment_id: int,
#     db: Session = Depends(get_db),
# ):

#     appointment = crud.get_appointment(
#         db,
#         appointment_id,
#     )

#     if not appointment:

#         raise HTTPException(
#             status_code=404,
#             detail="Appointment not found",
#         )

#     if appointment.status == "cancelled":

#         raise HTTPException(
#             status_code=400,
#             detail=(
#                 "Cancelled appointment "
#                 "cannot be completed"
#             ),
#         )

#     if appointment.status == "completed":

#         raise HTTPException(
#             status_code=400,
#             detail="Appointment is already completed",
#         )

#     return crud.change_status(
#         db=db,
#         db_appointment=appointment,
#         status="completed",
#     )

