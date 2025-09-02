import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Connexion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const userData = {
        id: 1,
        email: email,
        name: email.split('@')[0],
        avatar: '👤'
      };
      
      const fakeToken = 'eyFakeToken123...';
      await login(userData, fakeToken);
      navigate('/chatbot');
      
    } catch (err) {
      setError('Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    navigate('/connexion-google');
  };

  const handleGitHubLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const userData = {
        id: 3,
        email: 'github.user@example.com',
        name: 'GitHub User',
        avatar: '⚫'
      };
      login(userData);
      navigate('/chatbot');
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/0173fef5-6578-4351-a75e-e9805bb08395.jpg')" }}
    >
      {/* Overlay dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-black/80"></div>
      
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
        <div className="glass-effect rounded-2xl shadow-2xl p-8 border border-white/20 backdrop-blur-xl">
          {/* Logo futuriste */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-float">
              <span className="text-3xl text-white">🤖</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
            <p className="text-gray-300">Accédez à votre assistant Gemini</p>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 pr-12"
                  placeholder="Votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition duration-200"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-400">Ou continuer avec</span>
            </div>
          </div>

          {/* Boutons externes */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white/10 border border-white/20 text-white py-3 px-4 rounded-lg font-medium hover:bg-white/20 transition duration-300 disabled:opacity-50 flex items-center justify-center"
           >
             <span className="mr-2">🔵</span>
             Google
            </button> 
            
            <button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="w-full bg-gray-900/80 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-900 transition duration-300 disabled:opacity-50 flex items-center justify-center"
            >
              <span className="mr-2">⚫</span>
              GitHub
            </button>
          </div>

          {/* Lien inscription */}
          <div className="text-center">
            <p className="text-sm text-gray-300">
              Pas encore de compte ?{' '}
              <Link
                to="/inscription"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition duration-200"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connexion;
