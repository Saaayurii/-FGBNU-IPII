import { NewsItem } from '@/types/news';
import NewsCard from './NewsCard';

export default function NewsList({ news }: { news: NewsItem[] }) {
  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-500">
          Новостей по вашему запросу не найдено
        </h3>
        <p className="mt-2 text-gray-400">
          Попробуйте изменить параметры фильтрации
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}