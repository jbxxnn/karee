'use client';

import { useState, useEffect } from 'react';
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
  // const [relatedProduct, setRelatedProduct] = useState<ProductWithImages | null>(null);
  // const [isWishlisted, setIsWishlisted] = useState(false);
  
  const addToCart = useCartStore(state => state.addItem);
  const openCart = useCartStore(state => state.openCart);

  // Fetch a random related product from the same category
  useEffect(() => {
    // const fetchRelatedProduct = async () => {
    //   if (product.category?.id) {
    //     const related = await productService.getRandomRelatedProduct(
    //       product.category.id,
    //       product.id
    //     );
    //     setRelatedProduct(related);
    //   }
    // };

    // fetchRelatedProduct();
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
      openCart(); // Open cart drawer to show added item
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock_quantity) {
      setQuantity(newQuantity);
    }
  };

  // const toggleWishlist = () => {
  //   setIsWishlisted(!isWishlisted);
  // };

  return (
    <motion.div 
      className="flex flex-col lg:flex-row gap-0 mb-12 items-start pl-0 pt-0 bg-white"
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
        {/* <div className="lg:h-screen"></div> */}
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
  );
}
