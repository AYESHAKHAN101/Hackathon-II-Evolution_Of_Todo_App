'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthUtils } from '@/lib/auth';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    setIsSignedIn(AuthUtils.isAuthenticated());
  }, [pathname]);

  const handleLogout = () => {
    AuthUtils.logout('/login');
  };

  return (
    <nav className="bg-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={isSignedIn ? '/tasks' : '/'}>
              <span className="text-white text-xl font-bold">Todo App</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!isSignedIn ? (
              <>
                {!pathname.includes('/login') && (
                  <Link
                    href="/login"
                    className="text-white hover:bg-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Log In
                  </Link>
                )}
                {!pathname.includes('/signup') && (
                  <Link
                    href="/signup"
                    className="text-white hover:bg-indigo-600 px-3 py-2 rounded-md text-sm font-medium bg-indigo-600"
                  >
                    Sign Up
                  </Link>
                )}
              </>
            ) : (
              <>
                <span className="text-white text-sm hidden md:inline">
                  Welcome, {typeof window !== 'undefined' ? localStorage.getItem('userEmail') || 'User' : 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
