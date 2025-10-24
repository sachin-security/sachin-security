// components/AboutUsPage.tsx
'use client';

import { useInView } from 'react-intersection-observer';
import { Shield, Award, Users, Clock, CheckCircle, Calendar, MapPin, Building2, FileText, Scale } from 'lucide-react';
import Image from 'next/image';

export default function AboutUsPage() {
  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div className="bg-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[linear-linear(to_right,#4f4f4f1a_1px,transparent_1px),linear-linear(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px]" />
        
        <div
          ref={heroRef}
          className={`container mx-auto px-6 relative z-10 text-center transition-all duration-1000 ${
            heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex justify-center mb-8">
            <Shield className="w-20 h-20 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
            About Sachin Security Services
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Professional Security Experts Since 1996
          </p>
          <div className="inline-block bg-linear-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/50 px-8 py-4 rounded-full">
            <p className="text-amber-400 font-bold text-lg">
              ISO 9001:2015 Certified Company
            </p>
          </div>
        </div>
      </section>

      {/* Company History */}
      <CompanyHistory />
      
      {/* Mission & Vision */}
      <MissionVision />
      
      {/* Company Presence */}
      <CompanyPresence />
      
      {/* Organizational Chart */}
      <OrganizationalChart />
      
      {/* Certifications & Memberships */}
      <Certifications />
      
      {/* Terms & Conditions */}
      <TermsConditions />
    </div>
  );
}

// Company History Component
function CompanyHistory() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const timeline = [
    {
      year: '1996',
      title: 'Foundation',
      description: 'SACHIN SECURITY SERVICES Pvt. Ltd. was established by specialists with years of experience in security and detective services.'
    },
    {
      year: '2008',
      title: 'ISO Certification',
      description: 'Achieved ISO 9001:2008 certification, demonstrating commitment to quality management systems.'
    },
    {
      year: '2015',
      title: 'ISO 9001:2015',
      description: 'Upgraded to ISO 9001:2015 certification, maintaining world-class quality standards.'
    },
    {
      year: '2020+',
      title: 'Multi-State Expansion',
      description: 'Expanded presence across Gujarat, Uttar Pradesh, Madhya Pradesh, and Rajasthan with licensed operations.'
    }
  ];

  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-amber-400">Our Journey</h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Nearly 3 decades of excellence in security services
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-amber-400/30 hidden md:block" />

            {timeline.map((item, index) => {
              const { ref: itemRef, inView: itemInView } = useInView({
                triggerOnce: true,
                threshold: 0.2,
              });

              return (
                <div
                  key={index}
                  ref={itemRef}
                  className={`relative mb-12 transition-all duration-700 ${
                    itemInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-start gap-8">
                    {/* Year Badge */}
                    <div className="hidden md:flex w-16 h-16 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex-shrink-0 items-center justify-center border-4 border-slate-900 relative z-10">
                      <Calendar className="w-7 h-7 text-white" />
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-amber-400/50 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-3xl font-bold text-amber-400">{item.year}</span>
                        <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                      </div>
                      <p className="text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Mission & Vision Component
function MissionVision() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-6">
        <div
          ref={ref}
          className={`grid md:grid-cols-2 gap-8 max-w-6xl mx-auto transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Mission */}
          <div className="bg-linear-to-br from-slate-900 to-slate-950 p-8 rounded-2xl border border-amber-400/20">
            <div className="w-16 h-16 mb-6 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-amber-400 mb-4">Our Mission</h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              To make your establishment safe by providing best featured services which let you stay anywhere without the threat or fear of violence, theft, fraud and other illegal and unethical activities.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-linear-to-br from-slate-900 to-slate-950 p-8 rounded-2xl border border-amber-400/20">
            <div className="w-16 h-16 mb-6 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-amber-400 mb-4">Our Vision</h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              With the endeavor to be a pioneering service provider, we bring progressiveness and productivity in all our operations for effectively securing your today and tomorrow.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mt-16 grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: Users, title: 'Professional Competence', desc: 'Vetted and selected experts' },
            { icon: CheckCircle, title: 'Integrity', desc: 'Highest levels of honesty' },
            { icon: Award, title: 'Quality Service', desc: 'ISO certified standards' },
            { icon: Clock, title: '24/7 Support', desc: 'Round-the-clock vigilance' }
          ].map((value, index) => (
            <div key={index} className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center hover:border-amber-400/50 transition-all duration-300">
              <value.icon className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h4 className="font-bold text-white mb-2">{value.title}</h4>
              <p className="text-slate-400 text-sm">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Company Presence Component
function CompanyPresence() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const states = [
    { name: 'Gujarat', license: 'License No: GJ/BD/21618', color: 'from-amber-500 to-yellow-600' },
    { name: 'Uttar Pradesh', license: 'License No: 191164', color: 'from-amber-600 to-orange-600' },
    { name: 'Madhya Pradesh', license: 'License No: N-186/16', color: 'from-yellow-500 to-amber-500' },
    { name: 'Rajasthan', license: 'Licensed Operations', color: 'from-amber-500 to-yellow-500' }
  ];

  return (
    <section className="py-24 bg-slate-900">
      <div className="container mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Our Presence</h2>
          <p className="text-xl text-slate-400">
            Licensed operations across multiple states
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {states.map((state, index) => {
            const { ref: stateRef, inView: stateInView } = useInView({
              triggerOnce: true,
              threshold: 0.2,
            });

            return (
              <div
                key={index}
                ref={stateRef}
                className={`transition-all duration-700 ${
                  stateInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-amber-400/50 transition-all duration-300 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br ${state.color} flex items-center justify-center`}>
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{state.name}</h3>
                  <p className="text-slate-400 text-sm">{state.license}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Registration Details */}
        <div className="mt-16 max-w-4xl mx-auto bg-slate-950 p-8 rounded-2xl border border-slate-800">
          <h3 className="text-2xl font-bold text-amber-400 mb-6 text-center">Official Registrations</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-slate-400 text-sm">Corporate Identity</p>
                  <p className="text-white font-semibold">U7492GJ2010PTC059381</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-slate-400 text-sm">PAN Number</p>
                  <p className="text-white font-semibold">AANCS8807K</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-slate-400 text-sm">GST Number</p>
                  <p className="text-white font-semibold">24AANCS8807K2ZS</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-slate-400 text-sm">ESIC Code</p>
                  <p className="text-white font-semibold">38-28010-101</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Organizational Chart Component
function OrganizationalChart() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-amber-400">
            Organizational Structure
          </h2>
          <p className="text-xl text-slate-400">
            Well-structured hierarchy for efficient operations
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Level 1: Board of Directors */}
          <div className="flex justify-center mb-8">
            <div className="bg-linear-to-br from-amber-500 to-amber-600 p-6 rounded-xl text-center min-w-[200px] shadow-[0_0_30px_rgba(251,191,36,0.3)]">
              <Users className="w-10 h-10 text-white mx-auto mb-2" />
              <h3 className="font-bold text-white text-lg">Board of Directors</h3>
            </div>
          </div>

          {/* Level 2: Management */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-amber-400/30 text-center">
              <h4 className="font-bold text-white mb-1">Human Resource Director</h4>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-amber-400/30 text-center">
              <h4 className="font-bold text-white mb-1">Vice President</h4>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-amber-400/30 text-center">
              <h4 className="font-bold text-white mb-1">Compliance Officer</h4>
            </div>
          </div>

          {/* Level 3: Departments */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 text-center">
              <p className="font-semibold text-amber-400">Information Security</p>
            </div>
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 text-center">
              <p className="font-semibold text-amber-400">Training</p>
            </div>
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 text-center">
              <p className="font-semibold text-amber-400">Branch Managers (1-4)</p>
            </div>
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 text-center">
              <p className="font-semibold text-amber-400">Internal Auditor</p>
            </div>
          </div>

          {/* Level 4: Area Managers */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                <p className="text-slate-300 text-sm">Area Manager {num}</p>
              </div>
            ))}
          </div>

          {/* Level 5: Field Supervisors */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
            <p className="text-slate-400">
              <span className="text-amber-400 font-semibold">Field Supervisors</span> - Operational level personnel managing on-ground security teams
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Certifications Component
function Certifications() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const certifications = [
    { name: 'ISO 9001:2015', desc: 'Quality Management System', icon: Award },
    { name: 'CAPSI Member', desc: 'Central Association of Private Security Industry', icon: Shield },
    { name: 'UDYAM Registered', desc: 'MSME Registration', icon: Building2 },
    { name: 'Multi-State Licenses', desc: 'UP, MP, Gujarat, Rajasthan', icon: MapPin }
  ];

  return (
    <section className="py-24 bg-slate-900">
      <div className="container mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Certifications & Accreditations
          </h2>
          <p className="text-xl text-slate-400">
            Recognized and certified by leading industry bodies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="bg-slate-950 p-8 rounded-xl border border-slate-800 hover:border-amber-400/50 transition-all duration-300 hover:scale-105 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <cert.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-white text-lg mb-2">{cert.name}</h4>
              <p className="text-slate-400 text-sm">{cert.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Terms & Conditions Component
function TermsConditions() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const terms = [
    {
      title: 'Contract Duration',
      content: 'The contract shall be normally for a year at the approved rates agreed upon between the parties. It shall automatically be renewed if not revoked specifically by rendering one month notice or payment in lieu of it by either side.'
    },
    {
      title: 'Shift System',
      content: 'The security staff of this organization shall follow three shift system on duty, round the clock (8 hrs duty and six days in a week).'
    },
    {
      title: 'Payment Terms',
      content: 'The organization shall submit monthly bills at the end of month and the payment should invariably be made by 6th & 7th of subsequent month.'
    },
    {
      title: 'Staff Supervision',
      content: 'The organization reserves the right to control and supervise security staff provided and shall perform duties as per organization\'s standing orders. However, they shall also obey all lawful orders/instructions given by respective executives of principle employer.'
    },
    {
      title: 'Employment Status',
      content: 'All security staff shall always remain on SACHIN SECURITY SERVICES Pvt. Ltd. roll and shall own legal responsibility for their payment and maintenance of wages including overtime, etc.'
    },
    {
      title: 'Non-Recruitment Clause',
      content: 'Security staff provided by our organization shall neither be privately employed nor recruited as security staff by your company during the effective period of contract.'
    },
    {
      title: 'Theft & Investigation',
      content: 'In case of theft/pilferage, this organization shall initiate investigation along with local police/allied authorities after taking due clearance from your company. If any staff is found guilty of negligence/carelessness, immediate legal action shall be taken.'
    },
    {
      title: 'Periodic Inspections',
      content: 'Organization executives shall make surprise/periodic visits to your company by day/night to keep strict vigil on security staff and enhance security system, only after making close liaison with principal employer.'
    },
    {
      title: 'Basic Amenities',
      content: 'To maximize efficiency of staff, management is expected to provide all basic amenities to guards on duty including fan, telephone, torches, wall clock, etc.'
    },
    {
      title: 'Charges & Compliance',
      content: 'Charges are as per minimum wages Act notified by State Govt. which includes statutory benefits like PF, ESIC, gratuity, uniform, bonus and salary even while on leave. All charges are inclusive of all statutory liabilities.'
    }
  ];

  return (

    <section className="py-24 bg-slate-950" id='terms&conditions'>
      <div className="container mx-auto px-6">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Scale className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-amber-400">
            Terms & Conditions
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Standard terms governing our security service agreements
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {terms.map((term, index) => {
            const { ref: termRef, inView: termInView } = useInView({
              triggerOnce: true,
              threshold: 0.1,
            });

            return (
              <div
                key={index}
                ref={termRef}
                className={`bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-amber-400/30 transition-all duration-700 ${
                  termInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{term.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{term.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <div className="mt-12 max-w-5xl mx-auto bg-amber-400/10 border-l-4 border-amber-400 p-6 rounded-r-xl">
          <p className="text-amber-400 font-semibold text-lg">
            <strong>Note:</strong> We have our wide presence in the States of UP, MP, Gujarat, Rajasthan and UT besides the state of Gujarat.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <a
            href="/#contact"
            className="inline-block bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)]"
          >
            Request Detailed Terms Document
          </a>
        </div>
      </div>
    </section>
  );
}
