// components/Industries.tsx
import { Building, HardHat, ShoppingBag, Hospital, School, Home } from 'lucide-react';

const industries = [
  { icon: Building, name: 'Corporate Offices', color: 'from-amber-500 to-yellow-600' },
  { icon: HardHat, name: 'Construction Sites', color: 'from-amber-600 to-orange-600' },
  { icon: ShoppingBag, name: 'Retail & Malls', color: 'from-yellow-500 to-amber-500' },
  { icon: Hospital, name: 'Healthcare', color: 'from-amber-500 to-yellow-500' },
  { icon: School, name: 'Educational', color: 'from-yellow-600 to-amber-600' },
  { icon: Home, name: 'Residential', color: 'from-amber-400 to-yellow-500' }
];

export default function Industries() {
  return (
    <section className="py-24 bg-slate-950" id='industries'>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Industries We Serve
          </h2>
          <p className="text-xl text-slate-400">
            Trusted security across diverse sectors
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="fade-in group text-center p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-amber-400/50 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br ${industry.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <industry.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-white">{industry.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
