// components/WhyChooseUs.tsx
import { CheckCircle, Award, Users, Clock } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Trained Professionals',
    description: 'All guards undergo rigorous training and continuous skill development'
  },
  {
    icon: CheckCircle,
    title: 'Verified Background',
    description: 'Comprehensive background checks and security clearances for all personnel'
  },
  {
    icon: Award,
    title: 'Certified & Licensed',
    description: 'Fully licensed and insured with industry-recognized certifications'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Round-the-clock monitoring and rapid response teams always ready'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-linear-to-b from-slate-900 to-slate-950">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-2xl md:text-5xl font-bold mb-4 bg-linear-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Why Choose Us
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Experience the difference of working with industry-leading security professionals
          </p>
        </div>
        
        <div className="grid px-4 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="fade-in flex gap-6 p-4 bg-slate-900 rounded-2xl border border-amber-400/20 hover:border-amber-400/50 transition-all duration-300"
            >
              <div className="shrink-0ll">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
    </section>
  );
}
