'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUtils } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (AuthUtils.isAuthenticated()) {
      // If authenticated, redirect to tasks page
      router.push('/tasks');
    } else {
      // If not authenticated, redirect to login page
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}