import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { increaseQty, decreaseQty } = useCart();

  return (
    <div className="flex justify-between items-center border-b py-3">
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-gray-500">
          ₹{item.price * item.qty}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => decreaseQty(item.name)}
          className="w-8 h-8 rounded-full bg-gray-200"
        >
          −
        </button>
        <span>{item.qty}</span>
        <button
          onClick={() => increaseQty(item.name)}
          className="w-8 h-8 rounded-full bg-gray-200"
        >
          +
        </button>
      </div>
    </div>
  );
}
