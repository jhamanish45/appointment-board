from datetime import date, time

from sqlalchemy.orm import Session

import models
import schemas


def check_time_conflict(
    db: Session,
    appointment_date: date,
    start_time: time,
    end_time: time,
    exclude_id: int | None = None,
):

    query = db.query(models.Appointment).filter(
        models.Appointment.date == appointment_date,
        models.Appointment.status != "cancelled",
    )

    if exclude_id is not None:
        query = query.filter(
            models.Appointment.id != exclude_id
        )

    appointments = query.all()

    for appointment in appointments:

        if (
            start_time < appointment.end_time
            and end_time > appointment.start_time
        ):

            return appointment

    return None


def create_appointment(
    db: Session,
    appointment: schemas.AppointmentCreate,
):

    db_appointment = models.Appointment(
        title=appointment.title,
        description=appointment.description,
        date=appointment.date,
        start_time=appointment.start_time,
        end_time=appointment.end_time,
        status="scheduled",
    )

    db.add(db_appointment)

    db.commit()

    db.refresh(db_appointment)

    return db_appointment


def get_appointments(
    db: Session,
    appointment_date: date | None = None,
    status: str | None = None,
):

    query = db.query(models.Appointment)

    if appointment_date:
        query = query.filter(
            models.Appointment.date == appointment_date
        )

    if status:
        query = query.filter(
            models.Appointment.status == status
        )

    return query.order_by(
        models.Appointment.date,
        models.Appointment.start_time,
    ).all()


def get_appointment(
    db: Session,
    appointment_id: int,
):

    return (
        db.query(models.Appointment)
        .filter(
            models.Appointment.id == appointment_id
        )
        .first()
    )


def update_appointment(
    db: Session,
    db_appointment: models.Appointment,
    appointment_data: dict,
):

    for key, value in appointment_data.items():

        if value is not None:
            setattr(
                db_appointment,
                key,
                value,
            )

    db.commit()

    db.refresh(db_appointment)

    return db_appointment


def change_status(
    db: Session,
    db_appointment: models.Appointment,
    status: str,
):

    db_appointment.status = status

    db.commit()

    db.refresh(db_appointment)

    return db_appointment