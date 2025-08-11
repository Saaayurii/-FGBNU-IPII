export interface NewsItem {
  id: string | number;
  title: string;
  slug: string;
  date: string | Date;
  excerpt: string;
  content: string;
  category: string;
  image?: string;
  author?: string;
}

export interface NewsListResponse {
  news: NewsItem[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}