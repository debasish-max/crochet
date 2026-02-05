import { useCart } from "../context/CartContext";

export default function ProductCard({ product, setToast }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
    setToast("Added to cart");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <img
        src={product.img}
        className="h-48 w-full object-cover rounded-lg"
      />
      <h3 className="mt-2 font-semibold">{product.name}</h3>
      <p className="text-brand font-bold">₹{product.price}</p>

      <button
        onClick={handleAdd}
        className="mt-3 w-full bg-brand text-white py-2 rounded-full"
      >
        Add to Cart
      </button>
    </div>
  );
}
