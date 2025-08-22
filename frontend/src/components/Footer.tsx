"use client";

import React from 'react';

const Footer = () => {
  return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">HC</span>
                </div>
                <span className="text-xl font-bold">Yardly</span>
              </div>
              <p className="text-gray-400">Connecting homeowners with trusted landscaping professionals nationwide.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Homeowners</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Find Contractors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Get Quotes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Browse Gallery</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Project Ideas</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Professionals</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Join Our Network</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pro Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lead Generation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Yardly. All rights reserved.</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;