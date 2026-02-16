'use client';

import React, { useState } from 'react';
import AuthForm from '@/components/ui/AuthForm';
import Link from 'next/link';

const LoginPage: React.FC = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {showForgotPassword ? (
            <AuthForm
              type="forgot-password"
              onSwitchForm={() => setShowForgotPassword(false)}
            />
          ) : (
            <AuthForm
              type="login"
              onSwitchForm={() => window.location.href = '/signup'}
              onForgotPassword={() => setShowForgotPassword(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;