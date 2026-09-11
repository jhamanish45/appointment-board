from datetime import date, time

from database import SessionLocal
from models import Appointment


def seed_appointments():

    db = SessionLocal()

    try:
        existing_count = db.query(Appointment).count()

        if existing_count > 0:
            print("Sample data already exists.")
            return

        sample_appointments = [

            Appointment(
                title="Daily Team Standup",
                description="Discuss current tasks and blockers",
                date=date(2026, 9, 15),
                start_time=time(9, 0),
                end_time=time(9, 30),
                status="scheduled",
            ),

            Appointment(
                title="Client Meeting",
                description="Discuss project requirements",
                date=date(2026, 9, 15),
                start_time=time(10, 0),
                end_time=time(11, 0),
                status="scheduled",
            ),

            Appointment(
                title="Project Review",
                description="Review current project progress",
                date=date(2026, 9, 15),
                start_time=time(11, 30),
                end_time=time(12, 0),
                status="completed",
            ),

            Appointment(
                title="Design Discussion",
                description="Discuss updated UI designs",
                date=date(2026, 9, 15),
                start_time=time(14, 0),
                end_time=time(15, 0),
                status="cancelled",
            ),

        ]

        db.add_all(sample_appointments)

        db.commit()

        print("Sample appointments added successfully.")

    except Exception as error:

        db.rollback()

        print(
            f"Failed to seed appointments: {error}"
        )

    finally:

        db.close()


if __name__ == "__main__":
    seed_appointments()