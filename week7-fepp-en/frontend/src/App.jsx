import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setIsAuthenticated(true);
  }, []);

  return (
    <BrowserRouter>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/add-product"
          element={
            isAuthenticated ? (
              <AddProductPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/products/:id"
          element={<ProductPage isAuthenticated={isAuthenticated} />}
        />

        <Route
          path="/products/:id/edit"
          element={
            isAuthenticated ? (
              <EditProductPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
        />

        <Route
          path="/register"
          element={<RegisterPage setIsAuthenticated={setIsAuthenticated} />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
