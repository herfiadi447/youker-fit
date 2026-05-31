import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
      {/* TopNavBar */}
      <header className="w-full top-0 sticky z-50 bg-surface shadow-sm">
        <div className="flex justify-between items-center h-16 px-gutter max-w-[1200px] mx-auto">
          <div className="font-headline-md text-headline-md font-bold text-on-surface">
            Youker Fit
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200 px-3 py-2 rounded-md"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200 px-3 py-2 rounded-md"
              href="/food-log"
            >
              Food Log
            </Link>
            <Link
              className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors duration-200 px-3 py-2 rounded-md"
              href="/exercise-log"
            >
              Exercise Log
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="font-body-md text-body-md font-semibold bg-emerald-muted text-on-surface px-4 py-2 rounded-lg hover:bg-emerald-muted/90 transition-colors duration-200 active:scale-95"
            >
              Get Started
            </Link>
            <Link
              href="/profile"
              aria-label="Account"
              className="text-on-surface-variant hover:text-on-surface transition-colors duration-200"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                account_circle
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="relative min-h-[700px] flex items-center justify-center px-container-padding overflow-hidden">
          {/* Background gradient instead of external image */}
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-gradient-to-br from-surface-container-lowest via-primary-container to-tertiary-container opacity-60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-base">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
              Track your food, burn, and progress in one place
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-2xl">
              Analytical health tracking designed for clarity. Monitor your
              caloric intake, analyze your expenditure, and optimize your routine
              with precision data visualization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/dashboard"
                className="font-body-md text-body-md font-semibold bg-emerald-muted text-on-surface px-8 py-3 rounded-lg hover:bg-emerald-muted/90 transition-all duration-200 active:scale-95 shadow-[0_4px_14px_0_rgba(5,150,105,0.39)]"
              >
                Start Tracking Free
              </Link>
              <Link
                href="/dashboard"
                className="font-body-md text-body-md font-medium text-blue-muted border border-outline-variant px-8 py-3 rounded-lg hover:bg-surface-variant transition-colors duration-200 active:scale-95"
              >
                View Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-20 px-container-padding max-w-[1200px] mx-auto w-full">
          <div className="mb-12 text-center">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Precision Tools for Real Results
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-deep-slate rounded-xl p-card-inner border border-outline-variant/30 flex flex-col gap-4 hover:bg-charcoal-surface transition-colors duration-300">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-2">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  restaurant
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Automatic Calorie Estimation
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                Input meals using natural language. Our system parses ingredients
                and portions to instantly calculate macros and caloric load.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-deep-slate rounded-xl p-card-inner border border-outline-variant/30 flex flex-col gap-4 hover:bg-charcoal-surface transition-colors duration-300">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary mb-2">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  fitness_center
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Exercise Tracking
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                Log strength and cardio sessions with clinical precision. Track
                volume, intensity, and estimated caloric burn seamlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-deep-slate rounded-xl p-card-inner border border-outline-variant/30 flex flex-col gap-4 hover:bg-charcoal-surface transition-colors duration-300">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary mb-2">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  monitoring
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Visual Progress
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                Monitor trends over time with clean, distraction-free charts.
                Understand your metabolic rhythm without gamified clutter.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 mt-section-gap bg-surface-dim border-t border-outline-variant">
        <div className="flex flex-col items-center justify-center space-y-4 px-container-padding max-w-[1200px] mx-auto">
          <div className="font-headline-sm text-headline-sm text-on-surface">
            Youker Fit
          </div>
          <nav className="flex gap-6">
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
              href="#"
            >
              Contact Support
            </a>
          </nav>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-4">
            © 2024 Youker Fit. Analytical health tracking.
          </p>
        </div>
      </footer>
    </div>
  );
}
