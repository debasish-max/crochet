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
