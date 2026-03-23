import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/auth";

export default function App() {
  const [mode, setMode] = useState("register");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${API}/register`, registerData);
      setMessage(res.data.message);
      setRegisterData({ name: "", email: "", password: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/login`, loginData);
      localStorage.setItem("token", res.data.token);
      setMessage(res.data.message);
      setLoginData({ email: "", password: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  const handleGetProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProfile(res.data);
      setMessage("Protected route accessed successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Access denied");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    setMessage("Logged out");
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        border: "1px solid #ddd",
        borderRadius: "10px"
      }}
    >
      <h1>User Authentication System</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setMode("register")}>Register</button>
        <button onClick={() => setMode("login")} style={{ marginLeft: "10px" }}>
          Login
        </button>
      </div>

      {mode === "register" && (
        <div>
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Name"
            value={registerData.name}
            onChange={(e) =>
              setRegisterData({ ...registerData, name: e.target.value })
            }
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={registerData.password}
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
            }
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button onClick={handleRegister}>Register</button>
        </div>
      )}

      {mode === "login" && (
        <div>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}

      <hr style={{ margin: "20px 0" }} />

      <button onClick={handleGetProfile}>Get Protected Profile</button>
      <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
        Logout
      </button>

      {message && (
        <p style={{ marginTop: "20px" }}>
          <strong>{message}</strong>
        </p>
      )}

      {profile && (
        <div style={{ marginTop: "20px" }}>
          <h3>User Profile</h3>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>ID:</strong> {profile._id}</p>
        </div>
      )}
    </div>
  );
}
