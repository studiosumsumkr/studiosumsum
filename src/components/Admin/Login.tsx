import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface LoginProps {
  onBack: () => void;
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onBack, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple local password
  const ADMIN_PASSWORD = "ksw1223";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        onLogin();
      } else {
        setError("Invalid password. Please try again.");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-12 shadow-2xl rounded-2xl text-center relative"
      >
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 text-gray-400 hover:text-primary transition-colors flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <h1 className="text-3xl font-serif mb-4 tracking-widest mt-8">ADMIN ACCESS</h1>
        <p className="text-gray-500 mb-12 text-sm uppercase tracking-widest">L'AURA CMS Portal</p>
        
        {error && <p className="text-red-500 mb-6 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2">Admin Password</label>
            <input 
              type="password"
              required
              placeholder="Enter password"
              className="w-full border-b border-gray-200 py-2 focus:border-primary outline-none text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full luxury-button disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Enter Dashboard'}
          </button>
        </form>
        
        <p className="mt-12 text-[10px] text-gray-400 uppercase tracking-[0.2em]">
          Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
};
