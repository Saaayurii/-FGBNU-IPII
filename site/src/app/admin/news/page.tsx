"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PostsList } from "@/components/admin/PostsList";
import { getAllPostsForAdmin, deletePost, updatePost } from "@/actions/posts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileText, Eye, PenTool, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  category: "NEWS" | "VACANCY" | "ANNOUNCEMENT" | "EVENT";
  imageUrl?: string;
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string | null;
    email: string;
  } | null;
}

interface PostsData {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
  };
}

export default function NewsPage() {
  const { 0: postsData, 1: setPostsData } = useState<PostsData | null>(null);
  const { 0: isLoading, 1: setIsLoading } = useState(true);
  const { 0: error, 1: setError } = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const data = await getAllPostsForAdmin(1, 50);
      setPostsData(data);
    } catch (err) {
      setError("Ошибка при загрузке постов");
      console.error("Error loading posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const result = await deletePost(id);
      if (result.success) {
        toast.success("Пост успешно удален");
        await loadPosts();
      } else {
        toast.error("Ошибка при удалении поста");
      }
    } catch (err) {
      toast.error("Ошибка при удалении поста");
      console.error("Error deleting post:", err);
    }
  };

  const handleTogglePublished = async (id: string, published: boolean) => {
    try {
      const result = await updatePost(id, { published });
      if (result.success) {
        toast.success(published ? "Пост опубликован" : "Пост скрыт");
        await loadPosts();
      } else {
        toast.error("Ошибка при изменении статуса поста");
      }
    } catch (err) {
      toast.error("Ошибка при изменении статуса поста");
      console.error("Error toggling post status:", err);
    }
  };

  const getStats = () => {
    if (!postsData) return null;

    const totalPosts = postsData.posts.length;
    const publishedPosts = postsData.posts.filter((p) => p.published).length;
    const draftPosts = totalPosts - publishedPosts;
    const totalViews = postsData.posts.reduce(
      (sum, post) => sum + post.views,
      0
    );

    return { totalPosts, publishedPosts, draftPosts, totalViews };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Загрузка постов...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const formattedPosts =
    postsData?.posts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.description || post.excerpt || "",
      category: post.category as "NEWS" | "VACANCY" | "ANNOUNCEMENT" | "EVENT",
      imageUrl: post.imageUrl,
      published: post.published,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    })) || [];

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Управление контентом
        </h1>
        <p className="text-muted-foreground">
          Создавайте и управляйте новостями, вакансиями и другим контентом
        </p>
      </div>

      {/* Статистика */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всего постов
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                Все созданные посты
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Опубликовано
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.publishedPosts}
              </div>
              <p className="text-xs text-muted-foreground">
                Доступно для просмотра
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Черновики</CardTitle>
              <PenTool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.draftPosts}
              </div>
              <p className="text-xs text-muted-foreground">Не опубликованы</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Просмотры</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Общее количество</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Список постов */}
      <Card>
        <CardHeader>
          <CardTitle>Все посты</CardTitle>
          <CardDescription>
            Управляйте всеми постами, фильтруйте по категориям и статусу
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostsList
            posts={formattedPosts}
            onDelete={handleDelete}
            onTogglePublished={handleTogglePublished}
            isLoading={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
