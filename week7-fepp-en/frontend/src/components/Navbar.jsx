import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    alert("Logged out");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <h1>Product Management</h1>
      </Link>

      <div className="links">
        <Link to="/">Home</Link>

        {isAuthenticated && <Link to="/add-product">Add Product</Link>}

        {!isAuthenticated && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {isAuthenticated && (
          <button className="logout-link" onClick={handleLogout}>
            Log out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
