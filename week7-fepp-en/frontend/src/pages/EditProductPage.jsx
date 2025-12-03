import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle]                 = useState("");
  const [category, setCategory]           = useState("");
  const [description, setDescription]     = useState("");
  const [price, setPrice]                 = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [supplierName, setSupplierName]   = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [supplierRating, setSupplierRating] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const p = await res.json();

        setTitle(p.title);
        setCategory(p.category);
        setDescription(p.description);
        setPrice(p.price);
        setStockQuantity(p.stockQuantity);
        setSupplierName(p.supplier?.name || "");
        setSupplierEmail(p.supplier?.contactEmail || "");
        setSupplierPhone(p.supplier?.contactPhone || "");
        setSupplierRating(p.supplier?.rating || "");
      } catch (err) {
        setError(err.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = {
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

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update product");
      }

      await res.json();
      navigate(`/products/${id}`);
    } catch (err) {
      alert(err.message || "Error updating product");
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <div className="create">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* giống phần Add, nhưng dùng state hiện tại */}
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

        <button type="submit">Save changes</button>
      </form>
    </div>
  );
};

export default EditProductPage;
