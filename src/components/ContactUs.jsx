"use client";
import React from 'react';
import { 
  Phone, 
  Mail
} from 'lucide-react';

const ContactUs = () => {

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Numbers",
      details: [
        "+971 50 586 2853 (Ravi)",
        "+971 55 151 0742"
      ],
      color: "text-yellow-400"
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: [
        "jazeeraaelectricdevice@gmail.com",
        "ravinathnair@gmail.com"
      ],
      color: "text-yellow-400"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .gradient-bg {
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 30%, #2d2d2d 70%, #000000 100%);
        }

        .yellow-gradient-bg {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative gradient-bg text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-10 left-10 w-20 h-1 bg-yellow-400 rounded-full animate-slide-in-left"></div>
        <div className="absolute top-16 right-10 text-yellow-400 text-sm font-mono opacity-90 animate-slide-in-right">
          [ AL JAZEERA ELECT.DEVICES TR. ]
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight text-white">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Get in touch with our expert team for professional crane electronic systems services. 
              We're here to help with all your crane safety and maintenance needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`}}
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-black mb-4 mx-auto">
                  <info.icon className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-black mb-4 text-center">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-700 text-center text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 yellow-gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-black mb-6 text-center">Our Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-black">Installation & Commissioning</h4>
                  <p className="text-gray-600 text-sm">Professional installation of crane electronic systems</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-black">Testing & Maintenance</h4>
                  <p className="text-gray-600 text-sm">Comprehensive testing and regular maintenance services</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-black">LMI Systems Repair</h4>
                  <p className="text-gray-600 text-sm">Specialized Load Moment Indicator system repairs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-black">Safe Load Indicator Systems</h4>
                  <p className="text-gray-600 text-sm">Universal safety systems for all crane types</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="gradient-bg py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Contact Al Jazeera Elect. Devices for professional crane electronic systems services across the UAE.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:jazeeraaelectricdevice@gmail.com" className="bg-yellow-400 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-colors transform hover:scale-105">
              Send Email
            </a>
            <a href="tel:+971505862853" className="bg-transparent border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 hover:text-black transition-colors transform hover:scale-105">
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;