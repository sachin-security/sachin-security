// components/Services.tsx
'use client';
import services from '../data/services';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';

export default function Services( {customPadding}:{customPadding:number}) {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="services" className={`${customPadding?'py-'+customPadding:'py-8'} bg-slate-900 relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-6">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-amber-400">
            Our Services
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Comprehensive security solutions tailored to your needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
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
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Link
                  href={'/security-services/'+service.slug}
                  className="group block bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 hover:border-amber-400/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)] overflow-hidden h-full"
                >
                  {/* Image Section with Zoom Effect */}
                  <div className="relative h-56 overflow-hidden bg-slate-950">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                    
                    {/* Icon Badge */}
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-amber-500/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-amber-400 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm line-clamp-4">
                      {service.description}
                    </p>
                    
                    {/* Read More Link */}
                    <div className="mt-4 flex items-center gap-2 text-amber-400 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                      <span>Learn More</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link
            href="/#contact"
            className="inline-block bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)]"
          >
            Request a Free Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
