"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, CheckCircle, Users, MapPin, Calendar, Shield, ArrowRight } from 'lucide-react';


const Home = () => {
      const [userType, setUserType] = useState('homeowner');
  return (
       <div className="min-h-screen bg-white">      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your 
                <span className="text-green-600 block">Outdoor Space</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Connect with trusted, vetted landscaping professionals in your area. 
                Get multiple quotes, compare portfolios, and transform your yard into paradise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="\register"
                  className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Find Landscapers
                </Link>
                <Link // TODO: Have to send user type to register
                  href="\register"
                  onClick={() => {setUserType('contractor');}}
                  className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-600 hover:text-white transition-all"
                >
                  Join as Pro
                </Link>
              </div>
              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Verified Professionals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Instant Quotes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Insured & Bonded</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl transform rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&crop=center" 
                alt="Beautiful landscaped garden" 
                className="relative z-10 w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-lg z-20">
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">4.9/5 Rating</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">From 2,500+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose LandscapeConnect?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make finding the perfect landscaping professional simple, secure, and stress-free
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Vetted Professionals</h3>
              <p className="text-gray-600">Every landscaper is thoroughly background-checked, licensed, and insured for your peace of mind.</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <MapPin className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Local Experts</h3>
              <p className="text-gray-600">Find professionals in your area who understand local climate, soil, and regulations.</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Easy Scheduling</h3>
              <p className="text-gray-600">Book consultations and services directly through our platform with real-time availability.</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Protected Payments</h3>
              <p className="text-gray-600">Secure payment processing with project milestones and satisfaction guarantees.</p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-6">
                <Star className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real Reviews</h3>
              <p className="text-gray-600">Read authentic reviews from verified customers to make informed decisions.</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Project Tracking</h3>
              <p className="text-gray-600">Monitor your project's progress with photos, updates, and milestone notifications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get your dream landscape in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Describe Your Project</h3>
              <p className="text-gray-600">Tell us about your vision, budget, and timeline. Upload photos of your current space.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Get Matched & Compare</h3>
              <p className="text-gray-600">Receive quotes from qualified professionals. Compare portfolios, reviews, and pricing.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Start Your Project</h3>
              <p className="text-gray-600">Choose your preferred contractor and watch your outdoor space transform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied homeowners</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"LandscapeConnect helped us find the perfect team for our backyard renovation. The process was seamless and the results exceeded our expectations!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                  SJ
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Austin, TX</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"As a contractor, this platform has transformed my business. High-quality leads and professional clients make all the difference."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                  MR
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Mike Rodriguez</p>
                  <p className="text-sm text-gray-500">Green Thumb Landscaping</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"From consultation to completion, everything was handled professionally. Our new garden is absolutely beautiful!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
                  LC
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Lisa Chen</p>
                  <p className="text-sm text-gray-500">Seattle, WA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Outdoor Space?</h2>
          <p className="text-xl text-green-100 mb-8">Join thousands of homeowners who found their perfect landscaping partner</p>
          <button 
            onClick={() => setCurrentView('register')}
            className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
          >
            Get Started Today
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;