// PromoCarousel.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/promos/headphones.jpg",
  "/promos/sneakers.jpg",
  "/promos/watch.jpg",
  "/promos/botte.jpg",
];

const texts = [
  "Découvrez les dernières tendances !",
  "Achetez et vendez facilement",
  "Profitez de nos promotions exclusives",
  "Livraison rapide et sécurisée",
];

export default function PromoCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // change every 4s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-3xl shadow-lg md:h-[500px] lg:h-[600px]">
      <AnimatePresence>
        <motion.img
          key={images[current]}
          src={images[current]}
          alt={`Promo ${current + 1}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
          className="w-full h-full object-cover rounded-3xl absolute top-0 left-0"
        />

        <motion.div
          key={texts[current]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white text-lg md:text-2xl lg:text-3xl font-bold drop-shadow-lg px-4"
        >
          {texts[current]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
