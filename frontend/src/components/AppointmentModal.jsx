import { useEffect, useState } from "react";

import {
    createAppointment,
    updateAppointment,
} from "../services/appointmentApi";


const emptyForm = {
    title: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
};


function AppointmentModal({
    onClose,
    onSaved,
    appointment = null,
}) {

    const isEditing = Boolean(appointment);


    const [formData, setFormData] =
        useState(emptyForm);

    const [error, setError] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);


    useEffect(() => {

        if (appointment) {

            setFormData({
                title: appointment.title || "",

                description:
                    appointment.description || "",

                date:
                    appointment.date || "",

                start_time:
                    appointment.start_time
                        ? appointment.start_time.slice(0, 5)
                        : "",

                end_time:
                    appointment.end_time
                        ? appointment.end_time.slice(0, 5)
                        : "",
            });

        } else {

            setFormData(emptyForm);

        }

    }, [appointment]);


    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));


        setError("");
    };


    const validateForm = () => {

        if (!formData.title.trim()) {
            return "Title is required.";
        }

        if (!formData.date) {
            return "Date is required.";
        }

        if (!formData.start_time) {
            return "Start time is required.";
        }

        if (!formData.end_time) {
            return "End time is required.";
        }

        if (
            formData.end_time <=
            formData.start_time
        ) {
            return (
                "End time must be later " +
                "than start time."
            );
        }

        return "";
    };


    const getApiErrorMessage = (
        apiError
    ) => {

        const detail =
            apiError.response?.data?.detail;


        if (typeof detail === "string") {
            return detail;
        }


        if (Array.isArray(detail)) {

            return detail
                .map((item) => item.msg)
                .join(", ");

        }


        return isEditing
            ? "Unable to update appointment."
            : "Unable to create appointment.";
    };


    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        const validationError =
            validateForm();


        if (validationError) {

            setError(
                validationError
            );

            return;

        }


        try {

            setSubmitting(true);
            setError("");


            const payload = {

                title:
                    formData.title.trim(),

                description:
                    formData.description.trim()
                    || null,

                date:
                    formData.date,

                start_time:
                    formData.start_time,

                end_time:
                    formData.end_time,

            };


            let savedAppointment;


            if (isEditing) {

                savedAppointment =
                    await updateAppointment(
                        appointment.id,
                        payload
                    );

            } else {

                savedAppointment =
                    await createAppointment(
                        payload
                    );

            }


            onSaved(
                savedAppointment,
                isEditing
            );


            onClose();

        } catch (apiError) {

            console.error(
                apiError
            );


            setError(
                getApiErrorMessage(
                    apiError
                )
            );

        } finally {

            setSubmitting(false);

        }

    };


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">


                <div className="flex items-center justify-between border-b px-6 py-4">

                    <div>

                        <h2 className="text-xl font-semibold text-slate-900">

                            {isEditing
                                ? "Edit Appointment"
                                : "Add Appointment"}

                        </h2>


                        <p className="mt-1 text-sm text-slate-500">

                            {isEditing
                                ? "Update appointment details"
                                : "Create a new team appointment"}

                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100"
                    >
                        ×
                    </button>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-6"
                >


                    {error && (

                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                            {error}

                        </div>

                    )}


                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">

                            Title

                            <span className="text-red-500">
                                {" "}*
                            </span>

                        </label>


                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Client Meeting"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>


                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Description
                        </label>


                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Discuss project requirements..."
                            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>


                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">

                            Date

                            <span className="text-red-500">
                                {" "}*
                            </span>

                        </label>


                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>


                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">


                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">

                                Start Time

                                <span className="text-red-500">
                                    {" "}*
                                </span>

                            </label>


                            <input
                                type="time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">

                                End Time

                                <span className="text-red-500">
                                    {" "}*
                                </span>

                            </label>


                            <input
                                type="time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                    </div>


                    <div className="flex justify-end gap-3 border-t pt-5">


                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {submitting
                                ? (
                                    isEditing
                                        ? "Saving..."
                                        : "Creating..."
                                )
                                : (
                                    isEditing
                                        ? "Save Changes"
                                        : "Create Appointment"
                                )}

                        </button>


                    </div>

                </form>

            </div>

        </div>

    );
}


export default AppointmentModal;