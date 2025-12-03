import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
  const [title, setTitle]                 = useState("");
  const [category, setCategory]           = useState("");
  const [description, setDescription]     = useState("");
  const [price, setPrice]                 = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [supplierName, setSupplierName]   = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [supplierRating, setSupplierRating] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const product = {
      title,
      category,
      description,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      supplier: {
        name: supplierName,
        contactEmail: supplierEmail,
        contactPhone: supplierPhone,
        rating: supplierRating ? Number(supplierRating) : undefined,
      },
    };

    try {
      const stored = localStorage.getItem("user");
      const token  = stored ? JSON.parse(stored).token : null;

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create product");
      }

      await res.json();
      navigate("/");
    } catch (err) {
      alert(err.message || "Error creating product");
    }
  };

  return (
    <div className="create">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Category:</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Price (€):</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label>Stock Quantity:</label>
        <input
          type="number"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          required
        />

        <label>Supplier name:</label>
        <input
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          required
        />

        <label>Supplier email:</label>
        <input
          type="email"
          value={supplierEmail}
          onChange={(e) => setSupplierEmail(e.target.value)}
          required
        />

        <label>Supplier phone:</label>
        <input
          value={supplierPhone}
          onChange={(e) => setSupplierPhone(e.target.value)}
          required
        />

        <label>Supplier rating (1–5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={supplierRating}
          onChange={(e) => setSupplierRating(e.target.value)}
        />

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default AddProductPage;
