"use client";

import { isLoggedIn } from '@/utils/auth';
import Greeting from '../components/Greeting';
import React, { useState } from 'react';
import { ChevronDown, Star, CheckCircle, Users, MapPin, Calendar, Shield, ArrowRight, Menu, X, Eye, EyeOff } from 'lucide-react';
import Header from '@/components/Header';
const Home = () => {
  const user = { username: 'John Doe' }; // Replace with actual user data
    const [currentView, setCurrentView] = useState('landing');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState('homeowner');
  return (
    <div>
      <div className="flex items-center justify-center h-screen">
        {isLoggedIn() ? (
          <Greeting username={user.username} />
        ) : (
          <p>Home Page</p>
        )}
      </div>
    </div>
  );

    // Navigation function
  const renderCurrentView = () => {
    switch (currentView) {
      case 'register':
        return <RegisterPage />;
      case 'login':
        return <LoginPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="font-sans">
      {renderCurrentView()}
    </div>
  );
};

export default Home;