import React from 'react';
import { ARTICLES } from '../constants';
import { ArticleCard, ExploreCard } from './ArticleCard';

export const ArticleGrid: React.FC = () => {
  return (
    <section className="pb-16">
      {/* 
        Tailwind's columns utility creates a masonry-like layout 
        by ordering items top-to-bottom within columns.
      */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {ARTICLES.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
        <ExploreCard />
      </div>
    </section>
  );
};