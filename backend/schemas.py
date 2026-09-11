from datetime import (
    date as Date,
    time as Time,
    datetime as DateTime,
)

from pydantic import (
    BaseModel,
    ConfigDict,
    field_validator,
    model_validator,
)


class AppointmentBase(BaseModel):
    title: str
    description: str | None = None
    date: Date
    start_time: Time
    end_time: Time

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str):
        if not value.strip():
            raise ValueError("Title is required")

        return value.strip()

    @model_validator(mode="after")
    def validate_time_range(self):
        if self.end_time <= self.start_time:
            raise ValueError(
                "End time must be later than start time"
            )

        return self


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentUpdate(BaseModel):
    title: str | None = None
    description: str | None = None

    date: Date | None = None

    start_time: Time | None = None
    end_time: Time | None = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, value):
        if value is not None:
            value = value.strip()

            if not value:
                raise ValueError(
                    "Title cannot be empty"
                )

        return value


class AppointmentResponse(AppointmentBase):
    id: int
    status: str

    created_at: DateTime | None = None
    updated_at: DateTime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )