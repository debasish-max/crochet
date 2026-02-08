import { useCart } from "../context/CartContext";

export default function ProductCard({ product, setToast }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
    setToast("Added to cart");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="bg-white rounded-xl p-3 shadow">
      <div className="w-full aspect-[4/3] overflow-hidden rounded-lg">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="mt-1 text-sm font-semibold leading-tight">
        {product.name}
      </h3>

      <p className="text-brand font-bold text-sm">
        ₹{product.price}
      </p>

      <button
        onClick={handleAdd}
        className="mt-2 w-full bg-brand text-white py-1.5 text-sm rounded-full"
      >
        Add to Cart
      </button>
    </div>
  );
}
