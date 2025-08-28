"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-brand-cream items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="left"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "I’ve struggled with dry patches for years, but Kareè whipped shea butter leaves my skin so soft and glowing. It melts right in without feeling greasy.",
    name: "Amina I.",
    title: "⭐⭐⭐⭐⭐",
  },
  {
    quote:
      "The texture is unreal—like a silky cloud! I use it every night and wake up with hydrated, radiant skin. The packaging also feels so premium, I love having it on my dresser.",
    name: "Zara A.",
    title: "⭐⭐⭐⭐⭐",
  },
  {
    quote: "My elbows, heels, and even my cuticles used to be so dry. After just two weeks of using Kareè, my skin is smooth and nourished. A little goes a long way!",
    name: "Ifeoma O.",
    title: "⭐⭐⭐⭐⭐",
  },
  {
    quote:
      "I use it on my hair, my body, and even as a lip balm. It’s multipurpose and 100% natural, which makes it perfect for my sensitive skin.",
    name: "Jennifer M.",
    title: "⭐⭐⭐⭐⭐",
  },
  {
    quote:
      "I’ve tried other shea butters, but Kareè is on another level. The whipping makes it so much lighter and easier to apply. It feels like true luxury skincare without the crazy price tag.",
    name: "Adeola P.",
    title: "⭐⭐⭐⭐⭐",
  },
];
