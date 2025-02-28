import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Cpu, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { auth, isDemoMode } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, login } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to admin dashboard
    if (currentUser) {
      navigate('/admin');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use the login function from AuthContext instead of direct Firebase call
      await login(email, password);
      // No need to navigate here as the useEffect will handle it
    } catch (error) {
      console.error('Login error:', error);
      // Toast error is already handled in the login function
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="max-w-md w-full mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-8"
        >
          <div className="flex items-center justify-center mb-8">
            <Cpu className="h-12 w-12 text-[var(--primary)]" />
          </div>

          <h2 className="text-2xl font-bold text-center mb-8 hero-gradient">
            Connexion Admin
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)] text-white"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--primary)] text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-[var(--primary)] text-white neon-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center text-sm text-gray-400">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>Contactez l'administrateur pour créer un compte</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white text-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au site
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;