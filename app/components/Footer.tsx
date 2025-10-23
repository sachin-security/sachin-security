// components/Footer.tsx
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const expertise = [
    'Corporate Houses',
    'Industries | Factories',
    'Hospital | Nursing homes',
    'Hotels | Guest Houses',
    'Banks | ATMs',
    'Detective Services'
  ];

  const services = [
    'Industrial Security',
    'Corporate Security',
    'Private Security',
    'Armed / Unarmed Guard',
    'Retail Security',
    'Construction Security',
    'Gated Community',
    'Event Security',
    'Bank Escorts'
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Us Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-10 h-10 text-amber-400" />
              <h3 className="text-xl font-bold text-white">ABOUT US</h3>
            </div>
            <h4 className="font-bold text-amber-400 mb-3">
              SACHIN SECURITY SERVICES PVT. LTD.
            </h4>
            <div className="bg-amber-400/10 border border-amber-400/30 px-4 py-2 rounded-lg mb-4 inline-block">
              <p className="text-amber-400 text-sm font-semibold">
                ISO 9001:2015 Certified Company
              </p>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              We have our wide presence in the States of UP, MP, Gujarat, Rajasthan and UT besides the state of Gujarat.
            </p>
          </div>

          {/* Our Expertise */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">OUR EXPERTISE</h3>
            <ul className="space-y-3">
              {expertise.map((item, index) => (
                <li key={index} className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Services Offered */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">SERVICES OFFERED</h3>
            <ul className="space-y-3">
              {services.map((item, index) => (
                <li key={index} className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">CONTACT US</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    <span className="font-semibold text-white">Corporate Office:</span>
                    <br />
                    410, 411, Oneindiabulls,
                    <br />
                    Nr. Jetalpur Over Bridge,
                    <br />
                    Jetalpur, Vadodara - 390007
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-amber-400" />
                <a href="tel:+916357889701" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">
                  +91 6357889701
                </a>
              </div>

              <div className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-amber-400" />
                <a href="mailto:info@sachinsecurity.co.in" className="text-slate-400 hover:text-amber-400 transition-colors text-sm break-all">
                  info@sachinsecurity.co.in
                </a>
              </div>

              <div className="flex gap-3 items-center">
                <Shield className="w-5 h-5 text-amber-400" />
                <a href="https://www.sachinsecurity.co.in" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">
                  www.sachinsecurity.co.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 hover:bg-amber-400 flex items-center justify-center text-slate-400 hover:text-slate-950 transition-all duration-300 hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 hover:bg-amber-400 flex items-center justify-center text-slate-400 hover:text-slate-950 transition-all duration-300 hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 hover:bg-amber-400 flex items-center justify-center text-slate-400 hover:text-slate-950 transition-all duration-300 hover:scale-110">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 hover:bg-amber-400 flex items-center justify-center text-slate-400 hover:text-slate-950 transition-all duration-300 hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-slate-400 text-sm text-center">
              © {new Date().getFullYear()} Sachin Security Services Pvt. Ltd. All rights reserved.
            </p>

            {/* Quick Links */}
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
