import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

export default function Cart({ setToast }) {
  const { cart, total, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
const [address, setAddress] = useState("");


  if (cart.length === 0) {
    return <p className="text-center mt-20">Your cart is empty.</p>;
  }

  const sendOrder = () => {
    let msg = "New Order\n\n";
    cart.forEach((i) => (msg += `${i.name} x ${i.qty}\n`));
    msg += `\nTotal: ₹${total}`;

    clearCart();
    setToast("Order placed. Redirecting...");
    setTimeout(() => setToast(""), 2000);

    window.open(
      `https://wa.me/916901188826?text=${encodeURIComponent(msg)}`
    );
  };

  return (
    <section className="max-w-xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-4">Your Wheels Box</h2>

      {cart.map((item) => (
        <CartItem key={item.name} item={item} />
      ))}

      <p className="font-bold mt-4">Total: ₹{total}</p>

      <button
        onClick={sendOrder}
        className="mt-6 w-full bg-brand text-white py-2 rounded-full"
      >
        Send Order on WhatsApp
      </button>
    </section>
  );
}
