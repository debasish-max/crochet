import { useEffect, useState } from "react";

const slides = ["/5.jpg", "/7.jpg", "/3.jpg", "/b8.jpg"];

export default function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setI((p) => (p + 1) % slides.length);
    }, 3500);
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
