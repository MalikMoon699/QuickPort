// Frontend/src/utils/AuthFunctions.js

export const FetchCurrentUserData = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const res = await fetch(
    "https://quick-port-backend.vercel.app/api/auth/user",
    {
      // const res = await fetch("http://localhost:3000/api/auth/user", {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.user || null;
};
