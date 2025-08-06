const API_URL = "http://localhost:3001";

// Tenders
export async function getTenders() {
  const response = await fetch(`${API_URL}/tenders`);
  return response.json();
}
export async function createTender(tender) {
  const response = await fetch(`${API_URL}/tenders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tender),
  });
  return response.json();
}

// Trucks
export async function getTrucks() {
  const response = await fetch(`${API_URL}/trucks`);
  return response.json();
}
export async function addTruck(truck) {
  const response = await fetch(`${API_URL}/trucks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(truck),
  });
  return response.json();
}

// Users (simple, for login/signup)
export async function loginUser(email, password) {
  const response = await fetch(
    `${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  );
  const data = await response.json();
  return data[0]; // Only one user or undefined
}

export async function signupUser(user) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return response.json();
}
