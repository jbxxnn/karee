'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export function Hero() {
  const { scrollY } = useScroll();
  
  // Transform values for the large logo - stops at a point then disappears
  const logoScale = useTransform(scrollY, [0, 230], [1, 0.1]);
  const logoY = useTransform(scrollY, [0, -500], [0, 0]);
  const logoOpacity = useTransform(scrollY, [200, 230], [1, 0]);

  return (
    <section id="hero" className="relative bg-brand-cream min-h-screen overflow-hidden w-full">
      {/* Large Logo - Positioned above everything including header */}
      <motion.div 
        className="relative top-0 left-0 right-0 text-center z-[60]"
        style={{
          scale: logoScale,
          y: logoY,
          opacity: logoOpacity
        }}
      >
        <motion.h1 
          className="text-8xl md:text-9xl lg:text-[25rem] font-bold text-brand-black tracking-tight font-bricolage"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          kareè
        </motion.h1>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4">

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="relative lg:col-span-1"
          >
            <div className="relative w-full h-[500px] lg:h-[700px] overflow-hidden">
              <Image
                src="/home-1-3.jpg"
                alt="Natural shea butter product application"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          {/* Right Column - Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left h-full flex flex-col justify-start lg:col-span-1"
          >
            <motion.h2 
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-black leading-tight text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
            >
              Nourish Your Skin, Naturally.
            </motion.h2>
            
            <motion.p 
              className="text-sm md:text-base text-brand-black leading-relaxed text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
            >
             Premium whipped shea butter, crafted with love for glowing, healthy skin.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
