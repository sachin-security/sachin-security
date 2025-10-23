// components/Services.tsx
'use client';

import { useInView } from 'react-intersection-observer';
import { ShieldCheck, Camera, Home ,Landmark, Search, Factory, Car, PartyPopper, HardHat, ShoppingBag, UserCheck, Lock, Building } from 'lucide-react';
import Image from 'next/image';

const services = [
  {
    icon: PartyPopper,
    title: 'Event Security',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    description: 'At Sachin Security, we develop specialized security plans specifically tailored for every special event. These plans are carried out in collaboration with event organizers, local law enforcement agencies, and emergency services, ensuring seamless coordination. Our personnel handle ticket validation, access control, and crowd management.',
    link: 'https://sachinsecurity.co.in/event-security/'
  },
  {
    icon: HardHat,
    title: 'Construction Site Security',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
    description: 'Check credentials of people accessing the construction site and record time of entry and departure. Report to supervisor on any fire hazards, machine or equipment malfunctioning, utility services interruption, leaking pipes and unlocked security doors. Protect the site against fire, theft, vandalism, and illegal entry.',
    link: 'https://sachinsecurity.co.in/#'
  },
  {
    icon: ShoppingBag,
    title: 'Retail Security',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    description: 'We prioritize the client\'s requirements and consider factors such as the type of business they operate, the nature of their products or inventory, the length of time the premises remain unoccupied, the location of the establishment, and the history of offences on the premises.',
    link: 'https://sachinsecurity.co.in/retail-security/'
  },
  {
    icon: UserCheck,
    title: 'VIP Security',
    image: '/vip.jpg',
    description: 'Throughout the duration of the event, our highly trained and experienced staff operate seamlessly as a cohesive team, maintaining constant vigilance and surveillance to promptly identify and respond to any security threats that may emerge.',
    link: 'https://sachinsecurity.co.in/vip-security/'
  },
  {
    icon: Lock,
    title: 'Private Security',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&q=80',
    description: 'Whether it be a restaurant, hotel, retail or wholesale establishment, or any other field, we possess a team of skilled personnel with extensive audit training who can provide the necessary aid. We can deploy seasoned investigators who will uncover the truth.',
    link: 'https://sachinsecurity.co.in/#'
  },
  {
    icon: Building,
    title: 'Corporate Security Services',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    description: 'We offer Corporate Security Services in Vadodara to all Corporates, offices, IT companies and Commercial Establishments. Our Security guards are fully trained. With almost 1.5 decades of experience in Corporate Security services, we understand the needs of corporate.',
    link: 'https://sachinsecurity.co.in/corporate-security-services/'
  },
  {
    icon: Camera,
    title: 'CCTV Monitoring',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80',
    description: '24/7 surveillance with advanced monitoring systems. Professional monitoring center with trained operators providing real-time surveillance, incident detection, and immediate response coordination.',
    link: '#'
  },
  {
    icon: Search,
    title: 'Investigation Services',
    image: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?w=800&q=80',
    description: 'Professional investigation and intelligence gathering services. Our experienced investigators conduct thorough background checks, fraud investigations, and corporate due diligence with discretion and accuracy.',
    link: '#'
  },
  {
  icon: Factory, // from lucide-react
  title: 'Industrial Security',
  image: '/factory.jpg',
  description: 'Specialized security solutions for manufacturing facilities, warehouses, and industrial plants. Our trained guards monitor production areas, manage access control, prevent theft, and ensure workplace safety compliance with 24/7 surveillance and regular patrol rounds.',
  link: '#'
},
{
icon: ShieldCheck, // from lucide-react
title: 'Armed / Unarmed Guard',
image: '/armunarm.jpg',
description: 'Professional armed and unarmed security personnel deployed based on your specific requirements. All guards undergo rigorous training, background verification, and are licensed according to state regulations. Available for static posts and mobile assignments.',
link: '#'
},
{
icon: Home, // from lucide-react
title: 'Gated Community',
image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
description: 'Comprehensive security services for residential communities, apartments, and housing societies. Our services include gate access control, visitor management, CCTV monitoring, patrolling, emergency response, and maintaining peaceful residential environment round-the-clock.',
link: '#'
},
{
icon: Landmark, // from lucide-react
title: 'Bank Escorts',
image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&q=80',
description: 'Trained armed security personnel for cash-in-transit operations, ATM replenishment, and valuable asset transportation. Our escorts follow strict protocols, coordinate with bank officials, and ensure safe delivery with real-time tracking and communication.',
link: '#'
}
];

export default function Services() {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="services" className="py-24 bg-slate-900 relative overflow-hidden">
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
                <a
                  href={service.link}
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
                </a>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <a
            href="#contact"
            className="inline-block bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)]"
          >
            Request a Free Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
