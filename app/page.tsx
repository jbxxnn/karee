import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import { Layout } from "@/components/layout/layout";
import { About } from "@/components/about";
import { Separator } from "@/components/ui/separator";
import { ProductHome } from "@/components/product-home";

export default function Home() {
  return (
    <Layout>
      <main className="flex flex-col items-center bg-brand-cream">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <div className="w-full flex-1 flex flex-col gap-20 p-0">
            <Hero />
            <About />
            <Separator className="bg-brand-black/10" />
            <div className="w-full flex flex-col gap-2">
                <div className="text-left">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-brand-black mb-6 font-pp-mori">
                  Handcrafted Whipped<br /> Perfection
                  </h2>
                  <p className="text-sm font-pp-mori mb-12">At Kareè, we believe beauty should be simple, pure, and empowering. <br />
                  Every jar combines nature’s healing power with modern luxury — no shortcuts, no compromises.</p>
                </div>
                <ProductHome />
            </div>
            <main className="flex-1 flex flex-col gap-6 px-4">
              <h2 className="font-medium text-xl mb-4">Next steps</h2>
              {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
            </main>
          </div>

          <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
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
          </footer>
        </div>
      </main>
    </Layout>
  );
}
