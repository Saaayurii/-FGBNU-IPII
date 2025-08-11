'use client';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/'); // или другой fallback-маршрут
    }
  };

  return (
    <button onClick={handleBack} className="back-button flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-5 cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-3 mr-1"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
      Назад
    </button>
  );
}