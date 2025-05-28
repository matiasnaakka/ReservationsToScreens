import axios from "axios";

const API_BASE_URL = "http://localhost:3000/";
const API_KEY = import.meta.env.VITE_API_KEY;

export const fetchAllRooms = async (floor, startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}api/rooms/freespace-full`, {
      headers: { apikey: API_KEY },
      params: {
        floor,
        startDate,
        endDate,
      },
    });
    return response.data.rooms; // Return the room data
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};