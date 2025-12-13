'use client';

import { useInView } from 'react-intersection-observer';
import { Download, Monitor, Activity, Camera, Lock, ShieldCheck, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ITSectionProps {
  headerRef?: React.RefObject<HTMLDivElement>;
  contentRef?: React.RefObject<HTMLDivElement>;
  headerInView?: boolean;
  contentInView?: boolean;
}

export default function ITSection({ 
  headerRef, 
  contentRef, 
  headerInView = false, 
  contentInView = false 
}: ITSectionProps) {
  const [imageRef, imageInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section id="it-security" className="py-4 bg-slate-900 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-400/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-80 translate-y-10'
          }`}
        >
          <div className="flex justify-center mb-6">
            <ShieldCheck className="w-16 h-16 text-amber-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Advanced{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              IT Security & Monitoring
            </span>
          </h2>
          <p className="text-xl text-amber-400 font-semibold max-w-2xl mx-auto">
            24/7 Digital Protection with Centralized CCTV Monitoring & Real-time Threat Detection [web:5][web:6]
          </p>
        </div>

        {/* Main Content - Two Columns */}
        <div
          ref={contentRef}
          className={`max-w-7xl mx-auto mb-16 sition-all duration-1000 delay-200 ${
            contentInView ? 'opacity-100 translate-y-0' : 'opacity-80 translate-y-10'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Content */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-amber-400/20 shadow-xl space-y-6">
              <div className="text-slate-300 leading-relaxed space-y-2">
                <div className="flex items-center gap-3 p-8 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <Monitor className="w-8 h-8 text-amber-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Centralized Monitoring Centers</h3>
                    <p className="text-amber-300">Trained operators ensure instant detection and response to incidents [web:5]</p>
                  </div>
                </div>

                <p className="text-lg">
                  Sachin Security Services provides comprehensive IT security solutions featuring{' '}
                  <span className="text-amber-400 font-semibold">real-time CCTV surveillance</span> and advanced monitoring systems 
                  for industries, corporate offices, and retail environments.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-slate-700/50 rounded-xl border-l-4 border-amber-400">
                    <Activity className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">24/7 Threat Monitoring</h4>
                      <p className="text-sm text-slate-400">Continuous surveillance with rapid response capabilities [web:6]</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-700/50 rounded-xl border-l-4 border-amber-400">
                    <Lock className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">Access Control Systems</h4>
                      <p className="text-sm text-slate-400">Secure entry points and credential verification [web:12]</p>
                    </div>
                  </div>
                </div>

                {/* <div className="bg-gradient-to-r from-amber-500/10 to-amber-400/10 border border-amber-400/30 p-6 rounded-2xl">
                  <p className="text-white font-semibold text-lg italic text-center">
                    "Advanced technology meets expert vigilance - protecting your digital assets around the clock" [web:6]
                  </p>
                </div> */}

                <div className="pt-1 border-t border-slate-700/50">
                  <p className="text-amber-400 font-semibold">
                    Trusted since 1996 with ISO 9001:2015 certification for quality assured IT security services [web:6]
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Feature Cards */}
            <div className="space-y-4 lg:sticky lg:top-8">
              <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-amber-400/20 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Camera className="w-6 h-6 text-amber-400" />
                  Our IT Security Services
                </h3>
                
                <div className="space-y-3">
                  {[
                    { icon: Camera, title: "CCTV Surveillance", desc: "Advanced camera systems with AI analytics", color: "from-blue-500/20 to-cyan-500/20" },
                    { icon: AlertCircle, title: "Real-time Alerts", desc: "Instant notifications for security events", color: "from-red-500/20 to-orange-500/20" },
                    { icon: ShieldCheck, title: "Access Management", desc: "Biometric & RFID entry control systems", color: "from-emerald-500/20 to-teal-500/20" },
                    { icon: Clock, title: "24/7 Monitoring", desc: "Round-the-clock centralized operations", color: "from-amber-500/20 to-yellow-500/20" },
                    { icon: CheckCircle, title: "Compliance Ready", desc: "ISO certified security protocols", color: "from-purple-500/20 to-violet-500/20" }
                  ].map((service, index) => (
                    <div
                      key={index}
                      ref={index === 0 ? imageRef : undefined}
                      className={`group p-4 rounded-xl border border-slate-700/50 hover:border-amber-400/50 transition-all duration-300 hover:shadow-amber/10 hover:scale-[1.02] hover:-translate-y-1 ${
                        imageInView ? `delay-${(index + 1) * 100} opacity-100 translate-y-0` : 'opacity-0 translate-y-4'
                      } bg-gradient-to-r ${service.color} hover:shadow-lg`}
                    >
                      <div className="flex items-start gap-3">
                        <service.icon className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-white mb-1">{service.title}</h4>
                          <p className="text-sm text-slate-300">{service.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-16">
            <a
            href="/IT-docs.pdf"
            download="Sachin-Security-IT-Services-Brochure.pdf"
            className=" flex flex-row justify-center text-amber-500 px-8 py-2 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] focus:outline-none focus:ring-4 focus:ring-amber-400/50"
            > < Download/> <span>Brochure</span>
            </a>
        </div>
      </div>
    </section>
  );
}
