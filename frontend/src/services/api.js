// const API_URL = "https://clara-precrural-nonprolixly.ngrok-free.dev/api";
const API_URL = "http://127.0.0.1:8000/api";

// ДОБАВИЛИ gender и status в аргументы функции ниже:
export const fetchPersons = async (search = "", region = "", gender = "", status = "") => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (region) params.append("region", region);
    if (gender) params.append("gender", gender);
    if (status) params.append("status", status);

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const response = await fetch(`${API_URL}/persons${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420" 
      }
    });

    if (!response.ok) throw new Error('Ошибка сети');
    return await response.json();
  } catch (error) {
    console.error("Ошибка API:", error);
    return [];
  }
};