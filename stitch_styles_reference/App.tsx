import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ArticleGrid } from './components/ArticleGrid';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <ArticleGrid />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}