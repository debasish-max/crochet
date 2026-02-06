// import { Link } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { useState } from "react";

// export default function Navbar() {
//   const { uniqueCount } = useCart();
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-20 bg-bg border-b">
//       <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-4">
//         <h1 className="text-xl font-bold text-brand">not.a.yarnie</h1>

//         <nav className="hidden md:flex gap-6">
//           <Link to="/">Home</Link>
//           <Link to="/cart" className="relative">
//             Cart
//             {uniqueCount > 0 && (
//               <span className="absolute -top-2 -right-3 bg-brand text-white text-xs px-2 rounded-full">
//                 {uniqueCount}
//               </span>
//             )}
//           </Link>
//         </nav>

//         <button
//           onClick={() => setOpen(!open)}
//           className="md:hidden text-xl"
//         >
//           ☰
//         </button>
//       </div>

//       {open && (
//         <div className="m-4 md:hidden border-t px-4 py-4 font-semibold bg-orange-100 rounded-xl">
//           <Link onClick={() => setOpen(false)} to="/" className="block mb-3">
//             Home
//           </Link>
//           <Link onClick={() => setOpen(false)} to="/cart">
//             Cart {uniqueCount > 0 && `(${uniqueCount})`}
//           </Link>
//         </div>
//       )}
//     </header>
//   );
// }

{/* updated code for a minimal ui */}
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
        <div className="m-1 md:hidden border-t px-2 py-2 font-semibold bg-orange-100 rounded-xl">
          <Link onClick={() => setOpen(false)} to="/cart">
            Cart {uniqueCount > 0 && `(${uniqueCount})`}
          </Link>
        </div>

      </div>
    </header>
  );
}
