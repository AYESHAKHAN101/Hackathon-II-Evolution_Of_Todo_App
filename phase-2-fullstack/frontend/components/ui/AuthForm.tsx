'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { AuthUtils } from '@/lib/auth';

interface AuthFormProps {
  type: 'login' | 'signup' | 'forgot-password';
  onSwitchForm?: () => void;
  onForgotPassword?: () => void;
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSwitchForm, onForgotPassword, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateInputs = () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (type !== 'forgot-password') {
      if (!formData.password) {
        setError('Password is required');
        return false;
      }

      // Only enforce strong password rules on signup, not login
      if (type === 'signup') {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
          setError('Password must have at least 8 characters, including uppercase, lowercase, and number');
          return false;
        }
      }
    }

    if (type === 'signup' && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      let response;

      switch (type) {
        case 'signup':
          response = await apiClient.signup(
            formData.email,
            formData.password,
            formData.confirmPassword
          );
          break;
        case 'login':
          response = await apiClient.signin(formData.email, formData.password);
          break;
        case 'forgot-password':
          response = await apiClient.forgotPassword(formData.email);
          break;
        default:
          throw new Error('Invalid form type');
      }

      if (response.error) {
        setError(response.error.message || 'An error occurred');
      } else if (response.data) {
        const data = response.data as any;

        if ((type === 'login' || type === 'signup') && data.jwtToken) {
          // Store the JWT token (localStorage + cookie)
          AuthUtils.storeToken(data.jwtToken);

          // Store email for display
          if (typeof window !== 'undefined' && data.user?.email) {
            localStorage.setItem('userEmail', data.user.email);
          }

          if (onSuccess) onSuccess();

          // Use window.location for a full navigation so middleware sees the cookie
          window.location.href = '/tasks';
          return;
        } else if (type === 'forgot-password') {
          setSuccessMessage('Password reset email sent. Please check your inbox.');
        } else {
          setSuccessMessage('Operation completed successfully');
        }

        if (onSuccess) onSuccess();
      } else {
        setError('An unexpected error occurred');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSubmitButtonText = () => {
    switch (type) {
      case 'signup': return 'Sign Up';
      case 'login': return 'Log In';
      case 'forgot-password': return 'Send Reset Link';
      default: return 'Submit';
    }
  };

  const getFormTitle = () => {
    switch (type) {
      case 'signup': return 'Create Account';
      case 'login': return 'Sign In';
      case 'forgot-password': return 'Reset Password';
      default: return '';
    }
  };

  const getSwitchText = () => {
    switch (type) {
      case 'signup': return 'Already have an account? ';
      case 'login': return "Don't have an account? ";
      case 'forgot-password': return 'Remember your password? ';
      default: return '';
    }
  };

  const getSwitchAction = () => {
    switch (type) {
      case 'signup': return 'Sign In';
      case 'login': return 'Sign Up';
      case 'forgot-password': return 'Sign In';
      default: return '';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            {getFormTitle()}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            {/* Password Field (except for forgot-password) */}
            {type !== 'forgot-password' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={type === 'login' ? 'current-password' : 'new-password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            )}

            {/* Confirm Password Field (only for signup) */}
            {type === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>{getSubmitButtonText()}</span>
              )}
            </button>
          </div>
        </form>

        {onSwitchForm && (
          <div className="text-center text-sm text-gray-600">
            {getSwitchText()}
            <button
              onClick={onSwitchForm}
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
            >
              {getSwitchAction()}
            </button>
          </div>
        )}

        {type === 'login' && onForgotPassword && (
          <div className="text-center text-sm text-gray-600">
            <button
              onClick={onForgotPassword}
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
            >
              Forgot your password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
