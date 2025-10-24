// app/services/[slug]/page.tsx
'use client';

import { useInView } from 'react-intersection-observer';
import services from "@/app/data/services";
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, ArrowRight, Shield, Star } from 'lucide-react';
import Link from 'next/link';

// Define the type for params
interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      {/* Hero Section with Overlay */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Background Image with Overlay */}
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover opacity-80"
            priority
          />

        {/* Hero Content */}
        <div className="container bg-slate-400/25 mx-auto px-6 relative z-10 pt-28 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon Badge */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-amber-500 to-amber-600 mb-6 shadow-[0_0_40px_rgba(251,191,36,0.4)]">
              <service.icon className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-linear-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
              {service.title}
            </h1>

            {/* Short Description */}
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              {service.shortDescription}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="group bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] flex items-center justify-center gap-2"
              >
                Get a Free Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="tel:+916357889701"
                className="border-2 border-amber-400 hover:bg-amber-400/10 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 text-white"
              >
                Call Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 md:py-24 bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Description Card */}
            <DescriptionSection description={service.description} />

            {/* Features & Benefits Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              <FeaturesSection features={service.features} />
              <BenefitsSection benefits={service.benefits} />
            </div>

            {/* Industries Section */}
            <IndustriesSection industries={service.industries} />

            {/* Why Choose Us */}
            <WhyChooseUsSection />

            {/* Final CTA */}
            <FinalCTA serviceTitle={service.title} />
          </div>
        </div>
      </section>
    </>
  );
}

// Description Section Component
function DescriptionSection({ description }: { description: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`mb-16 transition-all duration-1000 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="bg-linear-to-br from-slate-800 to-slate-950 p-8 md:p-12 rounded-2xl border border-amber-400/20 shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-amber-400 mb-6">
          About This Service
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

// Features Section Component
function FeaturesSection({ features }: { features: string[] }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
      }`}
    >
      <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Key Features
          </h2>
        </div>
        <ul className="space-y-4">
          {features.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 group hover:translate-x-2 transition-transform duration-300"
            >
              <CheckCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <span className="text-slate-300 leading-relaxed text-lg">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Benefits Section Component
function BenefitsSection({ benefits }: { benefits: string[] }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 delay-200 ${
        inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
      }`}
    >
      <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Benefits
          </h2>
        </div>
        <div className="space-y-4">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">
                  {index + 1}
                </span>
              </div>
              <span className="text-slate-300 leading-relaxed text-lg">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Industries Section Component
function IndustriesSection({ industries }: { industries: string[] }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`mb-16 transition-all duration-1000 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Industries We Serve
        </h2>
        <p className="text-slate-400 text-lg">
          Trusted across diverse sectors
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {industries.map((item, index) => (
          <div
            key={index}
            className="group bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-amber-400/50 transition-all duration-300 hover:scale-105 text-center"
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <div className="w-3 h-3 flex items-center p-2 font-bold justify-center  rounded-full bg-amber-400 mx-auto mb-3 group-hover:scale-150 transition-transform duration-300" >{index+1}</div>
            <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Why Choose Us Section
function WhyChooseUsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const reasons = [
    { title: '25+ Years Experience', desc: 'Trusted since 1996' },
    { title: 'ISO Certified', desc: 'Quality assured services' },
    { title: '24/7 Support', desc: 'Always available' },
    { title: 'Trained Professionals', desc: 'Vetted & certified staff' }
  ];

  return (
    <div
      ref={ref}
      className={`mb-16 transition-all duration-1000 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="bg-linear-to-br from-slate-900 to-slate-950 p-8 md:p-12 rounded-2xl border border-amber-400/30">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-400 mb-10">
          Why Choose Sachin Security?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="text-center p-6 bg-slate-950/50 rounded-xl hover:bg-slate-950 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500 mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">✓</span>
              </div>
              <h3 className="font-bold text-white mb-2">{reason.title}</h3>
              <p className="text-slate-400 text-sm">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Final CTA Section
function FinalCTA({ serviceTitle }: { serviceTitle: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-r from-amber-500 to-amber-600" />
        
        {/* Content */}
        <div className="relative z-10 p-8 md:p-12 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Secure Your {serviceTitle.replace(' Security', '')}?
          </h3>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and customized security solution tailored to your needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="bg-slate-950 hover:bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Get Free Consultation
            </Link>
            <Link
              href="tel:+916357889701"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Call: +91 6357889701
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
