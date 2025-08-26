import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import { Layout } from "@/components/layout/layout";

export default function Home() {
  return (
    <Layout>
      <main className="flex flex-col items-center pt-16">
        <Hero />
        
        {/* Content sections to enable scrolling */}
        <section className="w-full py-20 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Welcome to kareè
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Experience the perfect blend of style, comfort, and quality in every piece we create.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Our Collections
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover our carefully curated collections designed for the modern lifestyle.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Get Started
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                Ready to explore our world? Start your journey with kareè today.
              </p>
              
              {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
            </div>
          </div>
        </section>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16 bg-gray-50 dark:bg-gray-800">
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
      </main>
    </Layout>
  );
}
