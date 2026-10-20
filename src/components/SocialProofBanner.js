import { ArrowRight, Quote, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export const SocialProofBanner = ({ onReadStories }) => {
  return (
    <section className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-xl">
          {/* Dark Warm Card with scroll reveal */}
          <ScrollReveal
            animation="fade-up"
            duration={0.75}
            className="lg:col-span-6 bg-[#2B231F] text-[#F9F7F4] p-8 sm:p-12 lg:p-16 flex flex-col justify-between"
          >
            <div>
              <Quote className="w-10 h-10 text-amber-500/80 mb-6" />
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-normal leading-snug tracking-tight text-amber-50/95">
                &ldquo;A good table should survive late-night study sessions, coffee spills, and three apartment moves without wobbling.&rdquo;
              </h3>
            </div>

            <div className="mt-10 pt-8 border-t border-stone-700/60">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">Furnishing Real Homes</p>
                    <p className="text-xs text-stone-400">Over 2,000 apartments & studios across Phnom Penh & SE Asia</p>
                  </div>
                </div>

                <button
                  onClick={onReadStories}
                  className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <span>Read Customer Notes</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Warm Ambient Photo with scroll reveal */}
          <ScrollReveal
            animation="fade-left"
            delay={100}
            duration={0.8}
            className="lg:col-span-6 min-h-[300px] lg:min-h-full bg-stone-300 relative overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=1200&q=80"
              alt="Warm handcrafted dining table and chair setting in real home"
              className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-stone-900/15 pointer-events-none" />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
