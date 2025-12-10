import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-solar-bg border-t border-white/5 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 font-mono text-xs text-solar-text/60 uppercase tracking-wider">
        <div>
          &copy; {new Date().getFullYear()} Dale on AI. All rights reserved.
        </div>
        
        <div className="flex gap-8">
          <a href="#" className="hover:text-dale-pink transition-colors">Github</a>
          <a href="#" className="hover:text-dale-pink transition-colors">Twitter</a>
          <a href="#" className="hover:text-dale-pink transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
};