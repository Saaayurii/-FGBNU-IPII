'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchCategories } from '@/types/api';
import Link from 'next/link';

export  function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    params.delete('page'); // Сброс пагинации при изменении фильтров
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg border mb-10">
      {/* <h2 className="text-lg font-medium mb-4">Фильтровать новости</h2> */}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Дата от</label>
          <input
            type="date"
            value={searchParams.get('from') || ''}
            onChange={(e) => handleFilterChange('from', e.target.value)}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Дата до</label>
          <input
            type="date"
            value={searchParams.get('to') || ''}
            onChange={(e) => handleFilterChange('to', e.target.value)}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Категория</label>
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
          ) : (
            <select
              value={searchParams.get('category') || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <div className="flex items-end">
          <button
            onClick={() => {
              const params = new URLSearchParams();
              params.delete('page');
              router.replace(`${pathname}?${params.toString()}`);
            }}
            className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>
    </div>
  );
}