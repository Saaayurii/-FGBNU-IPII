"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PostForm } from "@/components/admin/PostForm";
import { getPostById, updatePost } from "@/actions/posts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPost } from "@/types";

type Post = AdminPost;

export default function EditPostPage() {
  const { 0: post, 1: setPost } = useState<Post | null>(null);
  const { 0: isLoading, 1: setIsLoading } = useState(true);
  const { 0: isSaving, 1: setIsSaving } = useState(false);
  const { 0: error, 1: setError } = useState<string | null>(null);
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

  const handleSubmit = async (data: Record<string, unknown>) => {
    setIsSaving(true);
    try {
      const result = await updatePost(postId, {
        title: data.title as string,
        description: data.excerpt as string,
        content: data.content as string,
        category: data.category as "NEWS" | "VACANCY" | "ANNOUNCEMENT" | "EVENT",
        imageUrl: data.imageUrl as string | undefined,
        published: data.published as boolean,
      });

      if (result.success) {
        toast.success("Пост успешно обновлен");
        router.push("/admin/news");
      } else {
        toast.error("Ошибка при обновлении поста");
      }
    } catch (error) {
      toast.error("Ошибка при обновлении поста");
      console.error("Error updating post:", error);
    } finally {
      setIsSaving(false);
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
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!post) {
    return (
      <Alert>
        <AlertDescription>Пост не найден</AlertDescription>
      </Alert>
    );
  }

  const initialData = {
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.description,
    category: post.category as "NEWS" | "VACANCY" | "ANNOUNCEMENT" | "EVENT",
    imageUrl: post.imageUrl,
    published: post.published,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Редактировать пост
        </h1>
        <p className="text-muted-foreground">
          Внесите изменения в существующий пост
        </p>
      </div>

      <PostForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </div>
  );
}
