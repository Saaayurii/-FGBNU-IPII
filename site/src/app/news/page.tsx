import { Header } from "@/components/Header";
import { Footer } from "@/components/ui/Footer";
import { Filters } from '@/components/news/CategoryFilter';
import NewsList from '@/components/news/NewsList';
import { Pagination } from '@/components/news/Pagination';
import { fetchNews } from '@/types/api';
import { BackButton } from '@/components/news/BackButton'

export default async function NewsPage({
  searchParams
}: {
  searchParams?: {
    page?: string;
    from?: string;
    to?: string;
    category?: string;
  };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const filters = {
    from: searchParams?.from,
    to: searchParams?.to,
    category: searchParams?.category
  };

  const { news, totalPages } = await fetchNews(currentPage, 5, filters);

  return (
    <div className="min-h-screen bg-background">

      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Новости</h1>
        {/* Хлебные крошки НА ГЛАВНУЮ */}
        <BackButton />

        {/* Фильтр по статьям */}
        <Filters />

        {/* Список новостей */}
        <NewsList news={news} />

        {/* Пагинация (срабатывает если количество статей больше 5) */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </div>

      <Footer />
    </div>
  );
}