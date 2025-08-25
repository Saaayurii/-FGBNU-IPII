'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, ChangeEvent, useRef } from 'react';
import { fetchCategories } from '@/types/api';

export function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDisplay, setFromDisplay] = useState('');
  const [toDisplay, setToDisplay] = useState('');
  
  // Ссылки для отслеживания позиции курсора
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  // Функции преобразования форматов дат
  const formatStorageToDisplay = (dateString: string | null): string => {
    if (!dateString) return '';
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}.${month}.${year}`;
    } catch {
      return '';
    }
  };

  const formatDisplayToStorage = (dateString: string): string | null => {
    try {
      const parts = dateString.split('.');
      if (parts.length !== 3) return null;
      
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch {
      return null;
    }
  };

  // Валидация даты
  const isValidDate = (dateString: string): boolean => {
    const regex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!regex.test(dateString)) return false;
    
    const [day, month, year] = dateString.split('.').map(Number);
    
    // Проверка диапазонов
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // Проверка корректности даты
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  // Синхронизация с параметрами URL
  useEffect(() => {
    setFromDisplay(formatStorageToDisplay(searchParams.get('from')));
    setToDisplay(formatStorageToDisplay(searchParams.get('to')));
  }, [searchParams]);

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
    
    params.delete('page');
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Обработчик ввода с маской
  const handleDateInput = (
    e: ChangeEvent<HTMLInputElement>, 
    field: 'from' | 'to'
  ) => {
    const input = e.target.value;
    
    // Разрешаем только цифры и точки
    const cleaned = input.replace(/[^\d.]/g, '');
    
    // Ограничиваем длину
    if (cleaned.length > 10) return;
    
    // Автоматическое добавление точек
    let formatted = '';
    const digits = cleaned.replace(/\./g, '');
    
    for (let i = 0; i < digits.length; i++) {
      if (i === 2 || i === 4) formatted += '.';
      formatted += digits[i];
    }
    
    // Обновляем состояние
    if (field === 'from') {
      setFromDisplay(formatted);
    } else {
      setToDisplay(formatted);
    }
    
    // Сохраняем позицию курсора
    setTimeout(() => {
      const cursorPos = e.target.selectionStart;
      const inputRef = field === 'from' ? fromRef.current : toRef.current;
      
      if (inputRef && cursorPos !== null) {
        // Корректируем позицию курсора при добавлении точек
        const newPos = formatted.length <= 10 ? cursorPos : cursorPos - (input.length - formatted.length);
        inputRef.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  // Обработчик потери фокуса
  const handleDateBlur = (field: 'from' | 'to') => {
    const value = field === 'from' ? fromDisplay : toDisplay;
    
    if (value.length === 10 && isValidDate(value)) {
      const storageFormat = formatDisplayToStorage(value);
      if (storageFormat) {
        handleFilterChange(field, storageFormat);
      }
    } else if (value === '') {
      handleFilterChange(field, '');
    } else {
      // Сбрасываем невалидное значение
      if (field === 'from') {
        setFromDisplay('');
      } else {
        setToDisplay('');
      }
      handleFilterChange(field, '');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border mb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Поле "Дата от" */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Дата от
          </label>
          <input
            ref={fromRef}
            type="text"
            value={fromDisplay}
            onChange={(e) => handleDateInput(e, 'from')}
            onBlur={() => handleDateBlur('from')}
            placeholder="дд.мм.гггг"
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          />
        </div>
        
        {/* Поле "Дата до" */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Дата до
          </label>
          <input
            ref={toRef}
            type="text"
            value={toDisplay}
            onChange={(e) => handleDateInput(e, 'to')}
            onBlur={() => handleDateBlur('to')}
            placeholder="дд.мм.гггг"
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          />
        </div>
        
        {/* Поле категории */}
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
        
        {/* Кнопка сброса */}
        <div className="flex items-end">
          <button
            onClick={() => {
              const params = new URLSearchParams();
              params.delete('page');
              router.replace(`${pathname}?${params.toString()}`);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors cursor-pointer"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>
    </div>
  );
}