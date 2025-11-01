// components/Contact.tsx
'use client';

import { useState, useEffect ,Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';


export default function SuspenseWrapper() {
  return <Suspense fallback={<>Loading...</>}><Contact/></Suspense>;
}
  function Contact() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  // Auto-fill message from URL parameter
  useEffect(() => {
    const messageParam = searchParams?.get('message');
    const subjectParam = searchParams?.get('subject');
    
    if (messageParam) {
      setFormData(prev => ({
        ...prev,
        message: decodeURIComponent(messageParam)
      }));
    }
    
    if (subjectParam) {
      setFormData(prev => ({
        ...prev,
        subject: decodeURIComponent(subjectParam)
      }));
    }
  }, [searchParams]);

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone validation (optional but if provided should be valid)
    if (formData.phone && !/^[+]?[\d\s-()]{10,}$/.test(formData.phone)) {
      setError('Please enter a valid phone number');
      return false;
    }

    if (!formData.subject.trim()) {
      setError('Subject is required');
      return false;
    }

    // if (!formData.message.trim()) {
    //   setError('Message is required');
    //   return false;
    // }

    // if (formData.message.length < 10) {
    //   setError('Message must be at least 10 characters long');
    //   return false;
    // }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setError('Failed to send message. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-white"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-white"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-white"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-white"
                  placeholder="How can we help you?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Message 
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-white"
                  placeholder="Tell us about your security needs..."
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formData.message.length} / 1000 characters
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-6 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
            {/* Error Message */}
            {error && (
              <div className="my-2  bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-400 mb-1">Error</h3>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
             )}
            {/* Success Message */}
            {success && (
              <div className="mt-2 bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-400 mb-1">Message Sent!</h3>
                  <p className="text-green-300 text-sm">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Contact Info & Map */}
          <div className="space-y-8 fade-in">
            <div className="space-y-6">
              <div className="flex gap-4 items-start bg-slate-950 p-6 rounded-xl border border-slate-800">
                <Phone className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-white">Phone</h3>
                  <a href="tel:+916357889701" className="text-slate-400 hover:text-amber-400 transition-colors">
                    +91 6357889701
                  </a>
                  <br />
                  <a href="tel:+919825011131" className="text-slate-400 hover:text-amber-400 transition-colors">
                    +91 9537594397
                  </a>
                </div>
              </div>
              
              <div className="flex gap-4 items-start bg-slate-950 p-6 rounded-xl border border-slate-800">
                <Mail className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-white">Email</h3>
                  <a href="mailto: info@sachinsecurity.co.in" className="text-slate-400 hover:text-amber-400 transition-colors">
                    info@sachinsecurity.co.in
                  </a>
                </div>
              </div>
              
              <div className="flex gap-4 items-start bg-slate-950 p-6 rounded-xl border border-slate-800">
                <MapPin className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-white">Office</h3>
                  <p className="text-slate-400">
                    401, One Indiabulls Park, Jetalpur Rd<br />
                    Vadodara - 390007, Gujarat, India
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
                <h3 className="font-semibold text-lg mb-3 text-white">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monday - Saturday:</span>
                    <span className="text-white">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sunday:</span>
                    <span className="text-white">Closed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Emergency:</span>
                    <span className="text-amber-400">24/7 Available</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Google Map */}
            <div className="w-full h-80 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.5234567890!2d73.1812345!3d22.3072345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDE4JzI2LjAiTiA3M8KwMTAnNTIuNSJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
