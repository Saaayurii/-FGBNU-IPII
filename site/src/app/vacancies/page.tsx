import { Header } from "@/components/Header";
import { Footer } from "@/components/ui/Footer";
import { Pagination } from "@/components/news/Pagination";
import { BackButton } from "@/components/news/BackButton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { PostWithAuthor } from "@/types";
import { fetchNews } from "@/types/api";
import Link from "next/link";

interface ProgramsProps {
  vacancies?: PostWithAuthor[];
  searchParams?: {
    // Добавляем searchParams в props
    page?: string;
    from?: string;
    to?: string;
    category?: string;
  };
}

export default async function VacanciesPage({
  vacancies = [],
  searchParams,
}: ProgramsProps) {
  // Фильтруем только опубликованные вакансии
  const publishedVacancies = vacancies
    .filter((vacancy) => vacancy.published && vacancy.category === "VACANCY")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

  const currentPage = Number(searchParams?.page) || 1;
  const filters = {
    from: searchParams?.from,
    to: searchParams?.to,
    category: searchParams?.category,
  };
  const { totalPages } = await fetchNews(currentPage, 5, filters);

  // Fallback данные если нет вакансий
  const fallbackVacancies = [
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

  const displayVacancies =
    publishedVacancies.length > 0
      ? publishedVacancies
      : (fallbackVacancies as any[]);

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Вакансии</h1>
        {/* Хлебные крошки НА ГЛАВНУЮ */}
        <BackButton />

        <section id="vacancies">
          <div className="max-w-7xl mx-auto">
            <div className="container mx-auto">
              {/* Адаптивная сетка: 1 колонка на mobile, 2 на tablet, 3 на desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayVacancies.map((vacancy) => {
                  const status = getStatusBadge(new Date(vacancy.createdAt));

                  return (
                    <Card
                      key={vacancy.id}
                      className="p-6 flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex-grow space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Badge variant="secondary">Вакансия</Badge>
                          <Badge variant={status.variant}>{status.text}</Badge>
                        </div>

                        {/* Заголовок с адаптивным размером шрифта */}
                        <h3 className="text-lg md:text-xl font-semibold line-clamp-2">
                          {vacancy.title}
                        </h3>

                        {/* Департамент с обработкой переносов */}
                        <p className="text-muted-foreground text-sm hyphens-auto">
                          {(vacancy as any).department ||
                            "Лаборатория интеллектуальных систем и анализа данных"}
                        </p>

                        {/* Описание с адаптивной высотой */}
                        <p className="text-muted-foreground text-sm line-clamp-3 mt-2">
                          {extractFirstSentence(vacancy.description)}
                        </p>
                      </div>

                      {/* Детали вакансии */}
                      <div className="mt-6 space-y-3">
                        {/* ... остальные детали вакансии ... */}
                      </div>

                      {/* Кнопка "Подробнее" */}
                      <div className="pt-4 border-t mt-4 text-center">
                        <Link
                          href={`/vacancies/${vacancy.slug}`}
                          // variant="outline"
                          className="cursor-pointe bg-blue-500 text-white border-blue-500 flex pt-2 pb-2 justify-center items-center rounded-[5px]"
                          // onClick={() => onViewVacancy?.(vacancy)}
                        >
                          Подробнее
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {displayVacancies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  В настоящее время открытых вакансий нет. Следите за
                  обновлениями!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Пагинация (срабатывает если количество статей больше 5) */}
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>

      <Footer />
    </div>
  );
}
