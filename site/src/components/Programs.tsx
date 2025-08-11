"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Users,
  Briefcase,
  FileText,
  ExternalLink,
} from "lucide-react";
import { PostWithAuthor } from "@/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface ProgramsProps {
  vacancies?: PostWithAuthor[];
  onViewVacancy?: (vacancy: PostWithAuthor) => void;
}

export function Programs({ vacancies = [], onViewVacancy }: ProgramsProps) {
  // Фильтруем только опубликованные вакансии
  const publishedVacancies = vacancies
    .filter((vacancy) => vacancy.published && vacancy.category === "VACANCY")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

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
    <section
      id="vacancies"
      className="py-16 bg-gradient-to-b from-background via-background to-[#f8fafc]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Актуальные вакансии
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Присоединяйтесь к нашей команде исследователей в области
            компьютерного зрения и искусственного интеллекта
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {displayVacancies.map((vacancy) => {
            const status = getStatusBadge(new Date(vacancy.createdAt));

            return (
              <Card
                key={vacancy.id}
                className="p-6 space-y-6 hover:shadow-lg transition-shadow h-fit"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Вакансия</Badge>
                    <Badge variant={status.variant}>{status.text}</Badge>
                  </div>
                  <h3 className="text-xl font-semibold line-clamp-2">
                    {vacancy.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {(vacancy as any).department ||
                      "Лаборатория интеллектуальных систем и анализа данных"}
                  </p>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {extractFirstSentence(vacancy.description)}
                  </p>
                </div>

                <div className="space-y-3">
                  {(vacancy as any).positions && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{(vacancy as any).positions}</span>
                    </div>
                  )}
                  {(vacancy as any).employment && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{(vacancy as any).employment}</span>
                    </div>
                  )}
                  {(vacancy as any).contract && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="line-clamp-1">
                        {(vacancy as any).contract}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Опубликовано{" "}
                      {format(new Date(vacancy.createdAt), "d MMMM yyyy", {
                        locale: ru,
                      })}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onViewVacancy?.(vacancy)}
                  >
                    Подробнее
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {displayVacancies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              В настоящее время открытых вакансий нет. Следите за обновлениями!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
