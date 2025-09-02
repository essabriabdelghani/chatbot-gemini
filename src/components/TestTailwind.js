import React from 'react';

const TestTailwind = () => {
  return (
     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-purple-800 mb-8">
          🎨 Test des Couleurs Tailwind CSS
        </h1>
        
        {/* Palette de couleurs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Rouge */}
          <div className="bg-red-500 p-4 rounded-lg shadow-md">
            <h3 className="text-white font-semibold">Rouge</h3>
            <p className="text-red-100">bg-red-500</p>
          </div>
          
          {/* Bleu */}
          <div className="bg-blue-500 p-4 rounded-lg shadow-md">
            <h3 className="text-white font-semibold">Bleu</h3>
            <p className="text-blue-100">bg-blue-500</p>
          </div>
          
          {/* Vert */}
          <div className="bg-green-500 p-4 rounded-lg shadow-md">
            <h3 className="text-white font-semibold">Vert</h3>
            <p className="text-green-100">bg-green-500</p>
          </div>
          
          {/* Jaune */}
          <div className="bg-yellow-500 p-4 rounded-lg shadow-md">
            <h3 className="text-white font-semibold">Jaune</h3>
            <p className="text-yellow-100">bg-yellow-500</p>
          </div>
        </div>

        {/* Dégradés */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dégradés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-pink-500 to-yellow-500 p-6 rounded-xl text-white text-center">
              <p>de rose à jaune</p>
            </div>
            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-xl text-white text-center">
              <p>de vert à bleu</p>
            </div>
          </div>
        </div>

        {/* Variations de couleurs */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Variations de bleu</h2>
          <div className="flex flex-wrap gap-2">
            {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
              <div 
                key={shade} 
                className={`bg-blue-${shade} text-${shade < 500 ? 'gray-800' : 'white'} p-3 rounded-md text-xs`}
              >
                blue-{shade}
              </div>
            ))}
          </div>
        </div>

        {/* Boutons colorés */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Boutons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Rouge
            </button>
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
              Émeraude
            </button>
            <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
              Ambre
            </button>
            <button className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors">
              Violet
            </button>
            <button className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
              Rose
            </button>
          </div>
        </div>

        {/* Cartes avec bordures colorées */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Cartes colorées</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-l-4 border-cyan-500 bg-cyan-50 p-4 rounded">
              <h3 className="text-cyan-800 font-semibold">Carte Cyan</h3>
              <p className="text-cyan-600">Avec une bordure gauche cyan</p>
            </div>
            <div className="border-l-4 border-fuchsia-500 bg-fuchsia-50 p-4 rounded">
              <h3 className="text-fuchsia-800 font-semibold">Carte Fuchsia</h3>
              <p className="text-fuchsia-600">Avec une bordure gauche fuchsia</p>
            </div>
            <div className="border-l-4 border-lime-500 bg-lime-50 p-4 rounded">
              <h3 className="text-lime-800 font-semibold">Carte Lime</h3>
              <p className="text-lime-600">Avec une bordure gauche lime</p>
            </div>
          </div>
        </div>

        {/* Message de succès */}
        <div className="mt-10 p-6 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl text-white text-center">
          <h2 className="text-2xl font-bold mb-2">✅ Tailwind CSS fonctionne parfaitement !</h2>
          <p>Vous voyez toutes ces couleurs ? C'est que tout est configuré correctement !</p>
        </div>
      </div>
    </div>
  
  );
};

export default TestTailwind;