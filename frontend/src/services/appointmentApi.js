import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


export const getAppointments = async (filters = {}) => {
    const response = await api.get("/appointments", {
        params: filters,
    });

    return response.data;
};


export const getAppointment = async (id) => {
    const response = await api.get(
        `/appointments/${id}`
    );

    return response.data;
};


export const createAppointment = async (
    appointmentData
) => {
    const response = await api.post(
        "/appointments",
        appointmentData
    );

    return response.data;
};


export const updateAppointment = async (
    id,
    appointmentData
) => {
    const response = await api.put(
        `/appointments/${id}`,
        appointmentData
    );

    return response.data;
};


export const completeAppointment = async (id) => {
    const response = await api.patch(
        `/appointments/${id}/complete`
    );

    return response.data;
};


export const cancelAppointment = async (id) => {
    const response = await api.patch(
        `/appointments/${id}/cancel`
    );

    return response.data;
};


export default api;