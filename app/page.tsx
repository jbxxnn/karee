import { Hero } from "@/components/hero";
// import { ThemeSwitcher } from "@/components/theme-switcher";
// import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
// import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
// import { hasEnvVars } from "@/lib/utils";
import { Layout } from "@/components/layout/layout";
import { About } from "@/components/about";
import { ProductHome } from "@/components/product-home";
import Testimonials from "@/components/reviews";
// import { WhyKaree } from "@/components/why-karee";
// import { InfiniteMovingCardsDemo } from "@/components/testimonials";

export default function Home() {
  return (
    <Layout>
      <main className="flex flex-col items-center bg-[#f8f8f8]">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <div className="w-full flex-1 flex flex-col gap-20 p-0">
            <Hero />
            <About />
            <div className="w-full flex flex-col gap-2 p-[5rem] px-3 bg-brand-black">
                <div className="text-center">
                  <h2 className="text-5xl uppercase md:text-6xl lg:text-7xl font-ultrabold text-brand-cream mb-6">
                  Whipped <br /> Perfection
                  </h2>
                  <p className="text-sm font-pp-mori m-auto mb-12 w-[100%] lg:w-[30%] text-brand-cream">At Kareè, we believe beauty should be simple, pure, and empowering.
                  Every jar combines nature’s healing power with modern luxury — no shortcuts, no compromises.</p>
                </div>
                <ProductHome />
            </div>
            <Testimonials />
          </div>
        </div>
      </main>
    </Layout>
  );
}
