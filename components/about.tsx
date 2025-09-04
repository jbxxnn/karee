import Image from "next/image";
import { ImageSlider } from "./image-slider";

export function About() {
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center h-auto md:h-[30rem] w-full p-3 md:p-5 overflow-hidden">
        <div className="flex flex-col gap-2 items-start w-[100%] md:w-[65%]">
            <div className="flex flex-col gap-2 w-[100%] md:w-[70%] mb-4">
                <p className="text-md text-center md:text-left font-pp-mori mb-2">Kareè was born from a passion to share Africa’s timeless skincare treasure with the world. Shea butter has been trusted for generations, and we’ve reimagined it into a modern, whipped form that feels light, indulgent, and effortlessly nourishing.</p>
                <h2 className="text-lg font-pp-mori text-sm font-bold text-center md:text-left">• About Kareè.</h2>
            </div>
            <div className="h-[30%] md:h-[100%] overflow-hidden">
            <div className="flex flex-col gap-2 w-[100%] md:w-[50%] items-center justify-end h-full overflow-hidden">
                {/* <Image 
                src="/home-1-3.jpg" 
                alt="About Kareè" 
                width={500}
                height={500}
                /> */}
                  <ImageSlider />
            </div>
            </div>
        </div>
        <div className="flex flex-col gap-2 items-end w-[100%] md:w-[35%] h-full overflow-hidden">
            <div className="flex flex-col gap-2 w-[100%] md:w-[85%] h-full items-end justify-center">
            <Image 
                src="/home-2.jpg" 
                alt="About Kareè" 
                width={500}
                height={500}
            />
            </div>
        </div>
    </div>
  );
}
