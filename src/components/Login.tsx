import React, { useState } from 'react';
import { Lock, User, AlertCircle, Info } from 'lucide-react';
import { signIn } from '../services/supabase';

type LoginProps = {
  onLoginSuccess: () => void;
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if Supabase is configured
  const isSupabaseConfigured = 
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-900 mb-4">
            <Lock size={32} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-green-400">Acesso Administrativo</h2>
          <p className="text-gray-400 mt-2">Entre com suas credenciais para acessar o painel</p>
          
          {!isSupabaseConfigured && (
            <div className="mt-2 p-2 bg-yellow-900/50 border border-yellow-800 rounded-md">
              <p className="text-yellow-300 text-sm">
                <Info size={16} className="inline mr-1" />
                Modo de demonstração ativo. Use: <br />
                Email: admin@example.com <br />
                Senha: password
              </p>
            </div>
          )}
          
          {isSupabaseConfigured && (
            <div className="mt-2 p-2 bg-blue-900/50 border border-blue-800 rounded-md">
              <p className="text-blue-300 text-sm">
                <Info size={16} className="inline mr-1" />
                Conectado ao Supabase. Use suas credenciais reais.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-800 text-white p-4 rounded-md mb-6 flex items-start">
            <AlertCircle size={20} className="text-red-400 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-500" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 text-white"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition flex items-center justify-center ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;