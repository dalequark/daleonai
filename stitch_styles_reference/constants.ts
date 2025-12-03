import { Article, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: '~/home', href: '#' },
  { label: '~/articles', href: '#' },
  { label: '~/about', href: '#' },
];

export const TOPICS = [
  'All',
  'LLMs',
  'Fine-Tuning',
  'Prompting',
  'Systems',
  'Python',
  'Architecture'
];

export const ARTICLES: Article[] = [
  {
    id: '1',
    category: 'LLMs',
    title: 'Getting Started with LangChain',
    description: 'A beginner\'s guide to building powerful applications with Large Language Models.',
    date: 'Oct 10, 2023',
    readTime: '8 min read',
    imageUrl: 'https://picsum.photos/800/450?random=1', // Landscape
    aspectRatio: 'video'
  },
  {
    id: '2',
    category: 'Prompting',
    title: 'Advanced Prompt Engineering',
    description: 'Techniques to get the most out of your models with zero-shot and few-shot prompting.',
    date: 'Sep 25, 2023',
    readTime: '6 min read',
    imageUrl: 'https://picsum.photos/800/800?random=2', // Square
    aspectRatio: 'square'
  },
  {
    id: '3',
    category: 'Python',
    title: 'Optimizing Python for Data Science',
    description: 'Tips and tricks to make your Python code run faster when handling large datasets.',
    date: 'Sep 11, 2023',
    readTime: '7 min read',
    imageUrl: 'https://picsum.photos/800/600?random=3', // Standard
    aspectRatio: 'landscape'
  },
  {
    id: '4',
    category: 'Fine-Tuning',
    title: 'Fine-Tuning a Llama 3 Model',
    description: 'A deep dive into PEFT and LoRA adapters for efficient fine-tuning on consumer hardware.',
    date: 'Oct 03, 2023',
    readTime: '12 min read',
    imageUrl: 'https://picsum.photos/800/800?random=4', // Square
    aspectRatio: 'square'
  },
  {
    id: '5',
    category: 'Systems',
    title: 'Building a RAG System from Scratch',
    description: 'Implementing Retrieval Augmented Generation using vector databases and embeddings.',
    date: 'Sep 18, 2023',
    readTime: '15 min read',
    imageUrl: 'https://picsum.photos/800/1000?random=5', // Portrait
    aspectRatio: 'portrait'
  },
  {
    id: '6',
    category: 'Architecture',
    title: 'A Deep Dive into Transformers',
    description: 'Understanding the attention mechanism and the building blocks of modern NLP.',
    date: 'Sep 04, 2023',
    readTime: '10 min read',
    imageUrl: 'https://picsum.photos/800/500?random=6',
    aspectRatio: 'video'
  },
];