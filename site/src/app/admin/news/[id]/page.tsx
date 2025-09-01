"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPostById } from "@/actions/posts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Edit, Calendar, User, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AdminPost } from "@/types";

export default function ViewPostPage() {
  const [post, setPost] = useState<AdminPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        const postData = await getPostById(postId);

        if (!postData) {
          setError("Пост не найден");
          return;
        }

        setPost(postData);
      } catch (err) {
        setError("Ошибка при загрузке поста");
        console.error("Error loading post:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      loadPost();
    }
  }, [postId]);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "NEWS":
        return "Новость";
      case "VACANCY":
        return "Вакансия";
      case "ANNOUNCEMENT":
        return "Объявление";
      case "EVENT":
        return "Событие";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "NEWS":
        return "bg-blue-100 text-blue-800";
      case "VACANCY":
        return "bg-green-100 text-green-800";
      case "ANNOUNCEMENT":
        return "bg-yellow-100 text-yellow-800";
      case "EVENT":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Загрузка поста...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </div>
        <Alert>
          <AlertDescription>Пост не найден</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>

        <Button
          asChild
          size="sm"
          className="flex items-center gap-2"
        >
          <Link href={`/admin/news/${post.id}/edit`}>
            <Edit className="h-4 w-4" />
            Редактировать
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(post.category)}>
                  {getCategoryLabel(post.category)}
                </Badge>
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? "Опубликовано" : "Черновик"}
                </Badge>
              </div>
              <CardTitle className="text-2xl leading-tight">
                {post.title}
              </CardTitle>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {post.author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author.name || post.author.email}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(post.createdAt).toLocaleDateString("ru-RU")}
              </span>
            </div>
            {post._count?.views && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post._count.views} просмотров</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {post.imageUrl && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          {post.description && (
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold mb-2">Описание</h3>
              <p className="text-muted-foreground leading-relaxed">
                {post.description}
              </p>
            </div>
          )}

          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold mb-2">Содержание</h3>
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {post.category === "VACANCY" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              {post.location && (
                <div>
                  <h4 className="font-medium mb-1">Местоположение</h4>
                  <p className="text-sm text-muted-foreground">{post.location}</p>
                </div>
              )}
              {post.employmentType && (
                <div>
                  <h4 className="font-medium mb-1">Тип занятости</h4>
                  <p className="text-sm text-muted-foreground">{post.employmentType}</p>
                </div>
              )}
              {post.salary && (
                <div>
                  <h4 className="font-medium mb-1">Заработная плата</h4>
                  <p className="text-sm text-muted-foreground">{post.salary}</p>
                </div>
              )}
              {post.requirements && (
                <div className="md:col-span-2">
                  <h4 className="font-medium mb-1">Требования</h4>
                  <p className="text-sm text-muted-foreground">{post.requirements}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}