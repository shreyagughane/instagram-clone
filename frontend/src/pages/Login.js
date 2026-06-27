import { useState } from "react";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://instagram-clone-eid7.onrender.com/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful!");
      window.location.href = "/";

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fafafa"
      }}
    >
      <div
        style={{
          width: "350px",
          background: "white",
          border: "1px solid #dbdbdb",
          padding: "40px",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontFamily: "cursive" }}>Instagram</h1>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          style={{
            width: "90%",
            padding: "12px",
            marginBottom: "10px",
            border: "1px solid #dbdbdb"
          }}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          style={{
            width: "90%",
            padding: "12px",
            marginBottom: "15px",
            border: "1px solid #dbdbdb"
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            background: "#0095f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;