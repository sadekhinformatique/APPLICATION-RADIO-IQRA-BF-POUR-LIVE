import React from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying }) => {
  return (
    <div className="flex items-center justify-center h-12 space-x-1">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`w-1.5 bg-blue-500 rounded-full transition-all duration-300 ease-in-out ${
            isPlaying ? 'animate-[bounce_1s_infinite]' : 'h-1 opacity-30'
          }`}
          style={{
            height: isPlaying ? undefined : '4px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${0.8 + Math.random() * 0.5}s` // Randomize slightly for natural look
          }}
        ></div>
      ))}
    </div>
  );
};

export default AudioVisualizer;