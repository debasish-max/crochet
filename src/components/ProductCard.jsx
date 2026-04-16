import { useCart } from "../context/CartContext";
import { Plus, ShoppingCart } from "lucide-react";

export default function ProductCard({ product, setToast }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
    setToast("Added to cart");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="group bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500 border border-orange-50/50 flex flex-col h-full relative overflow-hidden">
      {/* Product Image Container */}
      <div className="w-full aspect-square overflow-hidden rounded-[1.5rem] bg-gray-50 mb-4 relative">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        {/* Quick Add Overlay (Optional aesthetic touch) */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/20 to-transparent">
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 px-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-[15px] font-bold text-gray-800 leading-tight group-hover:text-brand transition-colors">
            {product.name}
          </h3>
          <span className="text-brand font-black text-lg whitespace-nowrap">
            ₹{product.price}
          </span>
        </div>
        
        {/* Description or extra info */}
        <p className="text-xs text-gray-500 mb-4 line-clamp-2 italic">
          {product.description || "Handcrafted with premium yarn"}
        </p>

        {/* Dynamic Action Button */}
        <button
          onClick={handleAdd}
          className="mt-auto w-full group/btn relative overflow-hidden bg-gray-900 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand transition-all duration-300 shadow-lg shadow-gray-200 hover:shadow-brand/30 active:scale-95"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]" />
          <ShoppingCart size={18} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
