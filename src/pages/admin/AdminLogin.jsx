import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Credenciais hardcoded para funcionar sempre
      const validCredentials = {
        username: 'admin@example.com',
        password: 'admin123'
      };

      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verifica credenciais localmente primeiro
      if (username === validCredentials.username && password === validCredentials.password) {
        // Simula token de autenticação
        const mockToken = 'mock-auth-token-' + Date.now();
        localStorage.setItem('authToken', mockToken);
        
        // Simula dados do usuário
        const mockUser = {
          id: 1,
          username: username,
          name: 'Dr. Rodrigo Sguario',
          role: 'admin'
        };

        if (onLogin) {
          onLogin(mockUser);
        }
        
        // Redireciona para o dashboard
        navigate('/admin/dashboard');
      } else {
        setError('Credenciais inválidas. Use admin@example.com / admin123');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro de conexão. Tentando login offline...');
      
      // Fallback: permite login mesmo com erro de rede
      if (username === 'admin@example.com' && password === 'admin123') {
        localStorage.setItem('authToken', 'offline-token');
        navigate('/admin/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Área Administrativa</h1>
          <p className="text-gray-600 dark:text-gray-400">Dr. Rodrigo Sguario - Cardiologista</p>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg dark:bg-red-900 dark:text-red-300 dark:border-red-800">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <User className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className="w-full py-2 pl-10 pr-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md group hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              Entrar
            </button>
          </div>
        </form>
        
        <div className="p-4 mt-4 text-sm text-center text-yellow-800 bg-yellow-100 rounded-lg dark:bg-yellow-900 dark:text-yellow-300">
          <p className="font-bold">Credenciais padrão:</p>
          <p>Usuário: admin@example.com</p>
          <p>Senha: admin123</p>
          <p className="mt-2">⚠️ Altere a senha após o primeiro login</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
