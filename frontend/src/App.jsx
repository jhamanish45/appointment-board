import { useEffect, useState } from "react";

import AppointmentCard from "./components/AppointmentCard";
import AppointmentModal from "./components/AppointmentModal";
import AppointmentFilters from "./components/AppointmentFilters";

import {
  getAppointments,
  completeAppointment,
  cancelAppointment
} from "./services/appointmentApi";


function App() {

  const [
    actionLoadingId,
    setActionLoadingId,
  ] = useState(null);

  const [
    actionError,
    setActionError,
  ] = useState("");

  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);
  

  const [error, setError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    editingAppointment,
    setEditingAppointment,
  ] = useState(null);

  const [
    dateFilter,
    setDateFilter,
  ] = useState("");


  const [
    statusFilter,
    setStatusFilter,
  ] = useState("");

  const clearFilters = () => {
    setDateFilter("");
    setStatusFilter("");
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const filters = {};

      if (dateFilter) {
        filters.date = dateFilter;
      }

      if (statusFilter) {
        filters.status = statusFilter;
      }

      const data =
        await getAppointments(filters);

      setAppointments(data);

    } catch (error) {
      console.error(error);

      setError(
        "Unable to load appointments. Please check the backend server."
      );

    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {

    loadAppointments();

  }, [dateFilter, statusFilter]);


  const openAddModal = () => {

    setEditingAppointment(
      null
    );

    setShowModal(
      true
    );

  };


  const openEditModal = (
    appointment
  ) => {

    setEditingAppointment(
      appointment
    );

    setShowModal(
      true
    );

  };


  const closeModal = () => {

    setShowModal(
      false
    );

    setEditingAppointment(
      null
    );

  };

  const getApiErrorMessage = (apiError) => {

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

    return "Something went wrong.";
  };

  const handleCompleteAppointment = async (
    appointment
  ) => {

    const confirmed = window.confirm(
      `Mark "${appointment.title}" as completed?`
    );

    if (!confirmed) {
      return;
    }


    try {

      setActionLoadingId(
        appointment.id
      );

      setActionError("");


      const updatedAppointment =
        await completeAppointment(
          appointment.id
        );


      setSuccessMessage(
        `"${updatedAppointment.title}" was marked as completed.`
      );


      await loadAppointments();


      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);


    } catch (apiError) {

      console.error(apiError);

      setActionError(
        getApiErrorMessage(
          apiError
        )
      );

    } finally {

      setActionLoadingId(null);

    }

  };

  const handleCancelAppointment = async (
    appointment
  ) => {

    const confirmed = window.confirm(
      `Are you sure you want to cancel "${appointment.title}"?`
    );

    if (!confirmed) {
      return;
    }


    try {

      setActionLoadingId(
        appointment.id
      );

      setActionError("");


      const updatedAppointment =
        await cancelAppointment(
          appointment.id
        );


      setSuccessMessage(
        `"${updatedAppointment.title}" was cancelled successfully.`
      );


      await loadAppointments();


      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);


    } catch (apiError) {

      console.error(apiError);

      setActionError(
        getApiErrorMessage(
          apiError
        )
      );

    } finally {

      setActionLoadingId(null);

    }

  };


  const handleAppointmentSaved = async (
    savedAppointment,
    wasEditing
  ) => {

    if (wasEditing) {

      setSuccessMessage(
        `"${savedAppointment.title}" was updated successfully.`
      );

    } else {

      setSuccessMessage(
        `"${savedAppointment.title}" was created successfully.`
      );

    }


    await loadAppointments();


    setTimeout(() => {

      setSuccessMessage("");

    }, 4000);

  };


  return (

    <div className="min-h-screen bg-slate-50">


      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div>

            <h1 className="text-2xl font-bold text-slate-900">

              Appointment Board

            </h1>


            <p className="mt-1 text-sm text-slate-500">

              Manage your team's appointments

            </p>

          </div>


          <button
            onClick={openAddModal}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >

            + Add Appointment

          </button>

        </div>

      </header>


      <main className="mx-auto max-w-6xl px-6 py-8">


        {successMessage && (

          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">

            ✓ {successMessage}

          </div>

        )}

        {actionError && (

          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">

            ✕ {actionError}

          </div>

        )}
        <AppointmentFilters
          dateFilter={dateFilter}
          statusFilter={statusFilter}
          onDateChange={setDateFilter}
          onStatusChange={setStatusFilter}
          onClear={clearFilters} />


        <div className="mb-6">

          <h2 className="text-xl font-semibold text-slate-900">

            Appointments

          </h2>


          <p className="mt-1 text-sm text-slate-500">

            {appointments.length}
            {" "}
            appointments found

          </p>

        </div>


        {loading && (

          <div className="rounded-xl border bg-white p-10 text-center">

            <p className="text-slate-500">

              Loading appointments...

            </p>

          </div>

        )}


        {error && (

          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

            {error}

          </div>

        )}


        {!loading &&
          !error &&
          appointments.length === 0 && (

            <div className="rounded-xl border bg-white p-10 text-center">

              <div className="text-4xl">
                📅
              </div>

              <h3 className="mt-3 font-semibold text-slate-800">
                No appointments found
              </h3>

              <p className="mt-2 text-sm text-slate-500">

                {dateFilter || statusFilter
                  ? "No appointments match the selected filters."
                  : "Create your first appointment to get started."}

              </p>


              {(dateFilter || statusFilter) && (

                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Clear Filters
                </button>

              )}

            </div>

          )}


        {!loading &&
          !error &&
          appointments.length > 0 && (

            <div className="grid gap-4">

              {appointments.map(
                (appointment) => (

                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={openEditModal}
                    onComplete={handleCompleteAppointment}
                    onCancel={handleCancelAppointment}
                    actionLoadingId={actionLoadingId}
                  />

                )
              )}

            </div>

          )}

      </main>


      {showModal && (

        <AppointmentModal
          appointment={
            editingAppointment
          }
          onClose={
            closeModal
          }
          onSaved={
            handleAppointmentSaved
          }
        />

      )}


    </div>

  );

}


export default App;