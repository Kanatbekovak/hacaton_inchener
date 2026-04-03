const API_URL = "https://clara-precrural-nonprolixly.ngrok-free.dev/";

// export const fetchPersons = async (search = "") => {
//   try {
//     const response = await fetch(`${API_URL}/persons?search=${encodeURIComponent(search)}`, {
//         headers: {
//             'ngrok-skip-browser-warning': 'true' // Чтобы ngrok не показывал промежуточную страницу
//         }
//     });
//     if (!response.ok) throw new Error('Network response was not ok');
//     return await response.json();
//   } catch (error) {
//     console.error("Fetch error:", error);
//     return [];
//   }
// };

export const createPerson = async (data) => {
  const response = await fetch(`${API_URL}/persons`, {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};

// Если на бэкенде еще нет эндпоинта /chat, пока можно оставить заглушку
export const askChat = async (question) => {
    return { answer: "ИИ-модуль в процессе подключения к базе данных..." };
};

export const fetchPersons = async (search = "", region = "") => {
  try {
    // Формируем URL с параметрами
    let url = `${API_URL}/persons?`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (region) url += `region=${encodeURIComponent(region)}`;

    const response = await fetch(url, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    
    if (!response.ok) throw new Error('Ошибка сети');
    return await response.json();
  } catch (error) {
    console.error("Ошибка API:", error);
    return [];
  }
};