"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Award, 
  Clock, 
  Shield, 
  Wrench, 
  Globe,
  Settings,
  Phone,
  Mail,
  Zap
} from 'lucide-react';

const Aboutus = () => {
  const stats = [
    { icon: Clock, number: "15+", label: "Years Experience", color: "text-yellow-500" },
    { icon: Users, number: "200+", label: "Happy Clients", color: "text-yellow-500" },
    { icon: Wrench, number: "1,000+", label: "Systems Serviced", color: "text-yellow-500" },
    { icon: Globe, number: "UAE", label: "Based & Serving", color: "text-yellow-500" }
  ];

  const services = [
    {
      icon: Settings,
      title: "Installation & Commissioning",
      description: "Complete professional installation and commissioning services for industrial and mobile cranes with expert precision.",
      color: "bg-yellow-50 text-yellow-600"
    },
    {
      icon: Wrench,
      title: "Testing & Maintenance",
      description: "Comprehensive testing protocols and regular maintenance services to ensure optimal crane performance and safety.",
      color: "bg-gray-50 text-gray-800"
    },
    {
      icon: Zap,
      title: "LMI Systems Repair",
      description: "Specialized repair and programming services for all kinds of Load Moment Indicator (LMI) systems for mobile cranes.",
      color: "bg-yellow-50 text-yellow-600"
    },
    {
      icon: Shield,
      title: "Safe Load Indicator Systems",
      description: "Universal Safe Load Indicator System installation and maintenance for all mobile crane types and brands.",
      color: "bg-gray-50 text-gray-800"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .gradient-bg {
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 30%, #2d2d2d 70%, #000000 100%);
        }

        .yellow-gradient-bg {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
        }
      `}</style>

      {/* hero section  */}
      <section className="relative gradient-bg text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-10 left-10 w-20 h-1 bg-yellow-400 rounded-full" style={{animation: 'slideInLeft 1s ease-out 0.5s both'}}></div>
        <div className="absolute top-16 right-10 text-yellow-400 text-sm font-mono opacity-90" style={{animation: 'slideInRight 1s ease-out 0.7s both'}}>
          [ AL JAZEERA ELECT.DEVICES TR. ]
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl" style={{animation: 'fadeInUp 0.8s ease-out 0.3s both'}}>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight text-white">
              About Us
            </h1>
            
            <div className="space-y-6 text-lg md:text-xl leading-relaxed mb-10">
              <p className="text-gray-200">
                <strong className="text-yellow-400">Al Jazeera Elect. Devices Tr.</strong> is a professional Crane service company 
                dedicated to providing complete installation, commissioning, testing, repair 
                & maintenance services for industrial and Mobile Cranes
              </p>
              
              <p className="text-gray-200">
                We repairing and programming all kind of LMI Systems for mobile Cranes.
              </p>
              
              <p className="text-gray-200">
                We specialize in providing Universal Safe load indicator System for all 
                Mobile Cranes
              </p>
            </div>
            
            <button className="inline-flex items-center px-8 py-4 bg-yellow-400 text-black font-semibold text-lg rounded-lg hover:bg-yellow-500 hover:text-black transition-all duration-300 transform hover:scale-105 shadow-lg"
                    style={{animation: 'fadeInUp 0.8s ease-out 0.9s both'}}>
              <Mail className="w-5 h-5 mr-2" />
              SEND ENQUIRY
            </button>
          </div>
        </div>
      </section>

      {/* icons  */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center fade-in-on-scroll transform hover:scale-105 transition-all duration-300"
                style={{animation: `scaleIn 0.8s ease-out ${index * 0.2}s both`}}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400 mb-4">
                  <stat.icon className="w-8 h-8 text-black" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* why choose us */}
      <section className="py-20 yellow-gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" style={{animation: 'fadeInUp 0.8s ease-out'}}>
            <h2 className="text-4xl font-bold mb-4 text-black">Why Choose Al Jazeera Elect. Devices?</h2>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Professional expertise and proven track record in crane electronic systems
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300" style={{animation: 'fadeInUp 0.8s ease-out 0.2s both'}}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black mb-6">
                <Award className="w-10 h-10 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Professional Excellence</h3>
              <p className="text-gray-700 leading-relaxed">
                Certified technicians with extensive experience in crane electronic systems and safety equipment
              </p>
            </div>

            <div className="text-center bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300" style={{animation: 'fadeInUp 0.8s ease-out 0.4s both'}}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black mb-6">
                <Shield className="w-10 h-10 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Safety First</h3>
              <p className="text-gray-700 leading-relaxed">
                Comprehensive safety protocols and universal load indicator systems for maximum operational safety
              </p>
            </div>

            <div className="text-center bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300" style={{animation: 'fadeInUp 0.8s ease-out 0.6s both'}}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black mb-6">
                <Clock className="w-10 h-10 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Reliable Service</h3>
              <p className="text-gray-700 leading-relaxed">
                Fast response times and dependable maintenance services to minimize equipment downtime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* contact */}
      <section className="gradient-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6" style={{animation: 'fadeInUp 0.8s ease-out'}}>
              Ready to Service Your Cranes?
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed" style={{animation: 'fadeInUp 0.8s ease-out 0.2s both'}}>
              Contact our expert team for professional crane electronic systems installation, 
              maintenance, and repair services. We're here to ensure your equipment operates safely and efficiently.
            </p>
            <div className="flex flex-wrap justify-center gap-6" style={{animation: 'fadeInUp 0.8s ease-out 0.4s both'}}>
              <button className="flex items-center gap-3 bg-yellow-400 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Phone className="w-6 h-6" />
                Call Us Now
              </button>
              <button className="flex items-center gap-3 bg-transparent border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all duration-300 transform hover:scale-105">
                <Mail className="w-6 h-6" />
                Send Enquiry
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Aboutus;