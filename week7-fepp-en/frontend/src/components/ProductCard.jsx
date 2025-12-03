import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="product-preview">
      <h2>
        <Link to={`/products/${product._id}`}>{product.title}</Link>
      </h2>
      <p>Category: {product.category}</p>
      <p>Price: €{product.price}</p>
      <p>Stock: {product.stockQuantity}</p>
      <p>Supplier: {product.supplier?.name}</p>
    </div>
  );
};

export default ProductCard;
