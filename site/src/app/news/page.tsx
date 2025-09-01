import { Header } from "@/components/Header";
import { Footer } from "@/components/ui/Footer";
import { Filters } from '@/components/news/CategoryFilter';
import NewsList from '@/components/news/NewsList';
import { Pagination } from '@/components/news/Pagination';
import { getPosts } from '@/actions/posts';
import { Category } from '@prisma/client';
import { Badge } from "@/components/ui/badge";
import { Newspaper, Filter, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BackButton } from "@/components/news/BackButton";

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
      
      {/* Hero секция */}
      <div className="bg-gradient-to-r from-gray-800 to-slate-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <BackButton />
          </div>
          <div className="max-w-4xl">
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
              <Newspaper className="w-4 h-4 mr-2" />
              Новости и события
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Новости института
            </h1>
            <p className="text-xl text-gray-100 leading-relaxed">
              Актуальные новости, достижения и события из жизни института проблем искусственного интеллекта
            </p>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Newspaper className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalPosts}</div>
              <div className="text-sm text-gray-600">всего новостей</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{currentPage}</div>
              <div className="text-sm text-gray-600">текущая страница</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Filter className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalPages}</div>
              <div className="text-sm text-gray-600">всего страниц</div>
            </div>
          </div>
        </div>
      </div>

      {/* Основное содержание */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Фильтры */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-semibold">Фильтры</h2>
            </div>
            <Filters />
          </CardContent>
        </Card>

        {/* Список новостей */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {categoryFilter ? 
                `Новости в категории "${categoryFilter}"` : 
                'Все новости'
              }
            </h2>
            <Badge variant="outline" className="text-sm">
              Показано {paginatedPosts.length} из {totalPosts}
            </Badge>
          </div>
          
          <NewsList news={news} />
        </div>

        {/* Пагинация */}
        <div className="mt-12 pt-8 border-t">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>

        {/* Пустое состояние */}
        {news.length === 0 && (
          <Card className="py-12">
            <CardContent className="text-center">
              <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Новостей не найдено</h3>
              <p className="text-gray-600">
                {categoryFilter ? 
                  'Попробуйте изменить фильтры или выбрать другую категорию' :
                  'Новости появятся здесь, как только будут опубликованы'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}