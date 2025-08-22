// Frontend/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Rider from "./pages/Rider";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import SignupDetails from "./components/SignupDetails";
import { useAuth } from "./context/AuthContext";
import "./assets/styles/App.css";
import "./assets/styles/Model.css";
import "./assets/styles/Responsive.css";
import Loader from "./components/Loader";
import Driver from "./pages/Driver";

const App = () => {
  const { authAllow, loading, isDetail, userData } = useAuth();

  return (
    <>
      {loading ? (
        <Loader className="App-loader" loading={true} size="100" speed="1.5" />
      ) : (
        <Routes>
          {authAllow ? (
            isDetail ? (
              <>
                <Route
                  path="/"
                  element={userData.role === "rider" ? <Rider /> : <Driver />}
                />
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
      )}
    </>
  );
};

export default App;
