'use client';

import { useState, useEffect } from 'react';
import { ProductWithImages, productService } from '@/lib/services/product-service';
import { ProductGallery } from './product-gallery';
import { ProductVariants } from './product-variants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart-store';
import Image from 'next/image';

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
  const [relatedProduct, setRelatedProduct] = useState<ProductWithImages | null>(null);
  // const [isWishlisted, setIsWishlisted] = useState(false);
  
  const addToCart = useCartStore(state => state.addItem);
  const openCart = useCartStore(state => state.openCart);

  // Fetch a random related product from the same category
  useEffect(() => {
    const fetchRelatedProduct = async () => {
      if (product.category?.id) {
        const related = await productService.getRandomRelatedProduct(
          product.category.id,
          product.id
        );
        setRelatedProduct(related);
      }
    };

    fetchRelatedProduct();
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
    <div className="flex flex-col lg:flex-row gap-8 mb-12 bg-[#F6F6F3] items-start pl-10 pt-10">
      {/* Left Column - Product Images */}
      <div className="lg:flex-1">
        <ProductGallery images={product.product_images} />
      </div>

             {/* Right Column - Product Info */}
       <div className="lg:flex-1 lg:flex lg:justify-end">
         <div className="space-y-2 bg-brand-secondary p-10 w-[80%] lg:relative lg:top-20">
        {/* Category */}
        {product.category && (
          <Badge variant="secondary" className="text-sm bg-brand-secondary text-brand-black border border-brand-black rounded-sm mb-4">
            {product.category.name}
          </Badge>
        )}

        {/* Product Name */}
        <h1 className="text-5xl font-pp-mori font-bold text-brand-black dark:text-brand-black">
          {product.name}
        </h1>


          {/* Price */}
          <div className="space-y-2">
          <div className="flex items-center gap-3 mb-10">
            <span className="text-xl font-pp-mori font-bold text-brand-black dark:text-gray-100">
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
        </div>

        <div className="space-y-2">
        <p className="text-sm text-brand-black dark:text-brand-black font-pp-mori mb-10">
          {product.short_description}
        </p>
        </div>

        {/* Rating */}
        {/* <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={cn(
                  "text-gray-300 dark:text-gray-600",
                  i < 4 ? "text-yellow-400 fill-current" : ""
                )}
              />
            ))}
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            (4.0) • 128 reviews
          </span>
        </div>

       */}

        {/* Stock Status */}
       

        {/* Product Variants */}
        {product.product_variants && product.product_variants.length > 0 && (
          <ProductVariants
            variants={product.product_variants}
            selectedVariant={selectedVariant}
            onVariantSelect={setSelectedVariant}
          />
        )}

        {/* Quantity Selector */}
        <div className="flex flex-row items-center gap-2 !mb-10">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            QTY
          </label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="w-6 h-6 p-0 rounded-full"
            >
              -
            </Button>
            <span className="w-4 text-center font-medium">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock_quantity}
              className="w-6 h-6 p-0 rounded-full"
            >
              +
            </Button>
          </div>
          <div className="flex items-center gap-2">
          {product.stock_quantity > 0 ? (
            <span className="text-green-600 dark:text-green-400 text-xs font-pp-mori">
              In Stock ({product.stock_quantity} available)
            </span>
          ) : (
            <span className="text-red-600 dark:text-red-400 text-xs font-pp-mori">
              Out of Stock
            </span>
          )}
        </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock_quantity <= 0}
            size="lg"
            className="w-full bg-[#f6f6f3] text-brand-black rounded-full py-6 hover:bg-brand-cream shadow-sm"
          >
            {isAddingToCart ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding to Cart...
              </div>
            ) : (
                             <div className="flex items-center justify-between w-full">
                              <span></span>
                 <div className="flex items-center gap-2">
                   <p className="text-sm font-pp-mori font-bold text-brand-black">Add to Cart</p>
                 </div>
                 <span className="bg-brand-secondary rounded-full p-2">
                 <svg 
                 width="15" 
                 height="18" 
                 viewBox="0 0 15 18" 
                 fill="none" 
                 xmlns="http://www.w3.org/2000/svg">
                   <path data-v-aa957220="" 
                   d="M1.19891 5.8049C1.2448 5.02484 1.89076 4.41576 2.67216 4.41576H12.0298C12.8112 4.41576 13.4572 5.02485 13.5031 5.8049L14.0884 15.7547C14.1382 16.6023 13.4643 17.3171 12.6151 17.3171H2.08688C1.23775 17.3171 0.563767 16.6023 0.61363 15.7547L1.19891 5.8049Z" 
                   stroke="#000000" 
                   stroke-width="0.983866">
                     </path>
                     <path data-v-aa957220="" 
                     d="M11.4354 6.3737C11.4354 3.21604 9.60694 0.65625 7.35147 0.65625C5.096 0.65625 3.26758 3.21604 3.26758 6.3737" 
                     stroke="#000000" 
                     stroke-width="0.983866" 
                     stroke-linecap="round">
                       </path>
                       </svg>
                       </span>
               </div>
            )}
          </Button>

          {/* <Button
            variant="outline"
            onClick={toggleWishlist}
            size="lg"
            className="w-full"
          >
            <Heart 
              size={20} 
              className={cn(
                "mr-2",
                isWishlisted && "fill-current text-red-500"
              )}
            />
            {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </Button>*/}
        </div> 

        

        {/* Description */}
        {/* {product.description && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>
          </div>
        )} */}

        {/* Specifications */}
        {product.specifications && (
          <div className="space-y-3">
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
          </div>
        )}

                 {/* goes well with */}
         {relatedProduct && (
           <div className="space-y-3 !mb-10 !mt-10 bg-brand-cream rounded-lg p-3">
             <h3 className="text-sm font-pp-mori font-semibold text-brand-black">GOES WELL WITH</h3>
             <div className="flex items-center gap-3">
               <div className="relative w-16 h-16 rounded overflow-hidden">
                 <Image
                   src={relatedProduct.product_images[0]?.image_url || ''}
                   alt={relatedProduct.name}
                   fill
                   className="object-cover"
                   sizes="64px"
                 />
               </div>
               <div className="flex-1 min-w-0">
                 <h4 className="text-sm font-medium text-brand-black truncate">
                   {relatedProduct.name}
                 </h4>
                 <p className="text-sm text-brand-black font-bold">
                   ₦{relatedProduct.price.toFixed(2)}
                 </p>
               </div>
               <Button
                 variant="outline"
                 size="sm"
                 className="w-8 h-8 p-0 rounded-full border-brand-black hover:bg-brand-black hover:text-white"
                 onClick={() => addToCart(relatedProduct, 1)}
               >
                 <Plus size={16} />
               </Button>
             </div>
           </div>
         )}

         {/* Product Features */}
        <div className="space-y-3">
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-col items-center gap-2">
              <span className="bg-brand-cream rounded-full p-2">
                <svg data-v-aa957220="" width="25" height="25" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2468_1714)"><path d="M25.5772 7.84239C25.9361 7.84239 26.2272 7.55137 26.2272 7.19239V1.34239C26.2272 0.983403 25.9361 0.692388 25.5772 0.692388C25.2182 0.692388 24.9272 0.983403 24.9272 1.34239L24.9272 6.54239L19.7272 6.54239C19.3682 6.54239 19.0772 6.8334 19.0772 7.19239C19.0772 7.55137 19.3682 7.84239 19.7272 7.84239H25.5772ZM25.1175 25.1175C20.2946 29.9405 12.475 29.9405 7.652 25.1175L6.73276 26.0368C12.0634 31.3674 20.7061 31.3674 26.0368 26.0368L25.1175 25.1175ZM7.652 25.1175C2.82902 20.2946 2.82902 12.475 7.652 7.65201L6.73276 6.73277C1.4021 12.0634 1.4021 20.7061 6.73276 26.0368L7.652 25.1175ZM7.652 7.65201C12.475 2.82903 20.2946 2.82903 25.1175 7.65201L26.0368 6.73277C20.7061 1.40211 12.0634 1.40211 6.73276 6.73277L7.652 7.65201Z" fill="black"></path><path opacity="0.89" d="M12.8272 21.192C10.8472 21.192 9.49116 20.1 9.39516 18.324H10.8712C10.9552 19.296 11.7112 19.884 12.8272 19.884C13.8592 19.884 14.5072 19.368 14.5072 18.576C14.5072 17.796 13.8712 17.316 12.8152 17.316H11.5072V16.128H12.8152C13.6672 16.128 14.1832 15.588 14.1832 14.928C14.1832 14.232 13.6192 13.716 12.7792 13.716C11.9272 13.716 11.2792 14.256 11.1712 15.084H9.68316C9.85116 13.476 11.0992 12.42 12.8272 12.42C14.4592 12.42 15.6232 13.356 15.6232 14.664C15.6232 15.66 14.9392 16.428 13.9312 16.644C15.1672 16.872 15.9112 17.664 15.9112 18.78C15.9112 20.208 14.6872 21.192 12.8272 21.192ZM20.1522 21.18C18.1482 21.18 16.8162 19.452 16.8162 16.776C16.8162 14.16 18.1122 12.42 20.1522 12.42C22.1442 12.42 23.4762 14.124 23.4762 16.776C23.4762 19.404 22.1802 21.18 20.1522 21.18ZM20.1522 19.848C21.2922 19.848 22.0242 18.648 22.0242 16.776C22.0242 14.928 21.2922 13.74 20.1522 13.74C19.0002 13.74 18.2682 14.928 18.2682 16.776C18.2682 18.648 19.0002 19.848 20.1522 19.848Z" fill="#242424"></path></g><defs><clipPath id="clip0_2468_1714"><rect width="31" height="31" fill="white"></rect></clipPath></defs></svg>
              </span>
              <span className="text-sm font-pp-mori font-light text-brand-black text-center">
              30 Days <br /> Return
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="bg-brand-cream rounded-full p-2">
                <svg data-v-aa957220="" width="25" height="25" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2468_1714)"><path d="M30.7057 14.2624L29.0104 10.0241C28.8855 9.70887 28.6685 9.43855 28.3877 9.24846C28.1069 9.05836 27.7753 8.95732 27.4362 8.95852H23.0078V7.75C23.0078 7.5573 22.9313 7.3725 22.795 7.23624C22.6588 7.09999 22.4739 7.02344 22.2812 7.02344H3.875C3.42538 7.02344 2.99417 7.20205 2.67623 7.51998C2.3583 7.83792 2.17969 8.26913 2.17969 8.71875V22.2812C2.17969 22.7309 2.3583 23.1621 2.67623 23.48C2.99417 23.7979 3.42538 23.9766 3.875 23.9766H6.12734C6.2941 24.7978 6.73964 25.5361 7.38847 26.0664C8.0373 26.5968 8.84952 26.8865 9.6875 26.8865C10.5255 26.8865 11.3377 26.5968 11.9865 26.0664C12.6354 25.5361 13.0809 24.7978 13.2477 23.9766H19.6898C19.8566 24.7978 20.3021 25.5361 20.951 26.0664C21.5998 26.5968 22.412 26.8865 23.25 26.8865C24.088 26.8865 24.9002 26.5968 25.549 26.0664C26.1979 25.5361 26.6434 24.7978 26.8102 23.9766H29.0625C29.5121 23.9766 29.9433 23.7979 30.2613 23.48C30.5792 23.1621 30.7578 22.7309 30.7578 22.2812V14.5312C30.7577 14.4391 30.74 14.3479 30.7057 14.2624ZM23.0078 10.4141H27.4374C27.4859 10.414 27.5333 10.4285 27.5735 10.4557C27.6136 10.4829 27.6447 10.5216 27.6627 10.5666L28.9584 13.8047H23.0078V10.4141ZM3.63281 8.71875C3.63281 8.65452 3.65833 8.59292 3.70375 8.5475C3.74917 8.50208 3.81077 8.47656 3.875 8.47656H21.5547V16.7109H3.63281V8.71875ZM9.6875 25.4297C9.2564 25.4297 8.83498 25.3018 8.47653 25.0623C8.11808 24.8228 7.83871 24.4824 7.67373 24.0841C7.50876 23.6858 7.46559 23.2476 7.54969 22.8248C7.6338 22.4019 7.84139 22.0136 8.14623 21.7087C8.45106 21.4039 8.83945 21.1963 9.26226 21.1122C9.68508 21.0281 10.1233 21.0713 10.5216 21.2362C10.9199 21.4012 11.2603 21.6806 11.4998 22.039C11.7394 22.3975 11.8672 22.8189 11.8672 23.25C11.8672 23.8281 11.6375 24.3825 11.2288 24.7913C10.82 25.2 10.2656 25.4297 9.6875 25.4297ZM19.6898 22.5234H13.2477C13.0809 21.7022 12.6354 20.9639 11.9865 20.4336C11.3377 19.9032 10.5255 19.6135 9.6875 19.6135C8.84952 19.6135 8.0373 19.9032 7.38847 20.4336C6.73964 20.9639 6.2941 21.7022 6.12734 22.5234H3.875C3.81077 22.5234 3.74917 22.4979 3.70375 22.4525C3.65833 22.4071 3.63281 22.3455 3.63281 22.2812V18.1641H21.5547V20.0386C21.08 20.2898 20.6666 20.6428 20.3443 21.0724C20.0219 21.5019 19.7984 21.9974 19.6898 22.5234ZM23.25 25.4297C22.8189 25.4297 22.3975 25.3018 22.039 25.0623C21.6806 24.8228 21.4012 24.4824 21.2362 24.0841C21.0713 23.6858 21.0281 23.2476 21.1122 22.8248C21.1963 22.4019 21.4039 22.0136 21.7087 21.7087C22.0136 21.4039 22.4019 21.1963 22.8248 21.1122C23.2476 21.0281 23.6858 21.0713 24.0841 21.2362C24.4824 21.4012 24.8228 21.6806 25.0623 22.039C25.3019 22.3975 25.4297 22.8189 25.4297 23.25C25.4297 23.8281 25.2 24.3825 24.7913 24.7913C24.3825 25.2 23.8281 25.4297 23.25 25.4297ZM29.3047 22.2812C29.3047 22.3455 29.2792 22.4071 29.2338 22.4525C29.1883 22.4979 29.1267 22.5234 29.0625 22.5234H26.8102C26.6416 21.7034 26.1955 20.9666 25.5469 20.4372C24.8984 19.9078 24.0872 19.6182 23.25 19.6172C23.1689 19.6172 23.0877 19.6172 23.0078 19.6257V15.2578H29.3047V22.2812Z" fill="black"></path></g><defs><clipPath id="clip0_2468_1714"><rect width="31" height="31" fill="white"></rect></clipPath></defs></svg>
              </span>
              <span className="text-sm font-pp-mori font-light text-brand-black text-center">
              Free <br /> Shipping
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="bg-brand-cream rounded-full p-2">
              <svg data-v-aa957220="" width="25" height="25" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 13.5133C15.9125 16.7471 12.8238 24.6846 12.8238 24.6846C12.8238 24.6846 8.41125 13.5133 4 10.9346" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M25.8701 6.65584L26.4026 12.1858C26.7476 15.7733 24.0588 18.9671 20.4713 19.3133C16.9513 19.6508 13.7626 17.0783 13.4238 13.5583C13.3428 12.7213 13.4275 11.8764 13.6732 11.0721C13.9189 10.2678 14.3207 9.51975 14.8556 8.87081C15.3906 8.22187 16.0482 7.68472 16.7908 7.29008C17.5335 6.89543 18.3466 6.65103 19.1838 6.57084L25.0788 6.00334C25.1736 5.99421 25.2693 6.00384 25.3604 6.03169C25.4515 6.05954 25.5362 6.10506 25.6096 6.16566C25.6831 6.22625 25.7439 6.30073 25.7886 6.38484C25.8333 6.46895 25.861 6.56104 25.8701 6.65584Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              </span>
              <span className="text-sm font-pp-mori font-light text-brand-black text-center">
              Vegan & <br /> Cruelty Free
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="bg-brand-cream rounded-full p-2">
              <svg data-v-aa957220="" width="25" height="25" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.88657 12.7495C8.51027 15.1739 9.82587 17.6709 11.3648 19.2098C13.4691 21.3141 15.5118 22.1413 17.2465 22.2084C18.9746 22.2744 20.5091 21.588 21.6333 20.4616C22.1393 19.9534 22.4649 19.2186 22.6013 18.3056C22.7388 17.3959 22.6838 16.3476 22.4715 15.2619C21.6619 11.1094 17.7965 7.80717 13.0247 6.64557C10.9083 6.13077 9.29347 6.21547 8.41127 7.09987C7.91847 7.59487 7.61487 8.37147 7.52797 9.37687C7.44327 10.3757 7.57527 11.5406 7.88657 12.7495ZM6.35097 9.32847C6.44557 8.21527 6.79097 7.18677 7.52137 6.45307C8.92057 5.05057 11.2284 5.14847 13.3734 5.67097C18.5104 6.92167 22.7432 10.489 23.6364 15.0716C23.8619 16.2266 23.929 17.3761 23.7728 18.4101C23.6188 19.4397 23.236 20.3934 22.5221 21.1095C21.8249 21.8142 20.9884 22.3658 20.066 22.7291C19.1436 23.0924 18.1556 23.2593 17.1651 23.2193C15.0146 23.1379 12.6991 22.1182 10.4606 19.8797C8.76877 18.1879 7.38607 15.5281 6.73267 12.9904C6.40487 11.7177 6.25417 10.4505 6.35097 9.32847Z" fill="black"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M17.2156 11.6032C17.5379 11.6505 17.7546 11.9112 17.6985 12.1862L17.1364 14.978L19.7874 18.0118L21.4561 20.2382L23.6638 23.5492C23.8255 23.7923 23.7265 24.1014 23.4427 24.2389C23.1589 24.3775 22.7981 24.2928 22.6364 24.0497L20.4441 20.7607L18.9459 18.7642L14.5437 18.1834C14.2214 18.1405 14.0003 17.882 14.0498 17.607C14.0993 17.332 14.4018 17.1417 14.7241 17.1846L17.9614 17.6125L16.0617 15.4367L11.7497 11.7407C11.6957 11.698 11.6521 11.6436 11.6222 11.5817C11.5923 11.5197 11.5768 11.4518 11.5769 11.3829C11.577 11.3141 11.5927 11.2462 11.6228 11.1844C11.6529 11.1225 11.6967 11.0683 11.7508 11.0257C11.8694 10.9305 12.017 10.8788 12.1691 10.8792C12.3213 10.8796 12.4686 10.9321 12.5868 11.0279L16.1211 14.0573L16.5325 12.0157C16.5875 11.7407 16.8933 11.5559 17.2156 11.6032Z" fill="black"></path></svg>
              </span>
              <span className="text-sm font-pp-mori font-light text-brand-black text-center">
              Kind to planet <br /> Packeging
              </span>
            </div>
          </div>
        </div>



        </div>
      </div>
    </div>
  );
}
