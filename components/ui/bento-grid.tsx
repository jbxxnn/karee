import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-9xl grid-cols-2 gap-4 auto-rows-[18rem] md:auto-rows-[30rem] md:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  price,
  short_description,
  header,
}: {
  className?: string;
  title?: string | React.ReactNode;
  price?: string | React.ReactNode;
  short_description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between space-y-2 rounded-sm bg-[#00000000] p-0 transition duration-200 dark:border-white/[0.2] dark:bg-black dark:shadow-none",
        className,
      )}
    >
      {header}
      <div className="transition duration-200 p-0">
        <div className="flex justify-between mt-1 mb-1 text-neutral-600 dark:text-neutral-200 font-brand-black">
          <div className="text-lg md:text-xl uppercase font-ultrabold text-brand-cream">{title}</div>
          {/* <div className="text-md font-ultrabold text-brand-cream">{price}</div> */}
        </div>
        <div className="flex flex-col md:flex-row justify-between text-xs md:text-sm font-normal text-brand-cream">
          {short_description}
          <div className="text-md font-ultrabold text-brand-cream">{price}</div>
        </div>
      </div>
    </div>
  );
};
