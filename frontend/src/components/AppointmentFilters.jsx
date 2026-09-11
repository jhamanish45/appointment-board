function AppointmentFilters({
    dateFilter,
    statusFilter,
    onDateChange,
    onStatusChange,
    onClear,
}) {
    const hasFilters =
        Boolean(dateFilter) ||
        Boolean(statusFilter);

    return (
        <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

                <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Filter by Date
                    </label>

                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(event) =>
                            onDateChange(event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>


                <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Filter by Status
                    </label>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            onStatusChange(event.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">
                            All Statuses
                        </option>

                        <option value="scheduled">
                            Scheduled
                        </option>

                        <option value="completed">
                            Completed
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>
                    </select>
                </div>


                <button
                    type="button"
                    onClick={onClear}
                    disabled={!hasFilters}
                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Clear Filters
                </button>

            </div>
        </div>
    );
}


export default AppointmentFilters;