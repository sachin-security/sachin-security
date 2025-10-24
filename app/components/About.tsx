// components/About.tsx
'use client';

import { useInView } from 'react-intersection-observer';
import { Shield, Award, Users, Clock, CheckCircle } from 'lucide-react';

export default function About() {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: contentRef, inView: contentInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="about" className="py-2 bg-slate-900 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex justify-center mb-6">
            <Shield className="w-16 h-16 text-amber-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Welcome to{' '}
            <span className="bg-linear-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              SACHIN SECURITY SERVICES
            </span>
          </h2>
          <p className="text-xl text-amber-400 font-semibold">Pvt. Ltd.</p>
        </div>

        {/* Main Content */}
        <div
          ref={contentRef}
          className={`max-w-5xl mx-auto mb-20 transition-all duration-1000 delay-200 ${
            contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-linear-to-br from-slate-800 to-slate-900 p-8 md:p-12 rounded-2xl border border-amber-400/20 shadow-xl">
            <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
              <p>
                <span className="text-amber-400 font-semibold">SACHIN SECURITY SERVICES Pvt. Ltd.</span> is a private independent provider in Industries, corporate, retail, Construction, etc. field's detective and complete security solutions.
              </p>
              
              <p>
                The company was established in <span className="text-amber-400 font-semibold">1996</span> by specialists in this field with years of experience for fulfilling the aim of providing security and detective services in and life the fields. The company is dedicated towards delivering new standards of security and surveillance support that far exceeds the expectation of our clients.
              </p>
              
              <p>
                SACHIN SECURITY SERVICES Pvt. Ltd. takes pride in effective solutions in the field of security and detective services and provides a blend of specialized services which includes uniformed guarding services, female guards, etc.
              </p>
              
              <p>
                We have built our reputation on the skill and integrity of the security and detective operatives and technicians, all of whom have been vetted and selected for their professional competence and highest levels of honesty.
              </p>
              
              <div className="bg-amber-400/10 border-l-4 border-amber-400 p-6 rounded-r-xl mt-8">
                <p className="text-white font-semibold text-xl italic">
                  "We are always on guard for your family and business"
                </p>
              </div>
              
              <p>
                With the endeavor to be a pioneering service provider, we progressiveness and productivity in all our operations for effectively securing your today and tomorrow.
              </p>
            </div>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div
          ref={statsRef}
          className={`transition-all duration-1000 delay-300 ${
            statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-amber-400">
            What Makes Us Different!
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Clock,
                title: '24/7 Constant Support',
                description: 'Round-the-clock monitoring and rapid response'
              },
              {
                icon: Award,
                title: 'Qualified Security Professionals',
                description: 'Highly trained and certified experts'
              },
              {
                icon: Shield,
                title: 'Latest Equipment',
                description: 'State-of-the-art security technology'
              },
              {
                icon: CheckCircle,
                title: '25+ Years Experience',
                description: 'Trusted since 1996 in security field'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="group bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-amber-400/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]"
              >
                <div className="w-14 h-14 mb-4 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-white mb-2 text-lg">{item.title}</h4>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ISO Certification Badge */}
        <div className="text-center mt-16">
          <div className="inline-block bg-linear-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/50 px-8 py-4 rounded-full">
            <p className="text-amber-400 font-bold text-lg">
              ISO 9001:2015 Certified Company
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
