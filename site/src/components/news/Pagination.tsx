'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';

export function Pagination({
  totalPages,
  currentPage
}: {
  totalPages: number;
  currentPage: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Функция для создания параметров URL с сохранением существующих фильтров
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Рассчитываем диапазон страниц для отображения
  const getPageRange = () => {
    const visiblePages = 5;
    let start = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const end = Math.min(totalPages, start + visiblePages - 1);
    
    if (end - start + 1 < visiblePages) {
      start = Math.max(1, end - visiblePages + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center gap-1">
        {currentPage > 1 && (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="px-3 py-2 rounded border hover:bg-gray-100"
          >
            &larr; Назад
          </Link>
        )}
        
        {getPageRange().map(page => (
          <Link
            key={page}
            href={createPageUrl(page)}
            className={`px-3 py-2 rounded border ${
              currentPage === page 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'hover:bg-gray-100'
            }`}
          >
            {page}
          </Link>
        ))}
        
        {currentPage < totalPages && (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="px-3 py-2 rounded border hover:bg-gray-100"
          >
            Вперед &rarr;
          </Link>
        )}
      </nav>
    </div>
  );
}