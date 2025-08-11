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
    <section className="py-16 bg-gradient-to-b from-[#f8fafc] via-[#f8fafc] to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Новости и события
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Следите за последними новостями и достижениями совета молодых ученых ФГБНУ ИПИИ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Нет изображения</span>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{getCategoryLabel(post.category)}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(post.createdAt), "d MMMM yyyy", { locale: ru })}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-semibold line-clamp-2 text-lg">{post.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3">{post.description}</p>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span className="line-clamp-1">
                      {post.author?.name || 'Администратор'}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onReadNews?.(post)}
                    className="shrink-0"
                  >
                    Читать
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {displayPosts.length > 0 && (
          <div className="text-center mt-16">
            <Link href="/news" >
              Все новости
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}