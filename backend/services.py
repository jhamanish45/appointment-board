from sqlalchemy.orm import Session
from fastapi import HTTPException

import crud
import schemas


def create_appointment_service(
    db: Session,
    appointment: schemas.AppointmentCreate,
):
    conflict = crud.check_time_conflict(
        db=db,
        appointment_date=appointment.date,
        start_time=appointment.start_time,
        end_time=appointment.end_time,
    )

    if conflict:
        raise HTTPException(
            status_code=409,
            detail=(
                f"Time slot conflicts with "
                f"'{conflict.title}' "
                f"({conflict.start_time} - {conflict.end_time})"
            ),
        )

    return crud.create_appointment(
        db=db,
        appointment=appointment,
    )

def update_appointment_service(
    db: Session,
    appointment_id: int,
    appointment_update: schemas.AppointmentUpdate,
):
    appointment = crud.get_appointment(
        db=db,
        appointment_id=appointment_id,
    )

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found",
        )

    if appointment.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Cancelled appointments cannot be edited",
        )

    update_data = appointment_update.model_dump(
        exclude_unset=True
    )

    new_date = update_data.get(
        "date",
        appointment.date,
    )

    new_start_time = update_data.get(
        "start_time",
        appointment.start_time,
    )

    new_end_time = update_data.get(
        "end_time",
        appointment.end_time,
    )

    if new_end_time <= new_start_time:
        raise HTTPException(
            status_code=400,
            detail="End time must be later than start time",
        )

    conflict = crud.check_time_conflict(
        db=db,
        appointment_date=new_date,
        start_time=new_start_time,
        end_time=new_end_time,
        exclude_id=appointment_id,
    )

    if conflict:
        raise HTTPException(
            status_code=409,
            detail=(
                f"Time slot conflicts with "
                f"'{conflict.title}' "
                f"({conflict.start_time} - {conflict.end_time})"
            ),
        )

    return crud.update_appointment(
        db=db,
        db_appointment=appointment,
        appointment_data=update_data,
    )

def complete_appointment_service(
    db: Session,
    appointment_id: int,
):
    appointment = crud.get_appointment(
        db=db,
        appointment_id=appointment_id,
    )

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found",
        )

    if appointment.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Cancelled appointment cannot be completed",
        )

    if appointment.status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Appointment is already completed",
        )

    return crud.change_status(
        db=db,
        db_appointment=appointment,
        status="completed",
    )

def cancel_appointment_service(
    db: Session,
    appointment_id: int,
):
    appointment = crud.get_appointment(
        db=db,
        appointment_id=appointment_id,
    )

    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found",
        )

    if appointment.status == "completed":
        raise HTTPException(
            status_code=400,
            detail="Completed appointment cannot be cancelled",
        )

    if appointment.status == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Appointment is already cancelled",
        )

    return crud.change_status(
        db=db,
        db_appointment=appointment,
        status="cancelled",
    )
