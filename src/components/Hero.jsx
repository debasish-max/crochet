import { useEffect, useState } from "react";

const slides = ["/5.jpg", "/7.jpg", "/3.jpg", "/b8.jpg"];

export default function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setI((p) => (p + 1) % slides.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-[#ffe6c8] py-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-4 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-4">Crochet Magics</h2>
          <p className="mb-6">
            Handmade crochet items with love. Custom orders available.
          </p>
        </div>

        <img
          src={slides[i]}
          className="rounded-2xl w-full h-64 object-cover"
        />
      </div>
    </section>
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
