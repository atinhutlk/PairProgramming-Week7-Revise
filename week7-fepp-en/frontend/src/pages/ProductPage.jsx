import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const ProductPage = ({ isAuthenticated }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const stored = localStorage.getItem("user");
      const token  = stored ? JSON.parse(stored).token : null;

      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete product");
      }

      navigate("/");
    } catch (err) {
      alert(err.message || "Error deleting product");
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error)   return <p>Error: {error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-details">
      <h2>{product.title}</h2>

      <div>
        <p><span>Category:</span> {product.category}</p>
        <p><span>Description:</span> {product.description}</p>
        <p><span>Price:</span> €{product.price}</p>
        <p><span>Stock:</span> {product.stockQuantity}</p>
      </div>

      <div>
        <h3>Supplier</h3>
        <p><span>Name:</span> {product.supplier?.name}</p>
        <p><span>Email:</span> {product.supplier?.contactEmail}</p>
        <p><span>Phone:</span> {product.supplier?.contactPhone}</p>
        <p><span>Rating:</span> {product.supplier?.rating}</p>
      </div>

       {isAuthenticated && (
      <>
        <button onClick={handleDelete}>Delete</button>{" "}
        <Link to={`/products/${product._id}/edit`}>Edit</Link>
      </>
    )}
    </div>
  );
};

export default ProductPage;
