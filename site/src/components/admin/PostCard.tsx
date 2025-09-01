"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { ImagePreview } from "./ImagePreview";
import { getCategoryBadge, getStatusBadge } from "./post-badges";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: "NEWS" | "VACANCY" | "ANNOUNCEMENT" | "EVENT";
  imageUrl?: string;
  published: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => Promise<void>;
  onTogglePublished: (id: string, published: boolean) => Promise<void>;
}

export const PostCard = ({ post, onDelete, onTogglePublished }: PostCardProps) => {
  const handleDelete = async () => {
    if (window.confirm(`Удалить запись "${post.title}"?`)) {
      await onDelete(post.id);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
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
                    onClick={() => onTogglePublished(post.id, !post.published)}
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
                    onClick={handleDelete}
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
                Создано: {new Date(post.createdAt).toLocaleDateString("ru-RU")}
              </div>

              {post.updatedAt !== post.createdAt && (
                <div className="text-xs text-gray-500">
                  Обновлено: {new Date(post.updatedAt).toLocaleDateString("ru-RU")}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};