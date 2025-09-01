import { Header } from "@/components/Header";
import { Footer } from "@/components/ui/Footer";
import { getPostBySlug } from '@/actions/posts';
import { notFound } from 'next/navigation';
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Briefcase } from "lucide-react";
import Image from "next/image";
import { BackButton } from "@/components/news/BackButton";

export default async function VacanciesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vacancy = await getPostBySlug(slug);

  if (!vacancy || vacancy.category !== 'VACANCY') return notFound();

  // Парсим HTML из старых постов если отдельные поля пустые
  const parseHtmlContent = (content: string) => {
    const locationMatch = content.match(/<h3>Местоположение:<\/h3>\s*<p>([^<]*)<\/p>/);
    const employmentMatch = content.match(/<h3>Тип занятости:<\/h3>\s*<p>([^<]*)<\/p>/);
    const salaryMatch = content.match(/<h3>Зарплата:<\/h3>\s*<p>([^<]*)<\/p>/);
    const requirementsMatch = content.match(/<h3>Требования:<\/h3>\s*<p>([^<]*)<\/p>/);
    
    return {
      location: locationMatch?.[1] || null,
      employmentType: employmentMatch?.[1] || null,
      salary: salaryMatch?.[1] || null,
      requirements: requirementsMatch?.[1] || null,
      cleanContent: content
        .replace(/<h3>Местоположение:<\/h3>\s*<p>[^<]*<\/p>/g, '')
        .replace(/<h3>Тип занятости:<\/h3>\s*<p>[^<]*<\/p>/g, '')
        .replace(/<h3>Зарплата:<\/h3>\s*<p>[^<]*<\/p>/g, '')
        .replace(/<h3>Требования:<\/h3>\s*<p>[^<]*<\/p>/g, '')
        .replace(/^\s*<p><br><\/p>\s*/, '') // убираем пустые параграфы в начале
        .trim()
    };
  };

  const parsed = parseHtmlContent(vacancy.content);
  const vacancyData = {
    location: vacancy.location || parsed.location,
    employmentType: vacancy.employmentType || parsed.employmentType,
    salary: vacancy.salary || parsed.salary,
    requirements: vacancy.requirements || parsed.requirements,
    content: vacancy.location || vacancy.employmentType || vacancy.salary || vacancy.requirements 
      ? vacancy.content 
      : parsed.cleanContent
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton className="mb-6" />
          <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
            <Briefcase className="w-4 h-4 mr-2" />
            Вакансия
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{vacancy.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-blue-100">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{format(new Date(vacancy.createdAt), "d MMMM yyyy", { locale: ru })}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>{vacancy.author?.name || 'Анонимный автор'}</span>
            </div>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {vacancy.imageUrl && (
          <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={vacancy.imageUrl}
              alt={vacancy.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border p-8">
          {/* Информация о вакансии */}
          {(vacancyData.location || vacancyData.employmentType || vacancyData.salary || vacancyData.requirements) && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Детали вакансии</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vacancyData.location && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Местоположение:</h3>
                    <p className="text-gray-700">{vacancyData.location}</p>
                  </div>
                )}
                {vacancyData.employmentType && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Тип занятости:</h3>
                    <p className="text-gray-700">{vacancyData.employmentType}</p>
                  </div>
                )}
                {vacancyData.salary && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Зарплата:</h3>
                    <p className="text-gray-700 font-medium text-green-600">{vacancyData.salary}</p>
                  </div>
                )}
                {vacancyData.requirements && (
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Требования:</h3>
                    <p className="text-gray-700 whitespace-pre-line">{vacancyData.requirements}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: vacancyData.content }}>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Заинтересованы в этой позиции?
              </h3>
              <p className="text-blue-700 mb-4">
                Отправляйте свое резюме и сопроводительное письмо на указанный email
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  HR отдел: hr@yourdomain.com
                </Badge>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Статус: Активная вакансия
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}