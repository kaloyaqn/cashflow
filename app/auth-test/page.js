// app/auth-test/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/components/AuthProvider';

export default function AuthTestPage() {
  const { user, loading } = useAuthContext();
  const [directSession, setDirectSession] = useState(null);
  const [directLoading, setDirectLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      setDirectSession(data.session);
      setDirectLoading(false);
    }
    
    checkSession();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Auth Context</h2>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Direct Session Check</h2>
        <p><strong>Loading:</strong> {directLoading ? 'Yes' : 'No'}</p>
        <p><strong>Session:</strong> {directSession ? 'Active' : 'None'}</p>
        <p><strong>User:</strong> {directSession?.user?.email}</p>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Refresh
        </button>
        
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Sign Out
        </button>
        
        <a
          href="/dashboard"
          className="px-4 py-2 bg-green-500 text-white rounded inline-block text-center"
        >
          Dashboard
        </a>
      </div>
    </div>
  );
}
