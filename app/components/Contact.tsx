// components/Contact.tsx
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-amber-400">
            Get In Touch
          </h2>
          <p className="text-xl text-slate-400">
            Let's discuss your security needs
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="fade-in bg-slate-950 p-8 rounded-2xl border border-slate-800">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="Tell us about your security needs..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-6 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)]"
              >
                Send Message
              </button>
            </form>
          </div>
          
          {/* Contact Info & Map */}
          <div className="space-y-8 fade-in">
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <Phone className="w-6 h-6 text-amber-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Phone</h3>
                  <p className="text-slate-400">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <Mail className="w-6 h-6 text-amber-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-slate-400">contact@securitypro.com</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <MapPin className="w-6 h-6 text-amber-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Office</h3>
                  <p className="text-slate-400">123 Security Blvd, Suite 100<br />New York, NY 10001</p>
                </div>
              </div>
            </div>
            
            {/* Google Map Placeholder */}
            <div className="w-full h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9476519598093!2d-73.99185492346168!3d40.74844097138558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9aeb1c6b5%3A0x35b1cfbc89a6097f!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1698234567890!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
