

export function Hero() {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div 
        className="relative flex flex-col gap-4 items-center justify-center h-[40rem] w-full rounded-md overflow-hidden"
        style={{
          backgroundImage: 'url(/home-4-2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content with relative positioning to appear above overlay */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 font-pp-mori">
          <span className="font-pp-editorial font-normal italic">Glow</span> Naturally <br />with <span className="font-pp-editorial font-normal italic">Kareè.</span>
          </h1>
          <p className="text-sm md:text-base text-white/90 leading-relaxed font-pp-mori">
            Premium skincare products that enhance your natural radiance. <br />
            Experience the difference with our carefully curated collection.
          </p>
        </div>
      </div>
    </div>
  );
}
