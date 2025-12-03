import useLogin from "../hooks/useLogin";

const LoginPage = ({ setIsAuthenticated }) => {
  const { email, setEmail, password, setPassword, error, handleLogin } =
    useLogin(setIsAuthenticated);

  return (
    <div className="create">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default LoginPage;
