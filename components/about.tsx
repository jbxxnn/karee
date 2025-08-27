import Image from "next/image";

export function About() {
  return (
    <div className="flex gap-2 items-center h-[40rem] w-full">
        <div className="flex flex-col gap-2 items-start w-[65%] h-full">
            <div className="flex flex-col gap-2 w-[70%]">
                <p className="text-md font-pp-mori mb-2">Kareè was born from a passion to share Africa’s timeless skincare treasure with the world. Shea butter has been trusted for generations, and we’ve reimagined it into a modern, whipped form that feels light, indulgent, and effortlessly nourishing.</p>
                <h2 className="text-lg font-pp-mori text-sm font-bold">• About Kareè.</h2>
            </div>
            <div className="flex flex-col gap-2 w-[40%] items-center justify-end h-full">
                <Image 
                src="/home-1-3.jpg" 
                alt="About Kareè" 
                width={500}
                height={500}
                />
            </div>
        </div>
        <div className="flex flex-col gap-2 items-end w-[35%] h-full overflow-hidden">
            <div className="flex flex-col gap-2 w-[85%] h-full items-end justify-center">
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
