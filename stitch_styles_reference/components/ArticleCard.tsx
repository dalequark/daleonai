import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="break-inside-avoid mb-8 group cursor-pointer">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-dale-pink/30">
        <div className="overflow-hidden relative">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[10%] group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-dale-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-multiply"></div>
        </div>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-dale-pink"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-dale-pink">
              {article.category}
            </span>
          </div>
          <h3 className="font-serif font-bold text-2xl text-solar-bg mb-3 leading-tight group-hover:text-dale-pink transition-colors">
            {article.title}
          </h3>
          <p className="font-sans text-slate-500 mb-5 text-sm leading-relaxed line-clamp-3">
            {article.description}
          </p>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="font-mono text-xs text-slate-400">
                {article.date}
            </div>
            <div className="font-mono text-xs font-semibold text-solar-cyan bg-solar-cyan/10 px-2 py-1 rounded">
                {article.readTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExploreCard: React.FC = () => {
    return (
        <div className="break-inside-avoid mb-8 group cursor-pointer flex flex-col h-full min-h-[200px]">
            <div className="bg-white/50 rounded-xl border-2 border-dashed border-slate-200 flex flex-1 items-center justify-center p-8 hover:bg-white hover:border-dale-pink transition-all duration-300 hover:shadow-lg group-hover:-translate-y-1">
                <span className="font-mono text-dale-pink uppercase tracking-widest text-lg font-bold group-hover:mr-2 transition-all">
                    Explore All Articles &rarr;
                </span>
            </div>
        </div>
    )
}