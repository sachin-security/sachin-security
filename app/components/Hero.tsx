// components/Hero.tsx
import { Shield, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-linear(to_right,#4f4f4f1a_1px,transparent_1px),linear-linear(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-linear(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
      
      {/* Gold accent glow */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] animate-pulse" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center fade-in">
          <div className="flex justify-center mb-8">
            <Shield className="w-20 h-20 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
            Professional Security You Can Trust
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed">
            Protecting what matters most with elite security solutions, trained professionals, and 24/7 vigilance
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] flex items-center justify-center gap-2">
              Get Protected Today
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="border-2 text-white border-amber-400 hover:bg-amber-400/10 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
