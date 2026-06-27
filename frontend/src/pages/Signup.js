import { useState } from "react";
import axios from "axios";

function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      await axios.post(
        " https://instagram-clone-eid7.onrender.com/api/auth/signup",
        form
      );

      alert("Signup Successful!");
      window.location.href = "/login";

    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
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
          name="username"
          placeholder="Username"
          onChange={handleChange}
          style={{
            width: "90%",
            padding: "12px",
            marginBottom: "10px",
            border: "1px solid #dbdbdb"
          }}
        />

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
          onClick={handleSignup}
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
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Signup;
