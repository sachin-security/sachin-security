// components/About.tsx
'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Shield, Award, Users, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

// Images for carousel
const carouselImages = [
  {
    src: '/carousel1/sachinsecurity-pic-4.jpeg',
    alt: 'Corporate Security Services',
    caption: 'Highly Trained'
  },
  {
    src: '/carousel1/sachinsecurity-pic-2.jpeg',
    alt: 'Industrial Security',
    caption: 'Always Ready'
  },
  {
    src: '/carousel1/sachinsecurity-pic-7.jpeg',
    alt: 'Security Patrol',
    caption: 'Always Secure'
  }
];

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    setIsAutoPlaying(false);
  };

  return (
    <section id="about" className="py-20 bg-slate-900 relative overflow-hidden">
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
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              SACHIN SECURITY SERVICES
            </span>
          </h2>
          <p className="text-xl text-amber-400 font-semibold">Pvt. Ltd.</p>
        </div>

        {/* Main Content - Two Columns */}
        <div
          ref={contentRef}
          className={`max-w-7xl mx-auto mb-20 transition-all duration-1000 delay-200 ${
            contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Content */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 md:p-10 rounded-2xl border border-amber-400/20 shadow-xl">
              <div className="space-y-6 text-slate-300 leading-relaxed">
                <p className="text-lg">
                  <span className="text-amber-400 font-semibold">SACHIN SECURITY SERVICES Pvt. Ltd.</span> <span className="text-amber-400 font-bold p-2 bg-amber-400/10 rounded-full">
                    ISO 9001:2015 Certified</span> is a private independent provider in Industries, corporate, retail, Construction, etc. field's detective and complete security solutions.
                </p>
                
                <p>
                  The company was established in <span className="text-amber-400 font-semibold">1996</span> by specialists in this field with years of experience for fulfilling the aim of providing security and detective services in and life the fields.
                </p>
                
                <p>
                  SACHIN SECURITY SERVICES Pvt. Ltd. takes pride in effective solutions in the field of security and detective services and provides a blend of specialized services which includes uniformed guarding services, female guards, etc.
                </p>
                
                <p>
                  We have built our reputation on the skill and integrity of the security and detective operatives and technicians.
                </p>
                
                <div className="bg-amber-400/10 border-l-4 border-amber-400 p-6 rounded-r-xl mt-2">
                  <p className="text-white font-semibold text-lg italic">
                    "We are always on guard for your family and business"
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Image Carousel */}
            <div className="lg:sticky lg:top-8">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-amber-400/20 bg-slate-950">
                {/* Carousel Images */}
                <div className="relative h-[500px] md:h-[600px]">
                  {carouselImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-700 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                      
                      {/* Caption */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-white font-semibold text-xl drop-shadow-lg">
                          {image.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 hover:bg-slate-800 rounded-full backdrop-blur-sm transition-all group"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-white group-hover:text-amber-400 transition-colors" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-slate-900/80 hover:bg-slate-800 rounded-full backdrop-blur-sm transition-all group"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-white group-hover:text-amber-400 transition-colors" />
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentSlide(index);
                        setIsAutoPlaying(false);
                      }}
                      className={`transition-all ${
                        index === currentSlide
                          ? 'w-8 h-2 bg-amber-400'
                          : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                      } rounded-full`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
                  <p className="text-white text-sm font-medium">
                    {currentSlide + 1} / {carouselImages.length}
                  </p>
                </div>
              </div>
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
                <div className="w-14 h-14 mb-4 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-white mb-2 text-lg">{item.title}</h4>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
