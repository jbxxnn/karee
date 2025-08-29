'use client';

// import { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/lib/types/database';
// import { Button } from '@/components/ui/button';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  // const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-lg">No images available</span>
      </div>
    );
  }

  // const selectedImage = images[selectedImageIndex];
  // const hasMultipleImages = images.length > 1;

  // const goToPrevious = () => {
  //   setSelectedImageIndex((prev) => 
  //     prev === 0 ? images.length - 1 : prev - 1
  //   );
  // };

  // const goToNext = () => {
  //   setSelectedImageIndex((prev) => 
  //     prev === images.length - 1 ? 0 : prev + 1
  //   );
  // };

  // const goToImage = (index: number) => {
  //   setSelectedImageIndex(index);
  // };



    return (
    <div className="flex gap-4">
      {/* Thumbnail Navigation - Left Side */}
      {/* {hasMultipleImages && (
        <div className="flex flex-col gap-2">
          {images.map((image, index) => (
            <div
              key={image.id}
              onClick={() => goToImage(index)}
              className={cn(
                "relative w-20 h-20 rounded-sm overflow-hidden border-2 transition-all duration-200 cursor-pointer",
                index === selectedImageIndex
                  ? "border-brand-secondary ring-0 ring-brand-secondary"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              <Image
                src={image.image_url}
                alt={image.alt_text || `Product image ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ))}
        </div>
      )} */}

      {/* Main Image */}
      <div className="relative aspect-square bg-[#F6F6F3] dark:bg-[#F6F6F3] rounded-sm overflow-hidden group flex-1">
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={images[0].image_url}
            alt={images[0].alt_text || 'Product image'}
            width={600}
            height={600}
            className="max-w-full max-h-full object-contain"
            priority
          />
        </div>
        
        {/* Navigation Arrows */}
        {/* {hasMultipleImages && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </Button>
          </>
        )} */}

        {/* Image Counter */}
        {/* {hasMultipleImages && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )} */}
      </div>
    </div>
  );
}
