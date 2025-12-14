import React from 'react';
import { RadioConfig } from '../types';
import { Wifi } from 'lucide-react';

interface HeaderProps {
  config: RadioConfig;
  isPlaying: boolean;
}

const Header: React.FC<HeaderProps> = ({ config, isPlaying }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 mb-8">
      {/* Logo Container with Glow Effect */}
      <div className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 transition duration-1000 group-hover:opacity-50 ${isPlaying ? 'opacity-60 animate-pulse-slow' : ''}`}></div>
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl bg-slate-900 flex items-center justify-center">
            <img 
                src={config.logoUrl} 
                alt={`${config.stationName} Logo`} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
        </div>
      </div>

      {/* Text Info */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          {config.stationName}
        </h1>
        <p className="text-slate-400 font-medium tracking-wide uppercase text-xs sm:text-sm">
          {config.tagline}
        </p>
      </div>

      {/* Live Indicator */}
      <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-1.5 rounded-full backdrop-blur-sm border border-slate-700/50">
        <div className={`relative flex h-3 w-3`}>
           {isPlaying && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
           <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-red-500' : 'bg-slate-500'}`}></span>
        </div>
        <span className={`text-xs font-semibold tracking-wider ${isPlaying ? 'text-red-400' : 'text-slate-500'}`}>
          {isPlaying ? 'ON AIR' : 'OFFLINE'}
        </span>
        {isPlaying && <Wifi className="w-3 h-3 text-red-400 animate-pulse" />}
      </div>
    </div>
  );
};

export default Header;