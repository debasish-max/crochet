import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartItem from "../components/CartItem";
import { ShoppingBag, Loader2, Phone } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Cart({ setToast }) {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return <p className="text-center mt-20">Your cart is empty.</p>;
  }

  const sendOrder = async () => {
    if (!user) {
      setToast("Please login to place an order");
      setTimeout(() => setToast(""), 3000);
      return;
    }

    if (!customerName || !contact || !address) {
      setToast("Please fill in all fields (Name, Contact, Address)");
      setTimeout(() => setToast(""), 2000);
      return;
    }

    setIsSubmitting(true);

    try {
      // Save order to Supabase
      const { error } = await supabase.from("orders").insert([
        {
          customer_name: customerName,
          contact_number: contact,
          address: address,
          items: cart,
          total_amount: total,
          status: "pending",
          user_id: user?.id || null,
        },
      ]);

      if (error) throw error;

      clearCart();
      navigate("/order-success");
    } catch (error) {
      console.error("Error saving order:", error);
      setToast(`Error: ${error.message || "Failed to save order"}`);
      setTimeout(() => setToast(""), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">Your Cart<span className=" inline-flex items-center "><ShoppingBag /></span></h2>

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
        className="mt-4 w-full border border-orange-100 p-3 rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none"
      />

      <div className="relative mt-3">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="tel"
          placeholder="Contact Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full border border-orange-100 p-3 pl-10 rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none"
        />
      </div>

      <textarea
        placeholder="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="mt-3 w-full border border-orange-100 p-3 rounded-2xl focus:ring-2 focus:ring-brand/20 outline-none min-h-[100px]"
      />

      <button
        onClick={sendOrder}
        disabled={isSubmitting}
        className="mt-6 w-full bg-brand text-white py-3 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 font-bold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Processing...
          </>
        ) : (
          "Place Order"
        )}
      </button>
    </section>
  );
}
