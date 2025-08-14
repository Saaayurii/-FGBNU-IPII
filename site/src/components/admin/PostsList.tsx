"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { ImagePreview } from "./ImagePreview";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: "NEWS" | "VACANCY" | "ANNOUNCEMENT" | "EVENT";
  imageUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PostsListProps {
  posts: Post[];
  onDelete: (id: string) => Promise<void>;
  onTogglePublished: (id: string, published: boolean) => Promise<void>;
  isLoading?: boolean;
}

export var PostsList = ({
  posts,
  onDelete,
  onTogglePublished,
  isLoading = false,
}: PostsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "ALL" | "NEWS" | "VACANCY" | "ANNOUNCEMENT" | "EVENT"
  >("ALL");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PUBLISHED" | "DRAFT"
  >("ALL");

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || post.category === categoryFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PUBLISHED" && post.published) ||
      (statusFilter === "DRAFT" && !post.published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "NEWS":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Новости
          </Badge>
        );
      case "VACANCY":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Вакансии
          </Badge>
        );
      case "ANNOUNCEMENT":
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            Объявления
          </Badge>
        );
      case "EVENT":
        return (
          <Badge variant="default" className="bg-orange-100 text-orange-800">
            События
          </Badge>
        );
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const getStatusBadge = (published: boolean) => {
    return published ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Опубликовано
      </Badge>
    ) : (
      <Badge variant="secondary">Черновик</Badge>
    );
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Удалить запись "${title}"?`)) {
      await onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Фильтры и поиск */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Поиск по заголовку или описанию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={categoryFilter}
          onValueChange={(value: any) => setCategoryFilter(value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Все</SelectItem>
            <SelectItem value="NEWS">Новости</SelectItem>
            <SelectItem value="VACANCY">Вакансии</SelectItem>
            <SelectItem value="ANNOUNCEMENT">Объявления</SelectItem>
            <SelectItem value="EVENT">События</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value: any) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Все</SelectItem>
            <SelectItem value="PUBLISHED">Опубликовано</SelectItem>
            <SelectItem value="DRAFT">Черновик</SelectItem>
          </SelectContent>
        </Select>

        <Link href="/admin/news/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Добавить
          </Button>
        </Link>
      </div>

      {/* Список постов */}
      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">
                {searchTerm ||
                categoryFilter !== "ALL" ||
                statusFilter !== "ALL"
                  ? "Ничего не найдено"
                  : "Нет записей"}
              </div>
              <p className="text-sm text-gray-400 mb-4">
                {searchTerm ||
                categoryFilter !== "ALL" ||
                statusFilter !== "ALL"
                  ? "Попробуйте изменить фильтры или поиск"
                  : "Добавьте первую запись"}
              </p>
              {!searchTerm &&
                categoryFilter === "ALL" &&
                statusFilter === "ALL" && (
                  <Link href="/admin/news/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить запись
                    </Button>
                  </Link>
                )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Превью изображения */}
                  {post.imageUrl && (
                    <div className="flex-shrink-0">
                      <ImagePreview
                        src={post.imageUrl}
                        alt={post.title}
                        width={120}
                        height={80}
                        showDownload
                      />
                    </div>
                  )}

                  {/* Контент */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {post.title}
                      </h3>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/news/${post.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Редактировать
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onTogglePublished(post.id, !post.published)
                            }
                          >
                            {post.published ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Скрыть
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Опубликовать
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(post.id, post.title)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-4 flex-wrap">
                      {getCategoryBadge(post.category)}
                      {getStatusBadge(post.published)}

                      <div className="text-xs text-gray-500">
                        Создано:{" "}
                        {new Date(post.createdAt).toLocaleDateString("ru-RU")}
                      </div>

                      {post.updatedAt !== post.createdAt && (
                        <div className="text-xs text-gray-500">
                          Обновлено:{" "}
                          {new Date(post.updatedAt).toLocaleDateString("ru-RU")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
