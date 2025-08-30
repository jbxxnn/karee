'use client';

import { ProductImage } from '@/lib/types/database';

interface ProductGalleryProps {
  images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-lg">No images available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
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
  );
}
