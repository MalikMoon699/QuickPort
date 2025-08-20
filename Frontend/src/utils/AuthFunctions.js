// Frontend/src/utils/AuthFunctions.js

export const FetchCurrentUserData = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  if (!res.ok) return null;
  const data = await res.json();
  return data.user || null;
};
