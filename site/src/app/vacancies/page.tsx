import { Header } from "@/components/Header";
import { Footer } from "@/components/ui/Footer";
import { Pagination } from "@/components/news/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Briefcase, Users, Clock, MapPin } from "lucide-react";
import { PostWithAuthor } from "@/types";
import { getPosts } from "@/actions/posts";
import { Category } from "@prisma/client";
import Link from "next/link";
import { GradientButton } from "@/components/ui/GradientButton";
import { BackButton } from "@/components/news/BackButton";

export default async function VacanciesPage({
  searchParams,
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
  
  // Get vacancy posts from database
  const vacancyPosts = await getPosts(Category.VACANCY);
  
  console.log('Vacancy posts fetched:', vacancyPosts.length, vacancyPosts);
  
  // Apply date filters if provided
  let filteredPosts = vacancyPosts;
  if (params?.from) {
    const fromDate = new Date(params.from);
    filteredPosts = filteredPosts.filter(post => new Date(post.createdAt) >= fromDate);
  }
  if (params?.to) {
    const toDate = new Date(params.to);
    filteredPosts = filteredPosts.filter(post => new Date(post.createdAt) <= toDate);
  }
  
  // Pagination
  const postsPerPage = 6;
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const publishedVacancies = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  // Convert to display format
  const displayVacancies = publishedVacancies.map(vacancy => ({
    id: vacancy.id,
    title: vacancy.title,
    description: vacancy.description,
    content: vacancy.content,
    createdAt: vacancy.createdAt,
    category: vacancy.category,
    imageUrl: vacancy.imageUrl,
    author: vacancy.author,
    published: vacancy.published,
    slug: vacancy.slug,
    positions: "Уточнить в HR отделе",
    employment: "Полная занятость", 
    contract: "Согласно трудовому законодательству",
    department: "Лаборатория интеллектуальных систем и анализа данных",
  }));

  // Fallback данные если нет вакансий  
  const fallbackVacancies = displayVacancies.length > 0 ? [] : [
    {
      id: "1",
      title: "Младший научный сотрудник",
      description:
        "Проведение научных исследований в области компьютерного зрения и нейросетевых технологий, анализ современных тенденций, методов и алгоритмов, оптимизация существующих алгоритмов для повышения их эффективности и точности.",
      content: `<h3>Основные обязанности:</h3>
				<ul>
						<li>Разработка, обучение и тестирование нейросетевых моделей для решения задач компьютерного зрения</li>
							<li>Сбор, аннотирование и предобработка данных для обучения моделей</li>
							<li>Разработка методов аугментации данных для улучшения качества обучения</li>
									<li>Проведение экспериментов для оценки производительности разработанных моделей</li>
									<li>Подготовка научных публикаций, отчетов и презентаций о результатах исследований</li>
</ul>
<h3>Требования:</h3>
<ul>
<li>Высшее образование в области информатики, математики или смежных дисциплин</li>
<li>Опыт работы с Python, TensorFlow/PyTorch</li>
<li>Знание алгоритмов машинного обучения и компьютерного зрения</li>
</ul>`,
      createdAt: new Date("2025-01-15"),
      category: "VACANCY" as const,
      imageUrl: null,
      author: { name: "HR отдел", email: "" },
      published: true,
      slug: "junior-researcher-position",
      positions: "2 вакансии",
      employment: "Полная занятость",
      contract: "Срочный трудовой договор до 31.12.2026 г.",
      department: "Лаборатория интеллектуальных систем и анализа данных",
    },
    {
      id: "2",
      title: "Инженер-исследователь I категории",
      description:
        "Проведение научных исследований в области компьютерного зрения и нейросетевых технологий, работа с современными алгоритмами и методами анализа данных.",
      content: `<h3>Основные обязанности:</h3>
<ul>
<li>Сбор, аннотирование и предобработка данных для обучения моделей</li>
<li>Разработка методов аугментации данных для улучшения качества обучения</li>
<li>Подготовка научных публикаций, отчетов и презентаций о результатах исследований</li>
<li>Ведение документации по проектам и моделям</li>
<li>Участие в обсуждениях, семинарах и конференциях для обмена опытом и знаниями</li>
</ul>`,
      createdAt: new Date("2025-01-10"),
      category: "VACANCY" as const,
      imageUrl: null,
      author: { name: "HR отдел", email: "" },
      published: true,
      slug: "research-engineer-1st-category",
      positions: "1 вакансия",
      employment: "Полная занятость",
      contract: "Срочный трудовой договор до 31.12.2026 г.",
      department: "Лаборатория интеллектуальных систем и анализа данных",
    },
  ];

  const finalVacancies = displayVacancies.length > 0 ? displayVacancies : (fallbackVacancies as any[]);
  
  console.log('Final vacancies to display:', finalVacancies.length, finalVacancies);

  const extractFirstSentence = (content: string, maxLength: number = 150) => {
    // Удаляем HTML теги и берем первые предложения
    const plainText = content.replace(/<[^>]*>/g, "").trim();
    if (plainText.length <= maxLength) return plainText;

    const sentences = plainText.split(/[.!?]+/);
    let result = sentences[0];
    let i = 1;

    while (
      i < sentences.length &&
      (result + sentences[i]).length <= maxLength
    ) {
      result += "." + sentences[i];
      i++;
    }

    return result + (result.length < plainText.length ? "..." : "");
  };

  const getStatusBadge = (createdAt: Date) => {
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays <= 7) {
      return { text: "Новая вакансия", variant: "default" as const };
    } else if (diffInDays <= 30) {
      return { text: "Открыт набор", variant: "secondary" as const };
    } else {
      return { text: "Активная", variant: "outline" as const };
    }
  };

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
              <Briefcase className="w-4 h-4 mr-2" />
              Карьерные возможности
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Открытые вакансии
            </h1>
            <p className="text-xl text-gray-100 leading-relaxed">
              Присоединяйтесь к нашей команде исследователей и разработчиков в области искусственного интеллекта
            </p>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalPosts}</div>
              <div className="text-sm text-gray-600">открытых вакансий</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">сотрудников</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-sm text-gray-600">лаборатории</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">поддержка</div>
            </div>
          </div>
        </div>
      </div>

      {/* Основное содержание */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Заголовок секции */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Доступные позиции</h2>
          <p className="text-xl text-muted-foreground">
            Найдите идеальную возможность для развития вашей карьеры в области ИИ
          </p>
        </div>

        <section id="vacancies">
          <div className="max-w-7xl mx-auto">
            {/* Адаптивная сетка: 1 колонка на mobile, 2 на tablet, 3 на desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {finalVacancies.map((vacancy) => {
                const status = getStatusBadge(new Date(vacancy.createdAt));

                return (
                  <Card
                    key={vacancy.id}
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="p-6 h-full flex flex-col">
                      {/* Header с бейджами */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          <Briefcase className="w-3 h-3 mr-1" />
                          Вакансия
                        </Badge>
                        <Badge variant={status.variant}>{status.text}</Badge>
                      </div>

                      {/* Заголовок */}
                      <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {vacancy.title}
                      </h3>

                      {/* Департамент */}
                      <div className="flex items-start gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground text-sm">
                          {(vacancy as any).department ||
                            "Лаборатория интеллектуальных систем и анализа данных"}
                        </p>
                      </div>

                      {/* Описание */}
                      <p className="text-muted-foreground text-sm line-clamp-4 mb-4 flex-grow">
                        {extractFirstSentence(vacancy.description)}
                      </p>

                      {/* Детали вакансии */}
                      <div className="space-y-2 mb-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Позиций:</span>
                          <span className="font-medium">{(vacancy as any).positions}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Занятость:</span>
                          <span className="font-medium">{(vacancy as any).employment}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Контракт:</span>
                          <span className="font-medium text-xs">{(vacancy as any).contract}</span>
                        </div>
                      </div>

                      {/* Кнопка "Подробнее" */}
                      <GradientButton 
                        href={`/vacancies/${vacancy.slug}`}
                        variant="gray"
                        className="w-full"
                      >
                        Подробнее о позиции
                        <ExternalLink className="h-4 w-4" />
                      </GradientButton>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Пустое состояние */}
            {finalVacancies.length === 0 && (
              <Card className="py-16">
                <CardContent className="text-center">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Открытых вакансий пока нет
                  </h3>
                  <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                    Мы постоянно растем! Следите за обновлениями или отправьте резюме для рассмотрения в будущем.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Badge variant="outline" className="text-sm">
                      📧 hr@ipii-ai.ru
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      💼 Инициативные заявки приветствуются
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Пагинация */}
        <div className="mt-16 pt-8 border-t">
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>

        {/* Call to Action */}
        <div className="mt-16 pt-12 border-t">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-purple-900 mb-4">
                Не нашли подходящую вакансию?
              </h3>
              <p className="text-purple-700 mb-6 max-w-2xl mx-auto">
                Мы всегда ищем талантливых специалистов! Отправьте нам свое резюме, 
                и мы рассмотрим возможности сотрудничества.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge variant="outline" className="bg-white/50 text-purple-700 px-4 py-2">
                  ✉️ Отправить резюме: hr@ipii-ai.ru
                </Badge>
                <Badge variant="outline" className="bg-white/50 text-purple-700 px-4 py-2">
                  📞 Телефон: +7 (XXX) XXX-XX-XX
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
