
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { catalogApi } from '../../data/catalogApi';
import { Button, Input } from '../ui/AdminComponents';
import { useToast } from '../ui/Toast';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await catalogApi.signIn(email, password);
    setLoading(false);

    if (error) {
      addToast(error.message, 'error');
    } else {
      const isAdmin = await catalogApi.isAdmin();
      if (isAdmin) {
        navigate('/admin');
      } else {
        addToast('Access denied. Not an admin.', 'error');
        await catalogApi.signOut();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#141821] border border-white/5 p-8 shadow-2xl">
        <h1 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-center">System Access</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input 
            label="Email" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            autoFocus
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <Button type="submit" disabled={loading} className="mt-4">
            {loading ? 'Authenticating...' : 'Initialize Session'}
          </Button>
        </form>
      </div>
    </div>
  );
};
