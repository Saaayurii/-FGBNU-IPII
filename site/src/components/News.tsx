"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
import Image from "next/image";
import { PostWithAuthor } from "@/types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";

interface NewsProps {
  onViewAllNews?: () => void;
  posts?: PostWithAuthor[];
  onReadNews?: (post: PostWithAuthor) => void;
}

export function News({ onViewAllNews, posts = [], onReadNews }: NewsProps) {
  // Фильтруем только опубликованные новости и берем последние 6
  const publishedPosts = posts
    .filter(post => post.published && post.category === 'NEWS')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  // Fallback данные если нет постов
  const fallbackNews = [
    {
      id: "1",
      title: "Победа в конкурсе инновационных проектов",
      description: "Команда ЛИСАД заняла первое место в региональном конкурсе инновационных проектов с разработкой в области машинного обучения",
      createdAt: new Date("2025-01-15"),
      category: "NEWS" as const,
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      author: { name: "Совет молодых ученых", email: "" },
      published: true,
      slug: "victory-in-innovation-contest"
    },
    {
      id: "2",
      title: "Открытие нового курса по искусственному интеллекту",
      description: "Стартует образовательная программа 'Основы ИИ для молодых исследователей' в рамках деятельности совета молодых ученых",
      createdAt: new Date("2025-01-10"),
      category: "NEWS" as const,
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
      author: { name: "Отдел образования", email: "" },
      published: true,
      slug: "new-ai-course"
    },
    {
      id: "3",
      title: "Международная конференция по нейросетям",
      description: "Члены ЛИСАД примут участие в международной конференции Neural Networks 2025 в Берлине с докладом о новых алгоритмах",
      createdAt: new Date("2025-01-08"),
      category: "NEWS" as const,
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      author: { name: "Научный отдел", email: "" },
      published: true,
      slug: "neural-networks-conference"
    }
  ];

  const displayPosts = publishedPosts.length > 0 ? publishedPosts : fallbackNews as any[];

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
    <section className="py-16 bg-[#f8fafc] dark:bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            Новости и события
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Следите за последними новостями и достижениями совета молодых ученых ФГБНУ ИПИИ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <Card key={post.id} className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col py-0 pb-4 cursor-pointer">
              {post.imageUrl ? (
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    width={500}
                    height={281}
                  />
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    {post.category}
                  </div>
                </div>
              ) : (
                <div className="w-[100%] h-[200px] bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Нет изображения</span>
                </div>
              )}

              <div className="px-4 pb-4">
                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors dark:text-black">
                  {post.title}
                </h3>

                <time className="block text-sm text-gray-500 mb-3">
                  {format(new Date(post.createdAt), "d MMMM yyyy", { locale: ru })}
                </time>

                <p className="text-gray-600 line-clamp-2">{post.description}</p>

                <div className="mt-4 flex items-center text-blue-500 font-medium text-sm group-hover:underline" onClick={() => onReadNews?.(post)}>
                  Читать далее
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {displayPosts.length > 0 && (
          <div className="text-center mt-10  block m-auto">
            <Link href="/news" className="bg-blue-600 text-white rounded-md p-5 py-2 hover:bg-blue-800">
              Все новости
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}