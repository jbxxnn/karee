'use client';

import { useState } from 'react';
import { ProductImage } from '@/lib/types/database';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-lg">No images available</span>
      </div>
    );
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="w-full">
      {/* Mobile Slider - Hidden on lg and above */}
      <div className="lg:hidden">
        <div className="relative w-full">
          {/* Main Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            {/* Current Image */}
            <div 
              className="w-full h-full flex items-center justify-center bg-cover bg-center bg-no-repeat transition-all duration-300 ease-in-out"
              style={{
                backgroundImage: `url(${images[currentImageIndex].image_url})`
              }}
            />
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} className="text-gray-800" />
                </button>
                
                {/* Next Button */}
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} className="text-gray-800" />
                </button>
              </>
            )}
          </div>

          {/* Image Counter */}
          {/* {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
              {currentImageIndex + 1} / {images.length}
            </div>
          )} */}

          {/* Dots Navigation */}
          {images.length > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4 pb-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'bg-brand-black w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                  title={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Thumbnail Preview */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 px-4 overflow-x-auto pb-2">
              {images.map((image, index) => (
                                 <button
                   key={index}
                   onClick={() => goToImage(index)}
                   className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                     index === currentImageIndex 
                       ? 'border-brand-black' 
                       : 'border-gray-200 hover:border-gray-300'
                   }`}
                   aria-label={`Go to image ${index + 1}`}
                   title={`Go to image ${index + 1}`}
                 >
                  <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${image.image_url})`
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Grid Layout - Hidden on mobile, visible on lg and above */}
      <div className="hidden lg:flex flex-col">
        {/* First Image - Full Width */}
        <div className="relative aspect-square overflow-hidden">
          <div 
            className="w-full h-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${images[0].image_url})`
            }}
          />
        </div>

        {/* Second Row - Second Image (65%) + Third/Fourth Images (35%) */}
        {images.length > 1 && (
          <div className="flex">
            {/* Second Image - 65% width */}
            <div className="relative aspect-square overflow-hidden w-[65%]">
              <div 
                className="w-full h-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${images[1].image_url})`
                }}
              />
            </div>

            {/* Third and Fourth Images - 35% width, stacked vertically */}
            {images.length > 2 && (
              <div className="flex flex-col w-[35%]">
                {images.slice(2).map((image, index) => (
                  <div 
                    key={index + 2}
                    className="relative aspect-square overflow-hidden"
                  >
                    <div 
                      className="w-full h-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${image.image_url})`
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
