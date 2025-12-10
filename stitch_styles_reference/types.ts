export interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  aspectRatio: 'video' | 'square' | 'portrait' | 'landscape'; // Helps mock different image sizes for masonry
}

export interface NavItem {
  label: string;
  href: string;
}