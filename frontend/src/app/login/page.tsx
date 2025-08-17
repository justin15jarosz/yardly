"use client";

import React, { useState } from 'react';
import { login } from '@/utils/auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from "next/link";

const Login = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle authentication logic here - Call BE API
        console.log('username:', username);
        console.log('password:', password);
        // If BE authentication is successful, call the login function and redirect
        const result = login(username, password);
        console.log('Logging in with:', { username, password });
        if (result) {
            // Redirect to home page or dashboard
             router.push('/');
        }
        // If login is unsuccessful, push an error message to home page
    };

    return (
        <section>
    <header className="w-full flex items-center justify-between px-6 py-4 bg-green-500 shadow">
      <Link
        href={"/"}
        className={`${"/" === pathname && "text-2xl font-bold text-gray-800"
          } capitalize font-medium hover:text-accent transition-all`}
      >
        Yardly
      </Link>
      </header>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl mb-4">Login</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>
            </form>
            <div className="mt-4 text-center">
                <Link href="/register" className="text-blue-500 hover:underline">
                    Don't have an account? Register here
                </Link>
            </div>
        </div>
        </section>
    );
};

export default Login;