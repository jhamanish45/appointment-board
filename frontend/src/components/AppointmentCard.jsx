const statusStyles = {
    scheduled: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};


function AppointmentCard({
    appointment,
    onEdit,
    onComplete,
    onCancel,
    actionLoadingId,
}) {

    const {
        id,
        title,
        description,
        date,
        start_time,
        end_time,
        status,
    } = appointment;


    const formatTime = (time) => {
        return time?.slice(0, 5);
    };


    const isActionLoading =
        actionLoadingId === id;


    return (
        <div
            className={`rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${status === "cancelled"
                    ? "opacity-60"
                    : ""
                }`}
        >

            <div className="flex items-start justify-between gap-4">

                <div>

                    <h2
                        className={`text-lg font-semibold text-slate-900 ${status === "cancelled"
                                ? "line-through"
                                : ""
                            }`}
                    >
                        {title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {date}
                    </p>

                </div>


                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[status] ??
                        "bg-gray-100 text-gray-700"
                        }`}
                >
                    {status}
                </span>

            </div>


            <p className="mt-4 text-sm text-slate-600">

                {description ||
                    "No description provided."}

            </p>


            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <p className="text-xs font-medium uppercase text-slate-400">
                        Time
                    </p>

                    <p className="mt-1 font-medium text-slate-700">

                        {formatTime(start_time)}
                        {" - "}
                        {formatTime(end_time)}

                    </p>

                </div>


                {status === "scheduled" && (

                    <div className="flex flex-wrap gap-2">


                        <button
                            onClick={() =>
                                onEdit(appointment)
                            }
                            disabled={isActionLoading}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Edit
                        </button>


                        <button
                            onClick={() =>
                                onComplete(appointment)
                            }
                            disabled={isActionLoading}
                            className="rounded-lg border border-green-300 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isActionLoading
                                ? "Please wait..."
                                : "Complete"}
                        </button>


                        <button
                            onClick={() =>
                                onCancel(appointment)
                            }
                            disabled={isActionLoading}
                            className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isActionLoading
                                ? "Please wait..."
                                : "Cancel"}
                        </button>


                    </div>

                )}

            </div>

        </div>
    );
}


export default AppointmentCard;