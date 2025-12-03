import React, { useState } from 'react';
import { TOPICS } from '../constants';

export const Hero: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState('All');

  return (
    <section className="py-16 md:py-24 flex flex-col items-center text-center">
      <h1 className="font-serif italic text-5xl md:text-7xl text-solar-bg mb-6 tracking-tight drop-shadow-sm">
        Dale on AI
      </h1>
      
      <div className="w-full border-t border-b border-slate-200/60 py-6 bg-white/30 backdrop-blur-sm">
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400 mr-2">
            Filter by:
          </span>
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTopic(topic)}
              className={`
                px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out
                border
                ${activeTopic === topic 
                  ? 'bg-dale-pink text-white border-dale-pink shadow-lg shadow-dale-pink/20 scale-105' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-dale-pink hover:text-dale-pink hover:shadow-md'
                }
              `}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};