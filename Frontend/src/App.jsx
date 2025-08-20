// Frontend/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import SignupDetails from "./components/SignupDetails";
import { useAuth } from "./context/AuthContext";
import "./assets/styles/App.css";
import "./assets/styles/Model.css";

const App = () => {
  const { authAllow, loading, isDetail } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      {authAllow ? (
        isDetail ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/signup-details" element={<SignupDetails />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/signup-details" element={<SignupDetails />} />
            <Route path="*" element={<Navigate to="/signup-details" />} />
          </>
        )
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
};

export default App;
