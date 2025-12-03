import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSignup from "../hooks/useSignup";

const RegisterPage = ({ setIsAuthenticated }) => {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("Buyer"); // default
  const [address, setAddress]   = useState("");

  const { signup, isLoading, error } = useSignup("/api/users/register");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      name,
      email,
      password,
      role,     
      address,  
    };

    const result = await signup(body);

    if (result.ok) {
      setIsAuthenticated(true);
      alert("Register successful");
      navigate("/");
    }
  };

  return (
    <div className="create">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="Admin">Admin</option>
          <option value="Seller">Seller</option>
          <option value="Buyer">Buyer</option>
        </select>

        <label>Address:</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
