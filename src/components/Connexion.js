import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Connexion = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.email || !formData.password) {
      setError('Email et mot de passe obligatoires');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Format d\'email invalide');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.error) {
        setError('Email ou mot de passe incorrect');
        return;
      }
      
      setSuccessMessage(' ✅Connexion réussie ! ');
      setTimeout(() => {
        navigate('/chatbot');
      }, 2000);
      
    } catch (err) {
      setError('Erreur de sécurité lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/0173fef5-6578-4351-a75e-e9805bb08395.jpg')" }}
    >
      {/* Overlay futuriste */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-black/80"></div>
      
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
        <div className="glass-effect rounded-2xl shadow-2xl p-8 border border-white/20 backdrop-blur-xl">
          {/* Logo futuriste */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-float">
              <span className="text-3xl text-white">🔒</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
            <p className="text-gray-300">Accédez à votre compte Gemini</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              ⚠️ {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              🎉 {successMessage}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 pr-12"
                  placeholder="Votre mot de passe"
                  required
                  minLength="6"
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

            {/* Bouton */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Vérification...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Lien vers inscription */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-300">
              Pas encore de compte ?{' '}
              <Link
                to="/inscription"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition duration-200"
              >
                S'inscrire
              </Link>
            </p>
          </div>

          {/* Lien direct chatbot */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-300">
              
              <Link
                to="/chatbot"
                className="text-green-400 hover:text-green-300 font-medium transition duration-200"
              >
                
              </Link>
            </p>
          </div>

          {/* Message de sécurité */}
         
        </div>
      </div>
    </div>
  );
};

export default Connexion;
