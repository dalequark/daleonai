import React, { useState, useRef } from 'react';
import { NAV_ITEMS } from '../constants';

export const Header: React.FC = () => {
  const [input, setInput] = useState('Dale on AI');
  const [isInputActive, setIsInputActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to force cursor to end
  const keepCursorAtEnd = () => {
    if (inputRef.current) {
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  };

  // Focus input when clicking the terminal area
  const handleTerminalClick = () => {
    inputRef.current?.focus();
    // Use timeout to ensure focus event has processed before setting selection
    setTimeout(keepCursorAtEnd, 0);
  };

// I don't think this whole thing works yet, but I'll fix it as a TODO
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      
      // TODO: make this work
      if (cmd === 'help') {
        alert('¯\\_(ツ)_/¯');
      } else if (cmd === 'ls') {
        alert('labubu.html  dubaichocolate.css  fatherfigure.js  lololol.pem');
      } else if (cmd === 'whoami') {
        alert('guest@dale-ai');
      } else if (cmd === 'clear') {
        setInput('');
        return;
      }
      
      // Reset or "execute"
      console.log(`Command executed: ${input}`);
      setInput('');
    }
  };

  return (
    <header className="w-full bg-solar-bg text-solar-text font-mono text-sm py-4 sticky top-0 z-50 border-b border-white/10 shadow-lg shadow-purple-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        
        {/* Interactive Terminal Section */}
        <div 
          className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-lg cursor-text border border-white/5 w-full sm:w-auto transition-colors hover:border-white/10 hover:bg-black/30"
          onClick={handleTerminalClick}
        >
          <div className="flex items-center gap-2 select-none">
            <span className="text-pastel-purple font-bold">guest</span>
            <span className="text-solar-text/50">@</span>
            <span className="text-solar-green font-bold">dale-ai</span>
            <span className="text-solar-text/50">:</span>
            <span className="text-pastel-blue font-bold">~</span>
            <span className="text-solar-text/50">$</span>
          </div>
          
          <div className="relative min-w-[100px] sm:min-w-[160px]">
            {/* Hidden input that captures keystrokes */}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setIsInputActive(true);
                setTimeout(keepCursorAtEnd, 0);
              }}
              onClick={(e) => {
                e.stopPropagation();
                keepCursorAtEnd();
              }}
              onBlur={() => setIsInputActive(false)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
              autoComplete="off"
              spellCheck={false}
            />
            
            {/* Visual representation of text + cursor */}
            <div className="flex items-center whitespace-pre">
              <span className="text-solar-text font-bold tracking-tight">
                {input}
              </span>
              {/* Custom Blinking Block Cursor */}
              <span className={`inline-block w-2.5 h-5 bg-dale-pink ml-0.5 ${isInputActive ? 'animate-cursor-blink' : 'opacity-50'}`}></span>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex items-center gap-6 sm:gap-8">
          {NAV_ITEMS.map((item) => (
            <a 
              key={item.label} 
              href={item.href}
              className="text-solar-cyan hover:text-pastel-yellow transition-colors duration-300 font-medium text-xs sm:text-sm uppercase tracking-wider"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};