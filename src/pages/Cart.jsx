import { useState } from "react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { ShoppingBag } from "lucide-react";

export default function Cart({ setToast }) {
  const { cart, total, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");

  if (cart.length === 0) {
    return <p className="text-center mt-20">Your cart is empty.</p>;
  }

  const sendOrder = () => {
    if (!customerName || !address) {
      setToast("Please enter name and address");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    let msg = `New Order\n\nName: ${customerName}\nAddress: ${address}\n\n`;

    cart.forEach((i) => {
      msg += `${i.name} x ${i.qty}\n`;
    });

    msg += `\nTotal: ₹${total}`;

    window.open(
      `https://wa.me/916900195552?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    clearCart();
    setToast("Order placed successfully");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <section className="max-w-xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">Your Cart<span className=" inline-flex items-center "><ShoppingBag/></span></h2>

      {cart.map((item) => (
        <CartItem key={item.name} item={item} />
      ))}

      <p className="font-bold mt-4">Total: ₹{total}</p>
      <span className="block text-sm font-semibold text-orange-400 mt-1"><span className="font-bold text-red-700">*</span>Delivery Charges Applicable</span>

      <input
        type="text"
        placeholder="Your Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className="mt-4 w-full border p-2 rounded"
      />

      <textarea
        placeholder="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="mt-3 w-full border p-2 rounded"
      />

      <button
        onClick={sendOrder}
        className="mt-6 w-full bg-brand text-white py-2 rounded-full"
      >
        Send Order on WhatsApp
      </button>
    </section>
  );
}
