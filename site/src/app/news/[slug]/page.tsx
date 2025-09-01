import { Header } from "@/components/Header";
import { Footer } from "@/components/ui/Footer";
import { getPostBySlug } from '@/actions/posts';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/news/BackButton'
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Newspaper } from "lucide-react";
import Image from "next/image";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const newsItem = await getPostBySlug(slug);

  if (!newsItem) return notFound();

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'NEWS': return 'Новости';
      case 'VACANCY': return 'Вакансии';
      case 'ANNOUNCEMENT': return 'Объявления';
      case 'EVENT': return 'События';
      default: return category;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton className="mb-6" />
          <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
            <Newspaper className="w-4 h-4 mr-2" />
            {getCategoryLabel(newsItem.category)}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{newsItem.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-green-100">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{format(new Date(newsItem.createdAt), "d MMMM yyyy", { locale: ru })}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>{newsItem.author.name}</span>
            </div>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {newsItem.imageUrl && (
          <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={newsItem.imageUrl}
              alt={newsItem.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {newsItem.content}
            </div>
          </div>


          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Поделиться новостью
              </h3>
              <p className="text-green-700 mb-4">
                Распространите эту новость среди коллег и знакомых
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Badge variant="outline" className="text-green-600 border-green-200">
                  #{getCategoryLabel(newsItem.category).toLowerCase()}
                </Badge>
                {newsItem.featured && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                    Рекомендуемое
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}