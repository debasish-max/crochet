import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { useState } from "react";

export default function Home({ setToast }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <>
      <Hero />

      <section className="max-w-6xl mx-auto px-4 py-12">
        <input
          className="border rounded-full px-4 py-2 mb-6 w-64"
          placeholder="Search products..."
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginated.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              setToast={setToast}
            />
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-1 bg-brand text-white rounded-full"
          >
            Prev
          </button>
          <button
            onClick={() =>
              setPage((p) =>
                p * perPage < filtered.length ? p + 1 : p
              )
            }
            className="px-4 py-1 bg-brand text-white rounded-full"
          >
            Next
          </button>
        </div>
      </section>

      {/* added later */}
      <section className="about-section">
        <h2>About Us</h2>
        <p>
          We create handmade crochet products with love and care.
          Every item is crafted patiently to bring warmth, joy,
          and a personal touch to your everyday life.
        </p>
      </section>
      <section className="contact-section">
        <h2>Contact Us</h2>

        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="4" required></textarea>

          <button type="submit">Send Message</button>
        </form>
      </section>


    </>
  );
}

{/* SAMPLE CODE */}
// import React from "react";

// const products = [
//   {
//     id: 1,
//     name: "Alphabet Keychain",
//     price: 159,
//     image: "/5.jpg",
//   },
//   {
//     id: 2,
//     name: "Multicolor Muffler",
//     price: 699,
//     image: "/7.jpg",
//   },
// ];

// export default function Home() {
//   return (
//     <main className="bg-gradient-to-b from-[#f9efe6] to-white">
//       {/* HERO SECTION */}
//       <section className="max-w-7xl mx-auto px-6 py-20">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
//           {/* Hero Image */}
//           <div className="relative">
//             <img
//               src="/3.jpg"
//               alt="Crochet product"
//               className="rounded-3xl shadow-xl object-cover w-full h-[420px]"
//             />
//             <div className="absolute inset-0 rounded-3xl ring-1 ring-black/5"></div>
//           </div>

//           {/* Hero Content */}
//           <div>
//             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
//               Crochet <span className="text-orange-500">Magic</span>
//             </h1>

//             <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
//               Handmade crochet items crafted with love and care.
//               Custom orders available to make every piece unique.
//             </p>

//             <div className="mt-8 flex gap-4">
//               <button className="px-7 py-3 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition">
//                 Shop Now
//               </button>
//               <button className="px-7 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
//                 Contact Us
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* PRODUCTS SECTION */}
//       <section className="max-w-7xl mx-auto px-6 pb-24">
//         {/* Section Header */}
//         <div className="text-center mb-14">
//           <h2 className="text-3xl font-bold text-gray-900">
//             Featured Products
//           </h2>
//           <p className="mt-3 text-gray-600">
//             Handmade with passion & precision
//           </p>
//         </div>

//         {/* Product Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
//             >
//               <div className="overflow-hidden">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="h-56 w-full object-cover group-hover:scale-105 transition duration-300"
//                 />
//               </div>

//               <div className="p-5">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   {product.name}
//                 </h3>

//                 <p className="mt-1 text-orange-600 font-medium">
//                   ₹{product.price}
//                 </p>

//                 <button className="mt-4 w-full rounded-xl bg-orange-500 py-2 text-white font-medium hover:bg-orange-600 transition">
//                   Add to Cart
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// }
