import React, { useState } from 'react';
import { radioConfig } from './config';
import Header from './components/Header';
import Controls from './components/Controls';
import SocialLinks from './components/SocialLinks';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Main Card */}
      <main className="w-full max-w-lg z-10">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-6 sm:p-10">
          
          <Header config={radioConfig} isPlaying={isPlaying} />
          
          <Controls 
            config={radioConfig} 
            isPlaying={isPlaying} 
            setIsPlaying={setIsPlaying}
          />
          
          <SocialLinks links={radioConfig.socials} />
          
          <footer className="mt-10 text-center text-slate-600 text-xs">
            <p>&copy; {new Date().getFullYear()} {radioConfig.stationName}. Tous droits réservés.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;