import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSignup from "../hooks/useSignup";

const RegisterPage = ({ setIsAuthenticated }) => {
  const [name, setName]                 = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [phoneNumber, setPhoneNumber]   = useState("");
  const [gender, setGender]             = useState("male");
  const [dob, setDob]                   = useState("");
  const [membershipStatus, setMembershipStatus] = useState("basic");

  // dùng hook ngắn
  const { signup, isLoading, error } = useSignup("/api/users/register");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      name,
      email,
      password,
      phone_number: phoneNumber,
      gender,
      date_of_birth: dob,
      membership_status: membershipStatus,
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

        <label>Phone number:</label>
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />

        <label>Gender:</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="male">male</option>
          <option value="female">female</option>
          <option value="other">other</option>
        </select>

        <label>Date of birth:</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />

        <label>Membership status:</label>
        <select
          value={membershipStatus}
          onChange={(e) => setMembershipStatus(e.target.value)}
          required
        >
          <option value="basic">basic</option>
          <option value="premium">premium</option>
          <option value="vip">vip</option>
        </select>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
