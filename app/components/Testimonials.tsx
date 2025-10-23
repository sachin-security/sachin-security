// components/Testimonials.tsx
'use client';

import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajesh Patel',
    position: 'CEO, TechCorp Industries',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    rating: 5,
    text: 'SACHIN SECURITY has been protecting our manufacturing facility for over 5 years. Their professionalism and dedication to safety is unmatched. Highly recommended!'
  },
  {
    name: 'Priya Sharma',
    position: 'Manager, Grand Plaza Hotel',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    rating: 5,
    text: 'The security team is exceptional - well-trained, courteous, and always alert. Our guests feel safe and our property is in good hands 24/7.'
  },
  {
    name: 'Amit Desai',
    position: 'Director, Metro Hospital',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
    rating: 5,
    text: 'In a healthcare environment, security is critical. SACHIN SECURITY provides trained personnel who understand the sensitive nature of our work. Excellent service!'
  },
  {
    name: 'Neha Mehta',
    position: 'Operations Head, CityCentre Mall',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha',
    rating: 5,
    text: 'Managing security for a large retail space requires expertise. Their team handles crowds professionally and responds quickly to any situation. Very satisfied!'
  }
];

export default function Testimonials() {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section className="py-24 bg-linear-to-b from-slate-950 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Client Testimonials
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            What our valued clients say about our security services
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => {
            const { ref, inView } = useInView({
              triggerOnce: true,
              threshold: 0.1,
            });

            return (
              <div
                key={index}
                ref={ref}
                className={`transition-all duration-700 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="group bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-amber-400/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.1)] h-full relative">
                  {/* Quote Icon */}
                  <Quote className="absolute top-6 right-6 w-12 h-12 text-amber-400/20 group-hover:text-amber-400/40 transition-colors" />
                  
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-slate-300 leading-relaxed mb-6 text-lg italic relative z-10">
                    "{testimonial.text}"
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-4 border-t border-slate-800 pt-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full bg-slate-800 ring-2 ring-amber-400/30"
                    />
                    <div>
                      <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                      <p className="text-slate-400 text-sm">{testimonial.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Partners/Certifications Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Our Presence</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-4xl mx-auto">
            <p className="text-slate-300 text-lg leading-relaxed">
              We have our wide presence in the States of <span className="text-amber-400 font-semibold">Uttar Pradesh, Madhya Pradesh, Gujarat, Rajasthan</span> and <span className="text-amber-400 font-semibold">UT</span> besides the state of Gujarat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
