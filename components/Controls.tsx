import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { RadioConfig } from '../types';
import AudioVisualizer from './AudioVisualizer';
import Hls from 'hls.js';

interface ControlsProps {
  config: RadioConfig;
  isPlaying: boolean;
  setIsPlaying: (state: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({ config, isPlaying, setIsPlaying }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour extraire l'URL réelle depuis un fichier playlist (.m3u / .pls)
  const resolveStreamUrl = async (url: string): Promise<string> => {
    // Si ce n'est pas une playlist connue, on retourne l'URL telle quelle
    if (!url.match(/\.(m3u|pls)$/i)) {
      return url;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const text = await response.text();

      // Parsing basique .m3u
      if (url.endsWith('.m3u')) {
        const lines = text.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            return trimmed;
          }
        }
      }

      // Parsing basique .pls
      if (url.endsWith('.pls')) {
        const match = text.match(/File1=(.+)/i);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
    } catch (err) {
      console.warn("Échec du parsing de la playlist (possible blocage CORS), tentative de lecture directe.", err);
    }
    
    // Fallback: retourner l'URL d'origine si le parsing échoue
    return url;
  };

  useEffect(() => {
    // Nettoyage complet précédent
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = 'none';
    audioRef.current = audio;

    let isCancelled = false;

    const initAudio = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Résolution de l'URL (Playlist -> Flux direct)
        const playableUrl = await resolveStreamUrl(config.streamUrl);
        
        if (isCancelled) return;

        // 2. Configuration HLS ou Standard
        if (Hls.isSupported() && (playableUrl.endsWith('.m3u8') || playableUrl.includes('application/vnd.apple.mpegurl'))) {
          // Cas HLS (Hls.js)
          const hls = new Hls();
          hls.loadSource(playableUrl);
          hls.attachMedia(audio);
          
          hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
              console.error("Erreur HLS fatale:", data);
              setError("Erreur de flux");
              setIsLoading(false);
              setIsPlaying(false);
            }
          });
          
          hlsRef.current = hls;
        } else if (audio.canPlayType('application/vnd.apple.mpegurl') && (playableUrl.endsWith('.m3u8'))) {
          // Cas HLS (Natif Safari)
          audio.src = playableUrl;
        } else {
          // Cas Standard (MP3, AAC)
          audio.src = playableUrl;
        }

      } catch (e) {
        console.error("Erreur d'initialisation:", e);
        if (!isCancelled) setError("Erreur de connexion");
      }
    };

    initAudio();

    // Event Listeners
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlaying = () => {
        setIsLoading(false);
        setIsPlaying(true);
        setError(null);
    };
    const handleError = (e: Event) => {
        // Ignorer l'erreur si c'est juste parce qu'on a vidé la src
        if (audio.src === "") return;
        
        console.error("Audio error event:", e);
        setIsLoading(false);
        setIsPlaying(false);
        setError("Flux indisponible");
    };

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      isCancelled = true;
      audio.pause();
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      audioRef.current = null;
    };
  }, [config.streamUrl, setIsPlaying]);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setError(null);

      // Si HLS, vérifier s'il faut relancer
      if (hlsRef.current) {
          // HLS gère généralement la reprise, mais en cas d'erreur on peut recharger
          if (error) {
             hlsRef.current.recoverMediaError();
          }
      } else {
          // Recharger le standard si erreur
          if (error || audioRef.current.error) {
              audioRef.current.load();
          }
      }

      try {
        await audioRef.current.play();
      } catch (err) {
        console.error("Playback failed details:", err);
        setIsLoading(false);
        // Ne pas afficher d'erreur immédiatement, laisser l'event 'error' le faire si besoin
        // ou si c'est une interdiction autoplay
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) setIsMuted(false);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="w-full max-w-md mx-auto bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-slate-700/50">
      
      {/* Visualizer Area */}
      <div className="h-16 mb-4 flex items-center justify-center">
        {error ? (
            <span className="text-red-400 font-medium text-sm bg-red-900/20 px-3 py-1 rounded-full">{error}</span>
        ) : (
            <AudioVisualizer isPlaying={isPlaying} />
        )}
      </div>

      {/* Main Play Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={togglePlay}
          className={`
            relative flex items-center justify-center w-20 h-20 rounded-full 
            bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl 
            transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25 active:scale-95
            ${isPlaying ? 'ring-4 ring-blue-500/30' : ''}
          `}
          aria-label={isPlaying ? "Pause Radio" : "Play Radio"}
        >
          {isLoading ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-10 h-10 fill-current" />
          ) : (
            <Play className="w-10 h-10 fill-current ml-1" />
          )}
        </button>
      </div>

      {/* Volume Controls */}
      <div className="flex items-center space-x-4 px-4 py-3 bg-slate-900/50 rounded-xl border border-slate-700/30">
        <button 
            onClick={toggleMute}
            className="text-slate-400 hover:text-white transition-colors"
        >
          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
        />
      </div>
    </div>
  );
};

export default Controls;