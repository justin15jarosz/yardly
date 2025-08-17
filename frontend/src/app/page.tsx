"use client";

import { isLoggedIn } from '@/utils/auth';
import Greeting from '../components/Greeting';
import Header from '@/components/Header';

const Home = () => {
  const user = { username: 'John Doe' }; // Replace with actual user data

  return (
    <div>
      <Header />

      <div className="flex items-center justify-center h-screen">
        {isLoggedIn() ? (
          <Greeting username={user.username} />
        ) : (
          <p>Home Page</p>
        )}
      </div>
    </div>
  );
};

export default Home;