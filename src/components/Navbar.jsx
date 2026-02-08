{/* updated code for a minimal ui */ }
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { uniqueCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-bg border-b">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-4">
        <h1 className="text-xl font-bold text-brand">not.a.yarnie</h1>

        <nav className="hidden md:flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/cart" className="relative">
            Cart
            {uniqueCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand text-white text-xs px-2 rounded-full">
                {uniqueCount}
              </span>
            )}
          </Link>
        </nav>
        <div className="md:hidden font-semibold flex items-center justify-end gap-3 px-4 py-2">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="px-4 py-1 rounded-lg bg-orange-100 shadow-md text-gray-800 hover:bg-orange-200"
          >
            Home
          </Link>

          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="relative px-4 py-1 rounded-lg bg-orange-100 shadow-md text-gray-800 hover:bg-orange-200"
          >
            Cart
            {uniqueCount > 0 && (
              <span className="ml-1 text-sm font-semibold">
                ({uniqueCount})
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}
