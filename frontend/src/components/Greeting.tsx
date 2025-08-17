import React from 'react';

interface GreetingProps {
  username: string;
}

const Greeting: React.FC<GreetingProps> = ({ username }) => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold">Welcome, {username}!</h1>
      <p className="mt-4 text-lg">We're glad to have you here.</p>
    </div>
  );
};

export default Greeting;