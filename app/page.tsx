import { Hero } from "@/components/hero";
// import { ThemeSwitcher } from "@/components/theme-switcher";
// import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
// import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
// import { hasEnvVars } from "@/lib/utils";
import { Layout } from "@/components/layout/layout";
import { About } from "@/components/about";
import { ProductHome } from "@/components/product-home";
// import { WhyKaree } from "@/components/why-karee";
// import { InfiniteMovingCardsDemo } from "@/components/testimonials";

export default function Home() {
  return (
    <Layout>
      <main className="flex flex-col items-center bg-brand-cream">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <div className="w-full flex-1 flex flex-col gap-20 p-0">
            <Hero />
            <About />
            <div className="w-full flex flex-col gap-2 p-[10rem] px-3 bg-brand-black">
                <div className="text-center">
                  <h2 className="text-5xl uppercase md:text-6xl lg:text-7xl font-ultrabold text-brand-cream mb-6">
                  Whipped <br /> Perfection
                  </h2>
                  <p className="text-sm font-pp-mori m-auto mb-12 w-[100%] lg:w-[30%] text-brand-cream">At Kareè, we believe beauty should be simple, pure, and empowering.
                  Every jar combines nature’s healing power with modern luxury — no shortcuts, no compromises.</p>
                </div>
                <ProductHome />
            </div>
            {/* <div className="w-full flex flex-col gap-2 p-3 md:p-5">
                <div className="text-center ">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-brand-black mb-6 font-pp-mori">
                  Hydration. Softness. Glow.
                  </h2>
                  <p className="text-sm font-pp-mori mb-12 w-[100%] lg:w-[30%] mx-auto">Experience whipped shea butter that melts effortlessly, leaving skin deeply nourished and naturally radiant.</p>
                </div>
            <WhyKaree />
            <InfiniteMovingCardsDemo />
            </div>
            <main className="flex-1 flex flex-col gap-6 px-4">
              <h2 className="font-medium text-xl mb-4">Next steps</h2>
              {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
            </main>*/}
          </div> 

          {/* <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <p>
              Powered by{" "}
              <a
                href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer noopener"
              >
                Supabase
              </a>
            </p>
            <ThemeSwitcher />
          </footer> */}
        </div>
      </main>
    </Layout>
  );
}
