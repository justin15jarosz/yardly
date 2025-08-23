"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter()

  const [currentView, setCurrentView] = useState('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  // const [userType, setUserType] = useState('homeowner');
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Yardly</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors">How It Works</a>
            <a href="#testimonials" className="text-gray-700 hover:text-green-600 transition-colors">Reviews</a>
            <Link href="/login" className="text-gray-700 hover:text-green-600 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
              Get Started
            </Link>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-4">
            <a href="#features" className="block text-gray-700">Features</a>
            <a href="#how-it-works" className="block text-gray-700">How It Works</a>
            <a href="#testimonials" className="block text-gray-700">Reviews</a>
            <button
              onClick={() => setCurrentView('login')}
              className="block text-gray-700 w-full text-left"
            >
              Sign In
            </button>
            <button
              onClick={() => setCurrentView('register')}
              className="bg-green-600 text-white px-6 py-2 rounded-full w-full"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
  // <header className="w-full flex items-center justify-between px-6 py-4 bg-green-500 shadow">
  //   <Link
  //     href={"/"}
  //     className={`${"/" === pathname && "text-2xl font-bold text-gray-800"
  //       } capitalize font-medium hover:text-accent transition-all`}
  //   >
  //     Yardly
  //   </Link>
  //   {isLoggedIn() ? (
  //     <Button
  //       onClick={handleLogout}
  //       className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
  //     >
  //       Logout
  //     </Button>
  //   ) : (

  //     <Link
  //       href={"/login"}
  //       className={`${"/login" === pathname && "text-accent border-b-2 border-accent"
  //         } capitalize font-medium hover:text-accent transition-all`}
  //     >
  //       Login
  //     </Link>
  //   )}
  // </header>
  // );
};

export default Header;