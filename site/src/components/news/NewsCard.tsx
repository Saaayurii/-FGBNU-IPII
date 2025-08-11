import Link from 'next/link';
import { NewsItem } from './../../types/news';
import { formatDate } from '@/components/ui/date';

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link 
      href={`/news/${item.slug}`}
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
    >
      {item.image && (
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            width={500}
            height={281}
          />
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            {item.category}
          </div>
        </div>
      )}
      
      <div className="px-4 pt-4 pb-8">
        <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>
        
        <time className="block text-sm text-gray-500 mb-3">
          {formatDate(item.date)}
        </time>
        
        <p className="text-gray-600 line-clamp-2">
          {item.excerpt}
        </p>
        
        <div className="mt-4 flex items-center text-blue-500 font-medium text-sm group-hover:underline">
          Читать далее
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}