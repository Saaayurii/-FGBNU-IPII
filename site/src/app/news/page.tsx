import { Header } from "@/components/Header";
import { Footer } from "@/components/ui/Footer";
import { Filters } from '@/components/news/CategoryFilter';
import NewsList from '@/components/news/NewsList';
import { Pagination } from '@/components/news/Pagination';
import { getPosts } from '@/actions/posts';
import { BackButton } from '@/components/news/BackButton';
import { Category } from '@prisma/client';

export default async function NewsPage({
  searchParams
}: {
  searchParams: Promise<{
    page?: string;
    from?: string;
    to?: string;
    category?: string;
  }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const categoryFilter = params?.category as Category | undefined;
  
  // Get all posts from database, filter for NEWS category  
  const allPosts = await getPosts(categoryFilter);
  
  console.log('All posts fetched:', allPosts.length, allPosts);
  console.log('Category filter:', categoryFilter);
  
  // Apply date filters if provided
  let filteredPosts = allPosts;
  if (params?.from) {
    const fromDate = new Date(params.from);
    filteredPosts = filteredPosts.filter(post => new Date(post.createdAt) >= fromDate);
  }
  if (params?.to) {
    const toDate = new Date(params.to);
    filteredPosts = filteredPosts.filter(post => new Date(post.createdAt) <= toDate);
  }
  
  // Pagination
  const postsPerPage = 5;
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);
  
  // Convert to the format expected by NewsList
  const news = paginatedPosts.map(post => ({
    id: post.id, // Keep as string since cuid is string
    title: post.title,
    slug: post.slug,
    date: post.createdAt.toISOString().split('T')[0],
    excerpt: post.description,
    content: post.content,
    category: post.category,
    image: post.imageUrl || undefined
  }));
  
  console.log('Mapped news:', news.length, news);

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