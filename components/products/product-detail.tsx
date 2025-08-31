'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductWithImages, productService } from '@/lib/services/product-service';
import { ProductGallery } from './product-gallery';
import { ProductVariants } from './product-variants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart-store';
import Image from 'next/image';
import Link from 'next/link';

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
  const [activeTab, setActiveTab] = useState('About');
  const [relatedProducts, setRelatedProducts] = useState<ProductWithImages[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  
  const addToCart = useCartStore(state => state.addItem);
  const openCart = useCartStore(state => state.openCart);

  // Fetch related products when component mounts
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product.category?.id) {
        try {
          setLoadingRelated(true);
          const related = await productService.getRelatedProducts(
            product.category.id, 
            product.id, 
            4
          );
          setRelatedProducts(related);
        } catch (error) {
          console.error('Error fetching related products:', error);
        } finally {
          setLoadingRelated(false);
        }
      } else {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [product.category?.id, product.id]);

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
          className="hidden md:block w-full lg:w-[63%]"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <ProductGallery images={product.product_images} />
        </motion.div>

        {/* Right Column - Product Info */}
        <motion.div 
          className="lg:sticky lg:top-0 w-full lg:w-[37%] lg:flex lg:justify-end"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <div className="lg:h-screen">
            <div className="space-y-2 bg-white p-[2rem] md:p-[4rem] py-[6rem] md:py-[10rem] w-full min-h-[100vh]">
              {/* Product Name */}
              <motion.h1 
                className="text-2xl md:text-5xl uppercase font-geist font-ultrabold text-brand-black dark:text-brand-black mb-6 md:mb-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
              >
                {product.name}
              </motion.h1>

              <div className="md:hidden !mb-10">
                <ProductGallery images={product.product_images} />
              </div>

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

                <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 1.6 }}
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock_quantity <= 0}
                  size="lg"
                  className="w-full text-white py-6 bg-brand-black rounded-none shadow-sm hover:text-brand-black border-brand-black border hover:bg-white hover:border-brand-black hover:border transition-all duration-200"
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
                  ].map((spec, index, array) => (
                    <div 
                      key={index} 
                      className={`flex flex-col md:flex-row justify-between py-2 pb-4 md:pb-0 ${
                        index === array.length - 1 
                          ? '' 
                          : 'border-b border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className="font-bold text-gray-900 dark:text-gray-100 uppercase text-sm">
                        {spec.label}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">
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
              width="40" 
              height="40" 
              viewBox="0 0 83 92" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              >
                <path 
                d="M83 23.974L43.8141 45.8502L83 68.0261L82.0744 69.8241L42.5799 47.9479V92H40.4201V47.9479L1.2342 69.8241L0 68.0261L39.4944 45.8502L0 23.974L1.2342 22.1759L40.4201 44.0521V0H42.5799V44.0521L82.0744 22.1759L83 23.974Z" 
                fill="#000000">
                  </path>
                  </svg>
              </div>

              {/* Main Description */}
              <h2 className="text-4xl lg:text-5xl font-pp-mori font-medium text-brand-black max-w-4xl mx-auto">
              Our shea butter is hand-whipped in small batches to achieve a <span className="font-pp-editorial italic">luxurious,</span> cloud-like texture.
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
          <div className="grid lg:grid-cols-4 gap-12 mt-16">
            {/* RECOMMENDED FOR Section */}
            <motion.div 
              className="space-y-0 grid col-span-2 lg:grid-cols-2 gap-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 2.6 }}
            >
              <div>
              <h3 className="text-sm font-pp-mori font-normal text-brand-black uppercase tracking-wide mb-4">
                Recommended For
              </h3>
              <ul className="space-y-0">
                {[
                  "Dull Skin",
                  "Hyper Pigmentation", 
                  "Uneven Skin Tone",
                  "Excess Oil",
                  "Enlarged Pores"
                ].map((concern, index) => (
                  <li key={index} className="flex items-center text-brand-black text-xs">
                    <span className="w-1 h-1 bg-brand-black rounded-full mr-3"></span>
                    {concern}
                  </li>
                ))}
              </ul>
              </div>
              <div className="!mt-10 md:!mt-0">
              <h3 className="text-sm font-pp-mori font-normal text-brand-black uppercase tracking-wide mb-4">
                Good to Know
              </h3>
              <ul className="space-y-0">
                {[
                  "pH: 4.8",
                  "Clean, verified ingredients",
                  "Vegan, Cruelty-free",
                  "No Artificial colours added",
                  "For all skin-types"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-brand-black text-xs">
                    <span className="w-1 h-1 bg-brand-black rounded-full mr-3"></span>
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
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* SECTION 3: All About The Product */}
      <motion.div 
        className="w-full bg-white py-4 md:py-[5rem] px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 3.0 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-brand-black mb-8">
              <span className="font-pp-editorial italic font-normal">About Our Product</span>
            </h2>
            
            {/* Navigation Tabs */}
            <div className="flex justify-center space-x-8 border-b border-gray-200">
              {["About", "Ingredients", "Usage", "FAQ"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 text-sm font-medium uppercase tracking-wide transition-colors cursor-pointer ${
                    activeTab === tab
                      ? "text-brand-black border-b-2 border-black" 
                      : "text-gray-500 hover:text-brand-black"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid gap-16 items-start pt-[0rem] md:pt-[3rem] py-[3rem]">
            {/* Left Column - Product Visuals */}
            {/* <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 3.2 }}
            > */}
              {/* Product Box */}
              {/* <div className="bg-pink-100 p-8 rounded-lg">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold text-brand-black mb-2">K</div>
                  <div className="space-y-1 text-sm font-medium text-brand-black">
                    <div>Pure Brilliance</div>
                    <div>AHA</div>
                    <div>Brightening</div>
                    <div>Exfoliant</div>
                    <div>Cleanser</div>
                  </div>
                  <div className="flex justify-center space-x-2 mt-4">
                    <div className="w-3 h-3 bg-brand-black rounded-full"></div>
                    <div className="w-3 h-3 bg-brand-black rounded-full"></div>
                    <div className="w-3 h-3 bg-brand-black rounded-full"></div>
                  </div>
                  <div className="text-xs text-brand-black mt-4">
                    <div>Glycolic Acid 2%,</div>
                    <div>CICA, Turmeric,</div>
                    <div>Licorice</div>
                  </div>
                  <div className="text-sm font-bold text-brand-black mt-4">true.Kind.</div>
                </div>
              </div> */}

              {/* Product Bottle */}
              {/* <div className="bg-pink-100 p-8 rounded-lg">
                <div className="text-center space-y-4">
                  <div className="w-16 h-24 bg-amber-700 rounded-lg mx-auto mb-4 relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-black rounded-full"></div>
                  </div>
                  <div className="text-3xl font-bold text-brand-black mb-2">K</div>
                  <div className="space-y-1 text-sm font-medium text-brand-black">
                    <div>Pure Brilliance</div>
                    <div>AHA</div>
                    <div>Brightening</div>
                    <div>Exfoliant</div>
                    <div>Cleanser</div>
                  </div>
                  <div className="text-xs text-brand-black mt-4">
                    <div>Glycolic Acid 2%,</div>
                    <div>CICA, Turmeric,</div>
                    <div>Licorice</div>
                  </div>
                  <div className="text-sm font-bold text-brand-black mt-4">true.Kind.</div>
                </div>
              </div>
            </motion.div> */}

            {/* Right Column - Product Information */}
            <motion.div 
              className="space-y-8 w-[95%] mx-auto"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 3.4 }}
            >
              {/* Tab Content */}
              {activeTab === 'About' && (
                <>
                  {/* About The Product */}
                  <div className="flex gap-4 justify-between items-center">

                    <div className="w-full hidden md:block">
                      <Image 
                      src="/home-2.jpg" 
                      alt="About The Product" 
                      width={500} 
                      height={500} 
                      />
                    </div>

                  <div className="w-full">
                  <div className="space-y-4">
                    <h3 className="text-xs font-medium font-pp-mori text-gray-600 uppercase tracking-wide">
                      About The Product
                    </h3>
                    <p className="text-md font-medium text-brand-black leading-relaxed">
                      A boost of anti-oxidant rich nourishing renewal for dull, dry and tired skin, this super-absorbable oil will help with clearing dark spots & blemishes and creating an even-looking, brighter complexion.
                    </p>
                  </div>

                  <div className="w-full block md:hidden !mt-[3rem]">
                      <Image 
                      src="/home-2.jpg" 
                      alt="About The Product" 
                      width={500} 
                      height={500} 
                      />
                  </div>

                  {/* Recommended For */}
                  <div className="flex justify-start gap-[5rem] !mt-[3rem] md:!mt-[5rem]">
                  <div className="space-y-4">
                    <h3 className="text-xs font-medium font-pp-mori text-gray-600 uppercase tracking-wide">
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
                        <li key={index} className="flex items-center text-brand-black text-xs font-pp-mori font-bold">
                          <span className="w-1.5 h-1.5 bg-brand-black rounded-full mr-3"></span>
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suitable For */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-medium font-pp-mori text-gray-600 uppercase tracking-wide">
                      Suitable For
                    </h3>
                    <ul className="space-y-2">
                      {[
                        "Unisex skin care for all Skin Types",
                        "Pregnancy Safe"
                      ].map((item, index) => (
                        <li key={index} className="flex items-center text-brand-black text-xs font-pp-mori font-bold">
                          <span className="w-1.5 h-1.5 bg-brand-black rounded-full mr-3"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  </div>

                  {/* Feature Icons */}
                  <div className="grid grid-cols-4 gap-6 pt-[3rem] md:pt-[5rem]">
                    {[
                      { 
                        icon: (
                          <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_2492_1314)">
                              <path d="M2.12012 20.0972C2.17302 19.9517 2.21269 19.8327 2.29204 19.6872C2.63587 18.7879 3.49546 18.1664 4.47408 18.1399C5.0824 18.1135 5.67751 18.1399 6.28583 18.1399C6.74869 18.1399 6.98673 18.378 6.98673 18.8408C6.98673 20.0046 6.98673 21.1419 6.98673 22.2924C6.98673 22.7817 6.77514 22.9933 6.28583 22.9933C5.7304 22.9933 5.17497 22.9933 4.61955 22.9933C3.42934 22.9933 2.56975 22.3189 2.19946 21.1816C2.17302 21.1287 2.14657 21.089 2.13334 21.0096C2.12012 20.7055 2.12012 20.4145 2.12012 20.0972ZM5.77008 19.3566C5.38657 19.3566 5.01628 19.3566 4.65922 19.3566C4.56665 19.3566 4.4873 19.3566 4.39473 19.383C3.8393 19.4492 3.40289 19.9385 3.34999 20.4939C3.2971 21.0758 3.66738 21.6576 4.24926 21.7238C4.75179 21.7899 5.26755 21.7502 5.77008 21.7502C5.77008 20.9435 5.77008 20.1765 5.77008 19.3566Z" fill="black"/>
                              <path d="M21.9435 1.12C22.3535 1.33159 22.8428 1.47706 23.1999 1.768C23.7288 2.17795 23.9801 2.78628 23.9933 3.46073C24.0198 4.06906 23.9933 4.65093 23.9933 5.24604C23.9933 5.73534 23.7817 5.94693 23.266 5.97338C22.1287 5.97338 20.9914 5.97338 19.8541 5.97338C19.3647 5.97338 19.1532 5.76179 19.1267 5.24604C19.1267 4.71706 19.1267 4.16163 19.1267 3.63265C19.1267 2.44244 19.8012 1.5564 20.9385 1.21257C20.9914 1.18612 21.031 1.15967 21.1104 1.14644C21.3881 1.12 21.6526 1.12 21.9435 1.12ZM20.3566 4.74351C21.203 4.74351 21.97 4.74351 22.7767 4.74351C22.7767 4.3071 22.8031 3.87069 22.7767 3.46073C22.7238 2.82595 22.1948 2.32342 21.5732 2.34987C20.9385 2.34987 20.4095 2.83918 20.3698 3.48718C20.3301 3.87069 20.3566 4.3071 20.3566 4.74351Z" fill="black"/>
                              <path d="M21.1768 40C20.8859 39.881 20.5685 39.8016 20.304 39.6429C19.5502 39.2065 19.1667 38.5056 19.1138 37.6328C19.0874 37.0245 19.1138 36.4294 19.1138 35.8211C19.1138 35.3582 19.3518 35.1466 19.7883 35.1466C20.952 35.1466 22.1158 35.1466 23.2663 35.1466C23.7292 35.1466 23.9407 35.3846 23.9407 35.8211C23.9407 36.35 23.9407 36.9055 23.9407 37.4344C23.9407 38.7172 23.2663 39.59 22.0364 39.9206C21.9835 39.9471 21.9438 39.9735 21.8909 39.9868C21.6794 40 21.4413 40 21.1768 40ZM20.3569 36.3765C20.3569 36.8393 20.3305 37.2493 20.3569 37.6593C20.3834 38.2676 20.8859 38.7437 21.4942 38.7966C22.1025 38.8495 22.6976 38.4131 22.7505 37.7783C22.8034 37.3154 22.7505 36.8658 22.7505 36.3765C21.9438 36.3765 21.1768 36.3765 20.3569 36.3765Z" fill="black"/>
                              <path d="M41.0001 20.9435C40.8811 21.2344 40.7885 21.5783 40.6166 21.8428C40.1802 22.5701 39.4793 22.9536 38.6329 22.9801C38.0246 23.0065 37.4295 22.9801 36.8212 22.9801C36.3848 22.9801 36.1467 22.742 36.1467 22.3056C36.1467 21.1419 36.1467 19.9781 36.1467 18.8276C36.1467 18.3647 36.3848 18.1531 36.8212 18.1531C37.3766 18.1531 37.932 18.1531 38.4875 18.1531C39.6909 18.1531 40.5902 18.8276 40.934 19.9913C40.9604 20.0575 40.9869 20.1368 41.0001 20.2029C41.0001 20.441 41.0001 20.679 41.0001 20.9435ZM37.3766 21.7634C37.8395 21.7634 38.2759 21.7899 38.6858 21.7634C39.2942 21.7105 39.7438 21.208 39.7702 20.5997C39.7967 19.9913 39.3338 19.4095 38.7255 19.3698C38.2891 19.3169 37.8262 19.3698 37.3766 19.3698C37.3766 20.1765 37.3766 20.9435 37.3766 21.7634Z" fill="black"/>
                              <path d="M8.81179 20.5335C8.83824 13.4981 14.5644 7.7851 21.5734 7.81155C28.6089 7.838 34.3351 13.5907 34.3218 20.5996C34.2954 27.6351 28.5427 33.348 21.5338 33.3216C14.4983 33.2819 8.79857 27.5425 8.81179 20.5335ZM33.092 20.5864C33.092 14.2254 27.9212 9.05466 21.5602 9.02821C15.1992 9.02821 10.0284 14.199 10.002 20.56C10.002 26.9209 15.1728 32.0917 21.5338 32.1182C27.8947 32.1182 33.092 26.9474 33.092 20.5864Z" fill="black"/>
                              <path d="M33.8458 6.11881C34.5996 6.14526 35.3401 6.58167 35.7766 7.49416C36.213 8.40665 36.1204 9.30591 35.4592 10.0862C35.0228 10.6151 34.5202 11.078 34.0309 11.5409C33.7664 11.8053 33.4226 11.7789 33.1581 11.5144C32.3117 10.668 31.4654 9.84812 30.6455 9.00175C30.3545 8.71081 30.3545 8.36697 30.6455 8.08926C31.1083 7.6264 31.5447 7.17677 32.0208 6.74036C32.4175 6.31718 32.973 6.10558 33.8458 6.11881ZM33.621 10.2052C33.9119 9.91424 34.2293 9.6233 34.4938 9.30591C34.9302 8.81661 34.8773 8.10248 34.4409 7.66607C33.978 7.20322 33.2507 7.17677 32.7746 7.61318C32.4572 7.87767 32.1663 8.19505 31.9018 8.45954C32.4704 9.08109 33.0391 9.63652 33.621 10.2052Z" fill="black"/>
                              <path d="M9.51277 35.0144C8.52093 34.9615 7.76714 34.5251 7.33073 33.6126C6.89432 32.7001 7.01334 31.8008 7.67457 31.0206C8.11098 30.5181 8.58706 30.0552 9.07636 29.5923C9.34085 29.3279 9.68469 29.3279 9.94918 29.5923C10.7955 30.4387 11.6684 31.2851 12.4883 32.1315C12.7528 32.3959 12.7528 32.7398 12.4883 33.0043C12.0254 33.4936 11.5758 33.9432 11.0865 34.3796C10.6765 34.8292 10.1211 35.0144 9.51277 35.0144ZM9.51277 30.8883C9.22183 31.2057 8.90444 31.4967 8.61351 31.8008C8.20355 32.2637 8.25644 32.991 8.6664 33.4142C9.07636 33.8374 9.77726 33.9168 10.2666 33.5332C10.6236 33.2423 10.9146 32.8852 11.232 32.5679C10.6501 32.0257 10.0946 31.4702 9.51277 30.8883Z" fill="black"/>
                              <path d="M36.0014 32.8852C35.975 33.5861 35.5121 34.3399 34.6261 34.7763C33.7268 35.1863 32.8408 35.0937 32.0605 34.4589C31.5316 34.0225 31.0687 33.52 30.6058 33.0307C30.3413 32.7662 30.3413 32.4224 30.6058 32.1579C31.4522 31.3115 32.2986 30.4387 33.1449 29.6188C33.4094 29.3543 33.7533 29.3543 34.0178 29.6188C34.5071 30.0816 34.9567 30.5313 35.3931 31.0206C35.8295 31.4438 36.0147 31.9992 36.0014 32.8852ZM31.8886 32.6207C32.1796 32.9117 32.4705 33.2026 32.7614 33.4671C33.2507 33.9035 33.9913 33.9035 34.4277 33.4407C34.8906 33.0042 34.917 32.2505 34.4806 31.7744C34.2161 31.457 33.8987 31.166 33.6342 30.8751C33.0391 31.4702 32.4837 32.0256 31.8886 32.6207Z" fill="black"/>
                              <path d="M9.27469 6.11884C10.1872 6.11884 10.7558 6.33043 11.2055 6.76684C11.6419 7.17679 12.0783 7.6132 12.4882 8.04961C12.8056 8.367 12.8056 8.69761 12.4882 9.015C11.6683 9.84814 10.8484 10.6681 10.0285 11.488C9.7111 11.8054 9.39371 11.8054 9.08955 11.5144C8.60024 11.0516 8.11093 10.6019 7.70097 10.1126C7.05297 9.33239 6.92073 8.44635 7.34391 7.52063C7.75387 6.58169 8.53412 6.14528 9.27469 6.11884ZM11.2055 8.49924C10.9145 8.20831 10.65 7.91737 10.3326 7.65288C9.84334 7.21647 9.10277 7.21647 8.66636 7.67933C8.2035 8.14218 8.17705 8.86953 8.61346 9.34561C8.87795 9.663 9.19534 9.95394 9.45983 10.2184C10.0814 9.63655 10.6368 9.08112 11.2055 8.49924Z" fill="black"/>
                              <path d="M22.1684 20.5864C22.1684 23.3371 22.1684 26.0746 22.1684 28.8253C22.1684 29.4997 21.97 29.6981 21.2691 29.6716C16.8257 29.6055 12.9774 26.0481 12.4881 21.5915C11.9855 16.8571 15.0536 12.6253 19.7219 11.6599C20.2509 11.5409 20.8327 11.5144 21.3617 11.488C21.9171 11.4615 22.142 11.6863 22.142 12.2682C22.1684 15.0189 22.1684 17.8093 22.1684 20.5864ZM20.9253 12.7046C16.786 12.9162 13.4799 16.6191 13.6651 20.9038C13.8634 25.5721 17.7779 28.2963 20.9253 28.3757C20.9253 23.1652 20.9253 17.9547 20.9253 12.7046Z" fill="black"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_2492_1314">
                                <rect width="40" height="40" fill="white"/>
                              </clipPath>
                            </defs>
                          </svg>
                        ), 
                        label: "Skin Brightening" 
                      },
                      { 
                        icon: (
                          <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M39.9334 20.7733C39.7467 21.08 39.4667 21.1733 39.1201 21.1733C34.1734 21.16 29.2401 21.16 24.2934 21.1733C23.0934 21.1733 22.0934 20.7467 21.3201 19.8267C21.0401 19.48 20.6934 19.4 20.2801 19.48C19.7067 19.5867 19.1334 19.6933 18.5601 19.8C17.9867 19.9067 17.4667 19.7733 17.0267 19.4133C16.6667 19.1067 16.2934 19.0267 15.8401 19.2133C15.4134 19.3867 14.9601 19.5067 14.5067 19.6533C13.8401 19.8667 13.2134 19.7867 12.6667 19.36C12.3201 19.1067 11.9867 19.04 11.5734 19.2C11.1067 19.3733 10.6401 19.5067 10.1734 19.6667C9.52008 19.88 8.90675 19.7733 8.37341 19.3733C8.02675 19.12 7.69341 19.0533 7.28008 19.2133C6.82675 19.3867 6.37341 19.5067 5.92008 19.6667C5.24008 19.8933 4.61341 19.7867 4.04008 19.36C3.72008 19.12 3.40008 19.0667 3.02674 19.2C2.37341 19.4267 1.69341 19.6267 1.04008 19.8667C0.626745 20.0133 0.306745 19.9333 0.0800781 19.56C0.0800781 19.4267 0.0800781 19.3067 0.0800781 19.1733C0.280078 19.0267 0.466745 18.84 0.693411 18.7467C1.36008 18.4933 2.04008 18.2933 2.72008 18.0667C3.42674 17.8267 4.08008 17.92 4.66675 18.36C4.97341 18.6 5.29341 18.64 5.65341 18.52C6.13341 18.3467 6.61341 18.2 7.09341 18.04C7.76008 17.8267 8.37341 17.92 8.93341 18.3333C9.26675 18.5867 9.60008 18.64 9.98675 18.4933C10.4534 18.32 10.9201 18.1867 11.3867 18.0267C12.0534 17.8133 12.6667 17.9067 13.2267 18.32C13.5601 18.5733 13.8934 18.6267 14.2801 18.48C14.7467 18.3067 15.2134 18.1733 15.6801 18.0133C16.4001 17.7733 17.0401 17.92 17.6534 18.3733C17.8667 18.5333 18.2001 18.6133 18.4667 18.5867C19.0001 18.5467 19.5334 18.4133 20.0801 18.3067C20.8934 18.1467 21.6001 18.3467 22.1467 18.9867C22.7467 19.6933 23.4934 19.9867 24.4134 19.9867C29.3201 19.9733 34.2267 19.9867 39.1334 19.9733C39.4934 19.9733 39.7601 20.0533 39.9467 20.3733C39.9334 20.52 39.9334 20.64 39.9334 20.7733Z" fill="black"/>
                            <path d="M39.9333 24.6667C39.7466 24.9733 39.4666 25.0667 39.1199 25.0667C29.4399 25.0533 19.7599 25.0667 10.0933 25.0667C9.97327 25.0667 9.85327 25.08 9.7466 25.0533C9.45327 24.9867 9.2666 24.8 9.2666 24.48C9.2666 24.16 9.45327 23.9733 9.7466 23.9067C9.8666 23.88 9.99993 23.8933 10.1333 23.8933C19.7866 23.8933 29.4399 23.8933 39.0933 23.8933C39.4533 23.8933 39.7599 23.96 39.9466 24.2933C39.9333 24.4133 39.9333 24.5333 39.9333 24.6667Z" fill="black"/>
                            <path d="M0.0667057 28.9467C0.253372 28.64 0.520039 28.5467 0.880039 28.56C1.94671 28.6 2.96004 28.8133 3.90671 29.3067C4.92004 29.8267 5.98671 30.1467 7.14671 30.12C8.06671 30.0933 8.94671 29.9467 9.77337 29.52C10.8267 28.9867 11.92 28.6133 13.1067 28.56C14.4667 28.5067 15.76 28.7333 16.9734 29.3733C18.5067 30.1733 20.1067 30.3067 21.76 29.8667C22.04 29.8 22.2934 29.6667 22.56 29.56C22.9334 29.4133 23.2534 29.52 23.3867 29.8133C23.5334 30.1333 23.4 30.4667 23.0134 30.6267C21.0134 31.48 19.0134 31.5067 17.0134 30.6533C16.1467 30.2933 15.3067 29.8267 14.3467 29.7467C13.12 29.64 11.9334 29.7333 10.8267 30.3067C9.56004 30.96 8.22671 31.32 6.78671 31.2667C5.81337 31.2267 4.88004 31.0533 4.00004 30.6133C2.93337 30.08 1.84004 29.68 0.626706 29.68C0.426706 29.68 0.240039 29.44 0.0400391 29.3067C0.0667057 29.2133 0.0667057 29.08 0.0667057 28.9467Z" fill="black"/>
                            <path d="M39.9334 34.0133C39.7467 34.32 39.4667 34.4133 39.1067 34.4133C31.8267 34.4 24.5467 34.4133 17.2667 34.4133C17.1601 34.4133 17.0534 34.4267 16.9601 34.4C16.6401 34.3333 16.4534 34.1333 16.4667 33.8C16.4801 33.48 16.6667 33.3067 16.9601 33.24C17.0801 33.2133 17.1867 33.2267 17.3067 33.2267C24.5601 33.2267 31.8134 33.2267 39.0667 33.2267C39.4267 33.2267 39.7334 33.2933 39.9201 33.6267C39.9334 33.7467 39.9334 33.88 39.9334 34.0133Z" fill="black"/>
                            <path d="M39.9333 29.3467C39.7466 29.6267 39.4933 29.7467 39.1466 29.7467C38.1333 29.7333 37.2133 30.04 36.32 30.48C34.0266 31.6 31.72 31.6 29.44 30.4533C28.2133 29.84 26.9466 29.6267 25.6 29.7867C25.2 29.84 24.9066 29.6133 24.8666 29.2667C24.8266 28.92 25.0666 28.68 25.4933 28.6267C26.9733 28.4533 28.4 28.6133 29.7333 29.3067C31.0666 30 32.4666 30.3067 33.9466 30.0267C34.5866 29.9067 35.2266 29.68 35.8133 29.4133C36.88 28.92 37.96 28.5867 39.1333 28.56C39.4933 28.5467 39.76 28.6533 39.9466 28.9467C39.9333 29.08 39.9333 29.2133 39.9333 29.3467Z" fill="black"/>
                            <path d="M0.0666504 33.6267C0.253317 33.32 0.533317 33.2267 0.879984 33.2267C5.27998 33.24 9.66665 33.2267 14.0667 33.2267C14.1733 33.2267 14.28 33.2133 14.3733 33.24C14.68 33.2933 14.8667 33.48 14.8667 33.8C14.88 34.1333 14.6933 34.3333 14.3733 34.4C14.2667 34.4133 14.16 34.4133 14.0667 34.4133C9.66665 34.4133 5.27998 34.4133 0.879984 34.4133C0.519984 34.32 0.253317 34.32 0.0666504 34.0133C0.0666504 33.88 0.0666504 33.7467 0.0666504 33.6267Z" fill="black"/>
                            <path d="M0.0666504 24.28C0.239984 24.04 0.439984 23.88 0.773317 23.88C2.83998 23.8933 4.91998 23.88 6.98665 23.88C7.42665 23.88 7.70665 24.12 7.69332 24.48C7.67998 24.8267 7.41332 25.04 6.98665 25.04C5.63998 25.04 4.29332 25.04 2.94665 25.04C2.26665 25.04 1.57332 25.0267 0.893317 25.04C0.533317 25.0533 0.26665 24.9467 0.0799837 24.64C0.0666504 24.5333 0.0666504 24.4133 0.0666504 24.28Z" fill="black"/>
                            <path d="M0.0666504 26.6133C0.119984 26.56 0.159984 26.4933 0.213317 26.44C0.46665 26.1733 0.82665 26.16 1.06665 26.4133C1.29332 26.64 1.29332 26.9867 1.06665 27.2133C0.82665 27.4667 0.46665 27.4533 0.213317 27.1867C0.159984 27.1333 0.119984 27.0667 0.0666504 27.0133C0.0666504 26.88 0.0666504 26.7467 0.0666504 26.6133Z" fill="black"/>
                            <path d="M39.9334 27C39.8801 27.0534 39.8401 27.12 39.7868 27.1734C39.5334 27.44 39.1734 27.4534 38.9334 27.2C38.7068 26.9734 38.7068 26.6267 38.9334 26.4C39.1734 26.1467 39.5334 26.16 39.7868 26.4267C39.8401 26.48 39.8801 26.5467 39.9334 26.6C39.9334 26.7467 39.9334 26.88 39.9334 27Z" fill="black"/>
                            <path d="M25.0533 16.48C24.9733 16.7467 24.9067 16.9867 24.8267 17.2267C24.7067 17.5734 24.4133 17.7334 24.0933 17.64C23.7867 17.5467 23.6133 17.2534 23.7067 16.8934C23.92 16.12 24.1333 15.3467 24.36 14.5734C24.4667 14.2 24.7333 14.0534 25.1067 14.1467C25.8933 14.36 26.68 14.5734 27.4533 14.8134C27.8133 14.92 27.9467 15.2267 27.8533 15.5467C27.76 15.84 27.4933 16 27.1467 15.92C26.7733 15.84 26.4 15.72 25.9333 15.5867C26.4 16.2934 26.96 16.6667 27.6933 16.7867C27.96 16.8267 28.24 16.8267 28.5067 16.8267C31.6533 16.8267 34.8133 16.8267 37.96 16.8267C38.0933 16.8267 38.2267 16.8267 38.3467 16.84C38.68 16.8667 38.88 17.0667 38.8933 17.3867C38.9067 17.72 38.72 17.92 38.4 17.9734C38.2533 18 38.0933 18 37.9333 18C34.8 18 31.6533 17.9867 28.52 18.0134C27.16 18.0267 26.0267 17.6267 25.16 16.5467C25.1467 16.5334 25.1067 16.52 25.0533 16.48Z" fill="black"/>
                            <path d="M6.26666 9.09335C5.30666 9.08001 4.53333 8.26668 4.56 7.29335C4.58666 6.32001 5.38666 5.56001 6.36 5.58668C7.30666 5.61335 8.06666 6.40001 8.05333 7.36001C8.02666 8.34668 7.24 9.10668 6.26666 9.09335ZM6.29333 7.92001C6.6 7.92001 6.86666 7.68001 6.88 7.36001C6.89333 7.02668 6.64 6.76001 6.32 6.74668C6.01333 6.74668 5.74666 6.98668 5.73333 7.30668C5.70666 7.64001 5.96 7.92001 6.29333 7.92001Z" fill="black"/>
                            <path d="M14.8934 9.92C14.8801 10.8933 14.0934 11.6667 13.1201 11.6533C12.1601 11.64 11.3734 10.84 11.4001 9.86667C11.4134 8.90667 12.2001 8.14667 13.1467 8.14667C14.1201 8.16 14.9067 8.96 14.8934 9.92ZM13.1467 9.33333C12.8401 9.33333 12.5867 9.58667 12.5734 9.89333C12.5601 10.2267 12.8267 10.4933 13.1467 10.4933C13.4667 10.4933 13.7334 10.2267 13.7201 9.89333C13.7067 9.58667 13.4534 9.33333 13.1467 9.33333Z" fill="black"/>
                            <path d="M6.88012 16.2933C5.90678 16.2933 5.12012 15.52 5.12012 14.5467C5.12012 13.5733 5.90678 12.8 6.88012 12.8C7.84012 12.8133 8.61345 13.5733 8.61345 14.5333C8.64012 15.4933 7.85345 16.2933 6.88012 16.2933ZM6.88012 13.9733C6.57345 13.9733 6.30678 14.2267 6.30678 14.5333C6.29345 14.8533 6.56012 15.12 6.89345 15.12C7.20012 15.12 7.46678 14.8667 7.46678 14.56C7.46678 14.24 7.20012 13.9733 6.88012 13.9733Z" fill="black"/>
                            <path d="M20.1601 15.3067C20.1467 16.28 19.3467 17.0534 18.3867 17.0267C17.4401 17.0134 16.6667 16.2134 16.6667 15.2667C16.6667 14.3067 17.4667 13.52 18.4401 13.52C19.4001 13.5467 20.1734 14.3334 20.1601 15.3067ZM19.0001 15.2934C19.0134 14.96 18.7467 14.6934 18.4267 14.6934C18.1201 14.6934 17.8534 14.96 17.8534 15.2667C17.8401 15.5867 18.1201 15.8667 18.4401 15.8667C18.7334 15.8667 18.9867 15.6134 19.0001 15.2934Z" fill="black"/>
                            <path d="M17.3067 12.52C17 12.5333 16.7333 12.28 16.72 11.9733C16.7067 11.64 16.9467 11.36 17.28 11.36C17.6 11.3467 17.88 11.6267 17.88 11.9467C17.88 12.24 17.6133 12.5067 17.3067 12.52Z" fill="black"/>
                            <path d="M10.7601 5.79999C11.0934 5.79999 11.3601 6.05332 11.3468 6.38665C11.3468 6.69332 11.0934 6.94665 10.7734 6.94665C10.4401 6.94665 10.1734 6.69332 10.1868 6.35999C10.2001 6.05332 10.4534 5.79999 10.7601 5.79999Z" fill="black"/>
                            <path d="M3.97343 12.6C3.66676 12.6134 3.40009 12.36 3.38676 12.0534C3.37343 11.72 3.61343 11.4534 3.94676 11.44C4.25343 11.4267 4.52009 11.68 4.53343 11.9867C4.54676 12.3067 4.29343 12.5867 3.97343 12.6Z" fill="black"/>
                            <path d="M11.3867 13.0267C11.3867 13.36 11.12 13.6267 10.8 13.6134C10.4933 13.6 10.24 13.3467 10.24 13.04C10.24 12.7067 10.5067 12.44 10.8267 12.4534C11.1333 12.4534 11.3867 12.7067 11.3867 13.0267Z" fill="black"/>
                            <path d="M12.4134 14.7467C12.7334 14.7334 12.9868 14.9734 13.0001 15.28C13.0134 15.6134 12.7734 15.88 12.4401 15.8934C12.1201 15.9067 11.8401 15.64 11.8401 15.32C11.8401 15.0134 12.1068 14.76 12.4134 14.7467Z" fill="black"/>
                            <path d="M7.10677 27.7867C7.42677 27.7867 7.70677 28.0667 7.69344 28.3867C7.68011 28.6933 7.41344 28.9467 7.10677 28.9467C6.78677 28.9467 6.5201 28.6667 6.53344 28.3467C6.53344 28.04 6.8001 27.7867 7.10677 27.7867Z" fill="black"/>
                            <path d="M33.48 28.3467C33.4934 28.68 33.2267 28.9467 32.9067 28.9467C32.6 28.9467 32.3334 28.6933 32.32 28.3867C32.3067 28.0667 32.5867 27.7867 32.9067 27.7867C33.2134 27.7867 33.4667 28.04 33.48 28.3467Z" fill="black"/>
                            <path d="M14.1334 26.8134C14.1334 27.1334 13.8534 27.4 13.5334 27.4C13.2267 27.3867 12.9734 27.1334 12.9734 26.8134C12.9734 26.4934 13.2134 26.24 13.5334 26.24C13.8534 26.2134 14.1334 26.4934 14.1334 26.8134Z" fill="black"/>
                            <path d="M26.4533 27.3866C26.1333 27.3866 25.8533 27.1066 25.8667 26.7866C25.88 26.48 26.1333 26.2267 26.44 26.2133C26.76 26.2133 27.0267 26.48 27.0267 26.8C27.0133 27.1333 26.76 27.3866 26.4533 27.3866Z" fill="black"/>
                            <path d="M20.5734 28.36C20.5734 28.6933 20.3068 28.96 19.9868 28.9467C19.6801 28.9467 19.4268 28.68 19.4268 28.3733C19.4268 28.04 19.6801 27.7733 20.0134 27.7867C20.3201 27.7867 20.5734 28.04 20.5734 28.36Z" fill="black"/>
                          </svg>
                        ), 
                        label: "Deep Cleanse" 
                      },
                      { 
                        icon: (
                          <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.83712 9.01793C8.33576 9.15172 8.84657 9.26117 9.32088 9.43144C9.51548 9.49225 9.64926 9.49225 9.81953 9.34631C11.5465 7.69227 13.5533 6.51256 15.8641 5.85581C16.2532 5.74635 16.1681 5.46662 16.2167 5.22338C16.5208 3.5207 17.8343 2.28017 19.5856 2.03693C21.1789 1.81802 22.845 2.75449 23.4896 4.26258C23.6599 4.63961 23.7572 5.05312 23.818 5.46662C23.8667 5.68554 23.9275 5.77067 24.1464 5.84365C26.445 6.52472 28.4761 7.68011 30.1909 9.33415C30.349 9.49225 30.4706 9.50441 30.6774 9.41928C32.5382 8.65307 34.5814 9.33415 35.5422 11.0125C36.503 12.6909 36.0895 14.7949 34.5206 16.0111C34.326 16.1692 34.3017 16.2787 34.3503 16.5097C34.9219 18.8448 34.9219 21.18 34.3503 23.5029C34.2895 23.7705 34.3503 23.8799 34.5449 24.0259C35.8949 25.0475 36.4057 26.8475 35.8098 28.4164C35.226 30.0096 33.6449 31.0312 31.9422 30.9096C31.5044 30.8609 31.0666 30.6907 30.6287 30.6055C30.495 30.5812 30.3004 30.6055 30.2152 30.6663C28.4517 32.3204 26.4207 33.5001 24.0734 34.1812C23.8058 34.242 23.8302 34.4001 23.7937 34.5947C23.4896 36.6014 21.9207 37.9757 19.9991 38C18.1262 38 16.4843 36.65 16.2046 34.7893C16.1438 34.3757 15.9613 34.2055 15.5722 34.096C13.4073 33.4393 11.51 32.3325 9.86818 30.7758C9.64926 30.5812 9.49115 30.5082 9.21143 30.642C7.42361 31.3839 5.39255 30.6907 4.43175 29.0001C3.49528 27.3461 3.88446 25.2177 5.41688 24.0624C5.66012 23.8678 5.6966 23.7097 5.63579 23.4299C5.06418 21.1313 5.0885 18.8205 5.66012 16.5097C5.72093 16.2422 5.66012 16.1327 5.46552 15.9868C4.1277 14.9773 3.60474 13.2746 4.1277 11.7301C4.69932 10.1368 6.15876 9.09091 7.83712 9.01793ZM29.4004 29.7055C28.3301 28.3555 28.0261 26.8839 28.8166 25.3637C29.7166 23.6367 31.2247 23.0286 33.122 23.284C33.6692 21.0827 33.6692 18.8935 33.122 16.7165C31.3585 16.9841 29.9112 16.4489 28.999 14.9652C28.0139 13.3476 28.2571 11.7787 29.4369 10.3193C27.795 8.77469 25.922 7.65579 23.7572 7.05985C22.8815 8.82334 21.7748 9.67468 20.2667 9.72333C18.3694 9.77198 17.1046 8.81118 16.3627 7.05985C14.1735 7.66795 12.3006 8.78686 10.683 10.3314C11.8019 11.6814 12.0817 13.1652 11.2546 14.7219C10.3547 16.4003 8.87089 16.9962 6.97362 16.7287C6.42632 18.93 6.402 21.1191 6.97362 23.2961C8.76143 23.0529 10.2087 23.5637 11.1452 25.1083C12.0817 26.7015 11.8263 28.2582 10.683 29.7177C12.3249 31.2623 14.1735 32.3569 16.3627 32.9771C17.0194 31.3596 18.1262 30.3988 19.8532 30.3136C21.7505 30.2285 23.0153 31.2258 23.7572 32.9771C25.8977 32.369 27.7585 31.2744 29.4004 29.7055ZM10.4033 12.9341C10.4033 11.5111 9.24791 10.3558 7.82496 10.3801C6.402 10.3801 5.27093 11.5598 5.27093 12.9828C5.27093 14.3814 6.42632 15.5125 7.82496 15.5368C9.23575 15.5003 10.4033 14.3449 10.4033 12.9341ZM29.6558 12.9341C29.6558 14.3571 30.7868 15.5125 32.2098 15.5125C33.6328 15.5125 34.7882 14.3571 34.7882 12.9341C34.7882 11.5355 33.6571 10.3801 32.2585 10.3558C30.8355 10.3558 29.6801 11.5111 29.6558 12.9341ZM10.4033 27.0542C10.4033 25.6313 9.22359 24.5002 7.80063 24.5002C6.402 24.5245 5.27093 25.6556 5.27093 27.0785C5.27093 28.5015 6.42632 29.6569 7.84928 29.6569C9.23575 29.6326 10.4033 28.4772 10.4033 27.0542ZM22.6018 5.85581C22.6018 4.43285 21.4221 3.30178 19.9991 3.30178C18.6005 3.30178 17.4694 4.45718 17.4694 5.85581C17.4694 7.27876 18.6248 8.43416 20.0478 8.43416C21.4464 8.43416 22.6018 7.27876 22.6018 5.85581ZM34.8125 27.1029C34.8125 25.6799 33.6814 24.5245 32.2585 24.5002C30.8355 24.5002 29.6801 25.6556 29.6801 27.0542C29.6801 28.4528 30.8112 29.6082 32.2098 29.6326C33.6328 29.6569 34.7882 28.5258 34.8125 27.1029ZM17.4573 34.096C17.433 35.519 18.5762 36.6987 19.9627 36.7109C21.3613 36.7352 22.541 35.6163 22.5775 34.2176C22.6261 32.7947 21.4829 31.6028 20.0721 31.5785C18.6735 31.5542 17.4938 32.6731 17.4573 34.096Z" fill="black"/>
                            <path d="M20.0478 14.2233C23.2343 14.2233 25.8126 16.8381 25.8126 20.0489C25.7883 23.211 23.1978 25.7893 19.9992 25.7893C16.8006 25.7893 14.2344 23.1745 14.2344 19.9637C14.2587 16.7895 16.8614 14.2233 20.0478 14.2233ZM20.0235 24.5002C22.4924 24.5002 24.5234 22.4934 24.5234 20.0245C24.5234 17.5557 22.5167 15.5246 20.0478 15.5246C17.5789 15.5246 15.5479 17.5313 15.5479 20.0002C15.5357 22.4691 17.5424 24.5002 20.0235 24.5002Z" fill="black"/>
                          </svg>
                        ), 
                        label: "Anti-Oxidant" 
                      },
                      { 
                        icon: (
                          <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.27333 12.9576C2.27333 12.5466 2.27333 12.196 2.27333 11.8091C2.43049 11.8091 2.57556 11.8091 2.70854 11.8091C7.14522 11.8091 11.594 11.8575 16.0307 11.785C17.8561 11.7608 19.4277 13.2598 18.6903 15.4721C18.5573 15.8711 18.3518 16.2579 18.1221 16.6206C17.0582 18.2768 16.3571 20.0539 16.1274 22.0002C16.0428 22.6772 15.9823 23.3663 16.0669 24.0312C16.2604 25.6148 17.6023 26.9084 19.2343 27.1985C20.5157 27.4282 21.6763 27.126 22.6917 26.316C23.8523 25.3851 24.1424 24.1521 24.0215 22.7256C23.8281 20.4891 23.139 18.446 21.906 16.5722C21.4466 15.8831 21.1685 15.1336 21.1806 14.2874C21.2048 12.9334 22.2928 11.8091 23.6468 11.8091C28.3132 11.797 32.9795 11.8091 37.6459 11.8091C37.6822 11.8091 37.7184 11.8212 37.7789 11.8212C37.7789 12.1839 37.7789 12.5466 37.7789 12.9455C37.6338 12.9455 37.5008 12.9455 37.3558 12.9455C32.8465 12.9455 28.3373 12.9455 23.816 12.9455C22.728 12.9455 22.0873 13.828 22.4016 14.7951C22.9335 14.5775 23.4534 14.2995 23.9974 14.1665C25.0854 13.9126 26.0525 14.239 26.8746 14.9765C27.1526 15.2182 27.3944 15.4963 27.6724 15.7502C28.567 16.5964 29.8485 16.5964 30.7431 15.7502C31.0332 15.4842 31.2991 15.182 31.5893 14.9281C32.7982 13.8643 34.6116 13.7555 35.8205 14.8072C36.6425 15.5205 37.3437 16.3909 38.1053 17.2009C37.9119 17.3822 37.6459 17.624 37.3558 17.8899C36.7634 17.2976 36.1469 16.681 35.5424 16.0645C34.4181 14.9402 33.185 14.9281 32.0728 16.0645C31.4321 16.7173 30.7551 17.3097 29.8122 17.4668C28.7604 17.6361 27.8296 17.3822 27.0196 16.681C26.7053 16.403 26.4273 16.0887 26.1129 15.8106C25.2546 15.0248 23.9369 15.0369 23.1269 15.8469C23.0544 15.9194 23.0061 16.1128 23.0544 16.1854C23.3083 16.6689 23.5863 17.1404 23.8523 17.624C25.4843 17.3943 26.524 17.9504 26.8625 19.2318C27.1889 20.477 26.5482 21.5166 25.0975 22.0848C25.4239 23.9828 25.1216 25.7357 23.5622 27.0776C22.4862 28.0085 21.229 28.4437 19.8025 28.3953C17.1791 28.3107 14.0964 25.8929 14.9547 22.0607C14.2052 21.8431 13.6129 21.4078 13.3106 20.6583C13.093 20.1264 13.0809 19.5945 13.2744 19.0505C13.6854 17.8657 14.7976 17.3338 16.2241 17.6361C16.5021 17.1404 16.7923 16.6568 17.0582 16.1491C17.0945 16.0766 17.022 15.9073 16.9494 15.8348C16.1516 15.049 14.8459 15.0248 13.9997 15.7864C13.7458 16.0161 13.5041 16.27 13.2623 16.5118C11.872 17.8416 9.88944 17.8537 8.4992 16.5239C8.30577 16.3304 8.11235 16.137 7.91892 15.9436C6.93971 14.9765 5.64618 14.9765 4.67905 15.9315C4.09878 16.4997 3.53059 17.08 2.95032 17.6481C2.8657 17.7328 2.78107 17.8053 2.68436 17.902C2.4184 17.6361 2.16453 17.3822 1.8623 17.0679C2.17662 16.7656 2.50302 16.4634 2.81734 16.1612C3.22837 15.7623 3.61522 15.3391 4.03833 14.9523C5.31977 13.7796 7.20567 13.7676 8.4992 14.916C8.78933 15.1699 9.0432 15.4479 9.32125 15.7139C10.2279 16.5722 11.5094 16.5722 12.416 15.7139C12.6578 15.4842 12.8875 15.2424 13.1293 15.0127C14.3624 13.8522 16.0911 13.7434 17.4572 14.7347C17.5176 14.771 17.566 14.8193 17.6264 14.8556C17.9891 14.1181 17.5297 13.0059 16.4659 12.9213C16.3329 12.9092 16.1999 12.9213 16.0669 12.9213C11.6303 12.9213 7.18149 12.9213 2.74481 12.9213C2.57556 12.9576 2.44258 12.9576 2.27333 12.9576ZM15.7164 18.7483C15.0756 18.579 14.4954 18.9175 14.3261 19.5461C14.169 20.1385 14.5075 20.7188 15.0998 20.888C15.3053 20.1869 15.5108 19.4857 15.7164 18.7483ZM24.9282 20.888C25.5931 20.6704 25.9195 19.9934 25.6536 19.389C25.4118 18.8329 24.7711 18.5306 24.3117 18.7845C24.5293 19.4857 24.7227 20.1869 24.9282 20.888Z" fill="black"/>
                            <path d="M20.02 25.5665C18.4363 25.5665 17.2516 24.1037 17.6989 22.5442C18.1462 20.9726 18.7386 19.4494 19.2705 17.9141C19.3672 17.6481 19.4518 17.3701 19.5969 17.1404C19.6815 17.0074 19.8749 16.8745 20.02 16.8745C20.1651 16.8745 20.3948 17.0074 20.4431 17.1404C21.1926 18.9779 21.9784 20.8034 22.3895 22.7618C22.6796 24.2125 21.519 25.5665 20.02 25.5665ZM20.0442 18.7241C19.9958 18.7603 19.9717 18.7603 19.9717 18.7724C19.5123 20.1264 19.0408 21.4683 18.6177 22.8344C18.4363 23.4146 18.7023 24.007 19.198 24.3334C19.6936 24.6719 20.3343 24.6719 20.8179 24.3455C21.3256 24.007 21.6037 23.4146 21.4223 22.8223C21.0476 21.6013 20.6365 20.3924 20.2255 19.1835C20.1772 19.0384 20.1046 18.8812 20.0442 18.7241Z" fill="black"/>
                            <path d="M8.5594 19.8363C8.5594 21.0935 7.51974 22.1332 6.26248 22.1211C5.0173 22.1211 3.98973 21.0935 3.97764 19.8484C3.96556 18.579 4.99313 17.5394 6.26248 17.5394C7.53183 17.5394 8.5594 18.5669 8.5594 19.8363ZM7.41094 19.8242C7.39885 19.1956 6.89111 18.6878 6.26248 18.6878C5.62176 18.6878 5.10193 19.2197 5.1261 19.8605C5.13819 20.4891 5.67011 20.9847 6.28665 20.9727C6.9032 20.9727 7.42303 20.4407 7.41094 19.8242Z" fill="black"/>
                            <path d="M33.7531 17.5394C35.0224 17.5273 36.0621 18.5548 36.0621 19.8242C36.0742 21.0935 35.0345 22.1211 33.7652 22.1211C32.5079 22.1211 31.4804 21.1056 31.4683 19.8605C31.4683 18.5911 32.4837 17.5514 33.7531 17.5394ZM33.7773 20.9726C34.3938 20.9726 34.9136 20.4407 34.9136 19.8242C34.9136 19.1956 34.4059 18.6878 33.7773 18.6878C33.1366 18.6878 32.6167 19.2076 32.6288 19.8484C32.6409 20.477 33.1486 20.9847 33.7773 20.9726Z" fill="black"/>
                            <path d="M10.8325 24.9258C9.88954 24.9258 9.12793 24.1521 9.12793 23.2212C9.12793 22.2783 9.91372 21.4925 10.8567 21.4925C11.7875 21.4925 12.5612 22.2783 12.5612 23.2091C12.5612 24.1642 11.7996 24.9258 10.8325 24.9258ZM11.4248 23.197C11.4128 22.8948 11.1468 22.6289 10.8446 22.641C10.5423 22.653 10.2764 22.9311 10.2885 23.2333C10.3006 23.5476 10.5544 23.7894 10.8688 23.7773C11.1831 23.7652 11.4248 23.5114 11.4248 23.197Z" fill="black"/>
                            <path d="M29.1715 24.9862C28.2165 24.9741 27.4548 24.1884 27.4669 23.2333C27.479 22.3025 28.2527 21.5408 29.1957 21.5529C30.1265 21.5529 30.9002 22.3387 30.9002 23.2696C30.9002 24.2125 30.1265 24.9862 29.1715 24.9862ZM29.1836 22.7014C28.8814 22.7014 28.6154 22.9553 28.6154 23.2575C28.6154 23.5597 28.8572 23.8257 29.1715 23.8378C29.4858 23.8499 29.7639 23.5839 29.7639 23.2575C29.7518 22.9553 29.4979 22.7014 29.1836 22.7014Z" fill="black"/>
                            <path d="M6.26272 28.9998C5.64618 28.9998 5.12635 28.4799 5.11426 27.8634C5.11426 27.2227 5.63409 26.7028 6.27481 26.7149C6.89135 26.727 7.41118 27.2468 7.39909 27.8634C7.39909 28.4799 6.89135 28.9998 6.26272 28.9998Z" fill="black"/>
                            <path d="M15.4382 26.7029C16.0548 26.7029 16.5746 27.2227 16.5746 27.8513C16.5746 28.4921 16.0427 29.0119 15.402 28.9998C14.7854 28.9877 14.2777 28.4558 14.2898 27.8393C14.3019 27.2106 14.8217 26.7029 15.4382 26.7029Z" fill="black"/>
                            <path d="M24.6019 26.7029C25.2185 26.7029 25.7383 27.2106 25.7504 27.8393C25.7504 28.48 25.2305 28.9998 24.5898 28.9998C23.9733 28.9877 23.4534 28.4679 23.4655 27.8513C23.4655 27.2227 23.9733 26.7029 24.6019 26.7029Z" fill="black"/>
                            <path d="M33.7533 28.9998C33.1368 28.9998 32.6169 28.4799 32.6169 27.8513C32.6169 27.2106 33.1489 26.6907 33.7896 26.7149C34.4061 26.727 34.9139 27.2589 34.9018 27.8755C34.9018 28.492 34.3819 28.9998 33.7533 28.9998Z" fill="black"/>
                          </svg>
                        ), 
                        label: "Exfoliating" 
                      }
                    ].map((feature, index) => (
                      <div key={index} className="text-center space-y-2">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl mx-auto">
                          {feature.icon}
                        </div>
                        <p className="text-xs text-brand-black font-medium">{feature.label}</p>
                      </div>
                    ))}
                  </div>
                  </div>
                  </div>
                </>
              )}

              {activeTab === 'Ingredients' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Left Column - Key Ingredients */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-brand-black">KEY INGREDIENTS</h3>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        { 
                          name: "Centella Asiatica", 
                          description: "Gotu Kola, also known as Tiger Grass or CICA, is rich in amino acids, fatty acids, and phytochemicals, including Vitamins C, A, B1, and B2. It's renowned for its healing properties, antioxidants, and antimicrobial benefits, providing anti-inflammatory effects.",
                          icon: "🌿"
                        },
                        { 
                          name: "Licorice", 
                          description: "Glycyrrhiza Glabra Root Extract is a potent antioxidant and UV-fighter that inhibits melanin formation. It's a safe and effective skin-lightening agent, even outperforming hydroquinone.",
                          icon: "🪵"
                        },
                        { 
                          name: "Glycerine", 
                          description: "This skincare superstar is a real moisture magnet. As a humectant, it pulls moisture from the air and keeps it in the skin.",
                          icon: "💧"
                        },
                        { 
                          name: "Coconut Surfactants", 
                          description: "This coconut-based surfactant blend provides a gentle, deep clean without disrupting the skin barrier, and is nearly 80% naturally derived and biodegradable.",
                          icon: "🥥"
                        }
                    ].map((ingredient, index) => (
                        <div key={index} className="bg-brand-secondary rounded-lg p-6 shadow-sm border border-gray-100">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                              {ingredient.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-brand-black text-sm mb-2">{ingredient.name}</h4>
                              <p className="text-gray-600 text-xs leading-relaxed">{ingredient.description}</p>
                            </div>
                          </div>
                      </div>
                    ))}
                    </div>
                  </div>

                  {/* Right Column - Full Ingredient List */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-brand-black">FULL INGREDIENT LIST AND FORMULA</h3>
                    
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <div className="grid grid-cols-5 gap-4 text-xs font-semibold text-gray-700">
                          <div className='col-span-3'>INGREDIENTS</div>
                          <div className='col-span-1'>EWG SAFETY RATING</div>
                          <div className='col-span-1'>CONCENTRATION</div>
                        </div>
                      </div>
                      
                      <div className="divide-y divide-gray-200">
                        {[
                          { ingredient: "Aqua", rating: "1", concentration: "35% - 55%" },
                          { ingredient: "Aqua (and) Sodium Lauroyl Methyl Isethionate (and) Cocamidopropyl Betaine (and) Sodium Methyl Oleoyl Taurate (and) Lauryl Glucoside (and) Coco-Glucoside", rating: "1, 1, 1-5, 1, 1, 1", concentration: "20% - 40%" },
                          { ingredient: "Cocamidopropyl Betaine", rating: "1-5", concentration: "5% - 15%" },
                          { ingredient: "Extracts - Centella asiatica, Glycyrrhiza glabra, Curcuma longa", rating: "1, 4, 1", concentration: "5% - 15%" },
                          { ingredient: "Glycerin", rating: "1-2", concentration: "2% - 8%" },
                          { ingredient: "Aqua, Sodium hydroxide", rating: "1, 1-4", concentration: "2% - 8%" },
                          { ingredient: "Glycolic acid", rating: "1-4", concentration: "2.5% - 3%" },
                          { ingredient: "Caprylyl/Capryl Glucoside", rating: "1", concentration: "1% - 2%" },
                          { ingredient: "Caprylyl Glycol (and) Phenoxyethanol", rating: "1, 2-4", concentration: "0.5% - 1%" },
                          { ingredient: "Fragrance", rating: "na", concentration: "0.5% - 1%" }
                        ].map((item, index) => (
                          <div key={index} className="px-6 py-3">
                            <div className="grid grid-cols-5 gap-4 text-xs">
                              <div className="text-gray-800 font-pp-mori col-span-3">{item.ingredient}</div>
                              <div className="text-gray-600 font-pp-mori col-span-1 text-end">{item.rating}</div>
                              <div className="text-gray-600 font-pp-mori col-span-1 text-end">{item.concentration}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Usage' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  {/* Left Side - Visual */}
                  <div className="relative">
                    <div className="flex items-center justify-center">
                      {/* Placeholder for the product application image */}
                     <Image 
                     src="/home-2.jpg" 
                     alt="Usage" 
                     width={400} 
                     height={400} 
                     />
                    </div>
                  </div>

                  {/* Right Side - Usage Instructions */}
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-xs font-pp-mori font-normal text-brand-black uppercase tracking-wider">WHEN TO APPLY</h4>
                      <p className="text-sm font-pp-mori font-medium text-brand-black">AM & PM.</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-pp-mori font-normal text-brand-black uppercase tracking-wider">HOW TO USE</h4>
                      <p className="text-sm text-brand-black leading-relaxed">
                        Apply a small amount to wet skin. Work into a lather & massage into skin for 60 Seconds. Rinse thoroughly & pat dry.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-pp-mori font-normal text-brand-black uppercase tracking-wider">GOOD TO KNOW</h4>
                      <p className="text-sm text-brand-black leading-relaxed">
                        Increases your skin&apos;s sensitivity to the sun. Follow up with SPF. Not recommended for sensitive skin. Patch test advised.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-pp-mori font-normal text-brand-black uppercase tracking-wider">DOSE</h4>
                      <p className="text-sm font-pp-mori font-ultrabold text-brand-black">Daily.</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-pp-mori font-normal text-brand-black uppercase tracking-wider">PRECAUTIONS</h4>
                      <p className="text-sm text-brand-black leading-relaxed">
                        External use only.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'FAQ' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Left Column - FAQ (2/3 width) */}
                  <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xs font-pp-mori font-normal text-brand-black uppercase tracking-wider">FREQUENTLY ASKED QUESTIONS</h3>
                    
                    <div className="space-y-0">
                      {[
                        {
                          question: "How many times should I use this?",
                          answer: "Start with 2-3 times per week and gradually increase to daily use as your skin builds tolerance. Listen to your skin and adjust frequency accordingly."
                        },
                        {
                          question: "I already use an exfoliating scrub, should I continue with that after I use this cleanser?",
                          answer: "No, you should discontinue using physical exfoliants while using this product. This cleanser provides chemical exfoliation, and using both can cause irritation and over-exfoliation."
                        },
                        {
                          question: "Will this make me break out?",
                          answer: "Some users may experience purging (temporary breakouts) as the product accelerates cell turnover. This is normal and typically subsides within 2-4 weeks. If breakouts persist, reduce frequency or discontinue use."
                        },
                        {
                          question: "How long until I see results on my face?",
                          answer: "Most users notice improved skin texture and clarity within 2-4 weeks of consistent use. For significant improvements in tone and texture, allow 6-8 weeks of regular application."
                        },
                        {
                          question: "Can we use it on Acne Prone Skin?",
                          answer: "Yes, this product can be beneficial for acne-prone skin as it helps unclog pores and promote cell turnover. However, start slowly and monitor your skin's response. If irritation occurs, reduce frequency."
                        },
                        {
                          question: "Is this good for Dry Skin?",
                          answer: "This product can be used on dry skin, but it's essential to follow with a good moisturizer. Start with lower frequency (1-2 times per week) and increase gradually as your skin adjusts."
                        },
                        {
                          question: "Can I use this cleanser on my body?",
                          answer: "While this product is formulated for facial use, some users do use it on body areas with similar skin concerns. Always patch test first and avoid sensitive areas."
                        },
                        {
                          question: "At what age can I start using this?",
                          answer: "This product is generally safe for adults 18 and older. For younger users, consult with a dermatologist first. Always start with patch testing regardless of age."
                      }
                    ].map((faq, index) => (
                        <div key={index} className="border-b border-gray-200 last:border-b-0">
                          <button 
                            className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              const currentFaq = document.getElementById(`faq-${index}`);
                              const isOpen = !currentFaq?.classList.contains('max-h-0');
                              
                              // Close all other FAQs with smooth animation
                              document.querySelectorAll('[id^="faq-"]').forEach(el => {
                                if (el !== currentFaq) {
                                  el.classList.add('max-h-0', 'opacity-0');
                                  el.classList.remove('pb-4');
                                }
                              });
                              
                              // Toggle current FAQ with smooth animation
                              if (isOpen) {
                                // Close current FAQ
                                currentFaq?.classList.add('max-h-0', 'opacity-0');
                                currentFaq?.classList.remove('pb-4');
                              } else {
                                // Open current FAQ
                                currentFaq?.classList.remove('max-h-0', 'opacity-0');
                                currentFaq?.classList.add('pb-4');
                              }
                            }}
                          >
                            <span className="text-sm font-pp-mori font-normal text-brand-black pr-4">{faq.question}</span>
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                          <div 
                            id={`faq-${index}`} 
                            className="px-4 overflow-hidden transition-all duration-300 ease-in-out max-h-0 opacity-0"
                          >
                            <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                      </div>
                    ))}
                    </div>
                  </div>

                  {/* Right Column - Visual (1/3 width) */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center justify-center">
                      {/* Placeholder for the product application photo */}
                     <Image 
                     src="/home-2.jpg"  
                     alt="Usage" 
                     width={400} 
                     height={400} 
                     />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* SECTION 4: Related Products */}
      <motion.div 
        className="w-full bg-gray-50 py-[5rem] px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 3.6 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-brand-black mb-4">
              <span className="font-pp-editorial italic font-normal">Related Products</span>
            </h2>
          </div>

          {/* Related Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingRelated ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : relatedProducts.length > 0 ? (
                             relatedProducts.map((product, index) => (
                 <Link href={`/products/${product.slug}`} key={product.id}>
                   <motion.div
                     className="bg-brand-secondary shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group"
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, ease: "easeOut", delay: 3.8 + (index * 0.1) }}
                     whileHover={{ y: -5 }}
                   >
                    {/* Product Image */}
                    <div className="relative overflow-hidden">
                      <Image
                        src={product.product_images?.[0]?.image_url || '/home-2.jpg'}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-brand-black text-white text-xs px-2 py-1 rounded-full font-medium">
                          {product.category?.name || 'Product'}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold font-pp-mori text-brand-black text-lg mb-2 line-clamp-2 group-hover:text-brand-black transition-colors">
                        {product.name}
                      </h3>
                      
                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold font-pp-mori text-brand-black">
                          ₦{product.price.toFixed(2)}
                        </span>
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="text-sm font-pp-mori text-gray-500 line-through">
                            ₦{product.compare_price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Short Description */}
                      <div className="text-xs text-gray-600 mb-4 line-clamp-2">
                        {product.short_description || 'Product description coming soon...'}
                      </div>

                      {/* Add to Cart Button */}
                      <button 
                        className="w-full mt-4 bg-brand-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium text-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product, 1);
                          openCart();
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              // No related products found
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No related products found at the moment.</p>
              </div>
            )}
          </div>

          {/* View All Products Button */}
          {/* <div className="text-center mt-12">
            <Link href="/products">
              <button className="inline-flex items-center gap-2 bg-white border-2 border-brand-black text-brand-black px-8 py-3 rounded-lg hover:bg-brand-black hover:text-white transition-all duration-200 font-semibold">
                View All Products
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Link>
          </div> */}
        </div>
      </motion.div>
    </>
  );
}
