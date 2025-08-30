'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductWithImages } from '@/lib/services/product-service';
import { ProductGallery } from './product-gallery';
import { ProductVariants } from './product-variants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart-store';
// import Image from 'next/image';

interface ProductDetailProps {
  product: ProductWithImages & {
    product_variants?: Array<{
      id: string;
      name: string;
      price: number;
      stock_quantity?: number;
    }>;
    specifications?: Record<string, string | number>;
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<{
    id: string;
    name: string;
    price: number;
  } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const addToCart = useCartStore(state => state.addItem);
  const openCart = useCartStore(state => state.openCart);

  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const currentPrice = selectedVariant?.price || product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compare_price! - currentPrice) / product.compare_price!) * 100)
    : 0;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      addToCart(product, quantity, selectedVariant || undefined);
      openCart();
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  return (
    <>
      {/* SECTION 1: Main Product Section */}
      <motion.div 
        className="flex flex-col lg:flex-row gap-0 border-b border-brand-black items-start pl-0 pt-0 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
       >
        {/* Left Column - Product Images */}
        <motion.div 
          className="lg:w-[63%]"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <ProductGallery images={product.product_images} />
        </motion.div>

        {/* Right Column - Product Info */}
        <motion.div 
          className="lg:sticky lg:top-0 lg:w-[37%] lg:flex lg:justify-end"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <div className="lg:h-screen">
            <div className="space-y-2 bg-white p-[4rem] pt-[10rem] w-full h-screen">
              {/* Product Name */}
              <motion.h1 
                className="text-5xl font-pp-mori font-bold text-brand-black dark:text-brand-black"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
              >
                {product.name}
              </motion.h1>

              {/* Price */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-10">
                  <span className="text-2xl font-pp-mori font-bold text-brand-black dark:text-gray-100">
                    ₦{currentPrice.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                      ₦{product.compare_price!.toFixed(2)}
                      </span>
                      <Badge className="bg-red-500 text-white border-0">
                        {discountPercentage}% OFF
                      </Badge>
                    </>
                  )}
                </div>
                {hasDiscount && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    You save ₦{(product.compare_price! - currentPrice).toFixed(2)}!
                  </p>
                )}
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
              >
                <p className="text-sm text-brand-black dark:text-brand-black font-pp-mori mb-10">
                  {product.short_description}
                </p>
              </motion.div>

              {/* Product Variants */}
              {product.product_variants && product.product_variants.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 1.2 }}
                >
                  <ProductVariants
                    variants={product.product_variants}
                    selectedVariant={selectedVariant}
                    onVariantSelect={setSelectedVariant}
                  />
                </motion.div>
              )}

              {/* Quantity Selector */}
              <motion.div 
                className="flex flex-row items-center !mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.4 }}
              >
                <div className="flex items-center gap-3 border p-3">
                  <Button
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-6 h-6 p-0 rounded-full bg-[#00000000] text-brand-black shadow-none hover:bg-[#00000000] hover:text-brand-black"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-4 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock_quantity}
                    className="w-6 h-6 p-0 rounded-full shadow-none bg-[#00000000] text-brand-black hover:bg-[#00000000] hover:text-brand-black"
                  >
                   <Plus size={16} />
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.6 }}
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock_quantity <= 0}
                  size="lg"
                  className="w-full text-white py-6 bg-brand-black rounded-none shadow-sm hover:text-brand-black hover:bg-white hover:border-brand-black hover:border transition-all duration-200"
                >
                  {isAddingToCart ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      Adding to Cart...
                    </div>
                  ) : (
                                     <div className="flex items-center justify-center w-full">
                         <div className="flex items-center gap-2">
                           <p className="text-sm font-pp-mori font-bold">Add to Cart</p>
                         </div>
                       </div>
                  )}
                </Button>
              </motion.div>

              {/* Product Benefits List */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.8 }}
              >
                <div className="grid">
                  {[
                    { text: "30 Days Return"},
                    { text: "Free Shipping"},
                    { text: "Vegan & Cruelty Free"},
                    { text: "Kind to Planet Packaging"}
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-xs uppercase font-bold font-pp-mori text-brand-black">
                        {benefit.text}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Product Specifications */}
              <motion.div 
                className="space-y-3 !mt-[5rem]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 2.0 }}
              >
                <div className="space-y-2">
                  {[
                    { label: "ORIGIN", value: "Ethiopia, SidamaBensa. 1900-2200 m" },
                    { label: "VARIETY", value: "Arabica Heirloom, light roast, natural process" },
                    { label: "DETAILS", value: "Flowery, bright, fruity. For filter." },
                    { label: "WEIGHT", value: "200 g (7,05 oz)" }
                  ].map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-bold text-gray-900 dark:text-gray-100 uppercase text-sm">
                        {spec.label}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Specifications */}
              {product.specifications && (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 2.2 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Specifications
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* SECTION 2: Product Benefits Section - COMPLETELY SEPARATE */}
      <motion.div 
        className="w-full bg-white py-[7rem] px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 2.4 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid items-start">
            {/* Left Column - Product Image */}
            {/* <div className="flex justify-center lg:justify-start relative">
              <div className="relative w-32 h-32 bg-brand-cream rounded-full flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full flex items-center justify-center">
                  <div className="w-16 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg"></div>
                </div>
              </div>
            </div> */}

            {/* Center Column - Main Content */}
            <div className="text-center space-y-6">
              {/* Decorative Symbol */}
              <div className="flex justify-center">
              <svg  
              width="83" 
              height="92" 
              viewBox="0 0 83 92" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              >
                <path 
                d="M83 23.974L43.8141 45.8502L83 68.0261L82.0744 69.8241L42.5799 47.9479V92H40.4201V47.9479L1.2342 69.8241L0 68.0261L39.4944 45.8502L0 23.974L1.2342 22.1759L40.4201 44.0521V0H42.5799V44.0521L82.0744 22.1759L83 23.974Z" 
                fill="#3B3B3B">
                  </path>
                  </svg>
              </div>

              {/* Main Description */}
              <h2 className="text-4xl lg:text-5xl font-pp-mori font-medium text-brand-black mx-auto">
              At Kareè, we believe skincare is a ritual. That’s why our shea butter is hand-whipped in small batches to achieve a luxurious, cloud-like texture.
              </h2>
            </div>

            {/* Right Column - Product Drops Image */}
            {/* <div className="flex justify-center lg:justify-end relative">
              <div className="relative w-32 h-32 bg-brand-cream rounded-full flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full flex items-center justify-center relative">
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-amber-300 rounded-full"></div>
                  <div className="absolute top-2 -left-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                  <div className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                </div>
              </div>
            </div> */}
          </div>

          {/* Bottom Sections */}
          <div className="grid lg:grid-cols-2 gap-12 mt-16">
            {/* RECOMMENDED FOR Section */}
            <motion.div 
              className="space-y-4 grid lg:grid-cols-2 gap-12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 2.6 }}
            >
              <div>
              <h3 className="text-lg font-pp-mori font-bold text-brand-black uppercase tracking-wide">
                Recommended For
              </h3>
              <ul className="space-y-2">
                {[
                  "Dull Skin",
                  "Hyper Pigmentation", 
                  "Uneven Skin Tone",
                  "Excess Oil",
                  "Enlarged Pores"
                ].map((concern, index) => (
                  <li key={index} className="flex items-center text-brand-black">
                    <span className="w-2 h-2 bg-brand-black rounded-full mr-3"></span>
                    {concern}
                  </li>
                ))}
              </ul>
              </div>
              <div>
              <h3 className="text-lg font-pp-mori font-bold text-brand-black uppercase tracking-wide">
                Good to Know
              </h3>
              <ul className="space-y-2">
                {[
                  "pH: 4.8",
                  "Clean, verified ingredients",
                  "Vegan, Cruelty-free",
                  "No Artificial colours added",
                  "For all skin-types"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-brand-black">
                    <span className="w-2 h-2 bg-brand-black rounded-full mr-3 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              </div>
            </motion.div>

            {/* GOOD TO KNOW Section */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 2.8 }}
            >
              <h3 className="text-lg font-pp-mori font-bold text-brand-black uppercase tracking-wide">
                Good to Know
              </h3>
              <ul className="space-y-2">
                {[
                  "pH: 4.8",
                  "Clean, verified ingredients",
                  "Vegan, Cruelty-free",
                  "No Artificial colours added",
                  "For all skin-types"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-brand-black">
                    <span className="w-2 h-2 bg-brand-black rounded-full mr-3 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
