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
        "mx-auto grid max-w-9xl grid-cols-1 gap-4 auto-rows-[30rem] md:auto-rows-[30rem] md:grid-cols-4",
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
        "group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-sm border border-neutral-200 bg-[#F6F6F3] p-0 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
        className,
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2 p-4">
        <div className="flex justify-between mt-2 mb-2 font-pp-mori text-neutral-600 dark:text-neutral-200 font-brand-black">
          <div className="text-lg">{title}</div>
          <div className="text-md">{price}</div>
        </div>
        <div className="font-sans text-sm font-normal text-neutral-600 dark:text-neutral-300">
          {short_description}
        </div>
      </div>
    </div>
  );
};
