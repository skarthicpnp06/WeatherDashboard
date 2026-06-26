const BASE = "https://weatherdashboard-1-5tai.onrender.com/api/chat";

export async function sendChatMessage(message, city = "") {
  const response = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message.trim(), city: city.trim() })
  });
  if (!response.ok) throw new Error("AI service is currently unavailable. Please try again.");
  return await response.json();
}

export async function getChatHistory() {
  const response = await fetch(`${BASE}/history`);
  if (!response.ok) throw new Error("Failed to load chat history.");
  return await response.json();
}