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
    <section className="relative bg-brand-cream min-h-screen overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          color: 'currentColor'
        }} />
      </div>

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
          className="text-8xl md:text-9xl lg:text-[25rem] font-bold text-brand-black tracking-tight"
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
            className="relative"
          >
            <div className="relative w-full h-[500px] lg:h-[900px] overflow-hidden">
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
            className="text-center lg:text-left h-full flex flex-col justify-between"
          >
            <motion.h2 
              className="text-4xl md:text-3xl lg:text-4xl font-bold text-brand-black leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
            >
              100% organic and natural <br /> shea butter
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-brand-black leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
            >
              Discover the perfect blend of natural ingredients for your skin
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div 
          className="w-6 h-10 border-2 border-brand-black rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-1 h-3 bg-brand-black rounded-full mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
