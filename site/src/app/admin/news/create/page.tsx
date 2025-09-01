"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PostForm } from "@/components/admin/PostForm";
import { createPost } from "@/actions/posts";
import { toast } from "sonner";

export default function CreatePostPage() {
  const { 0: isLoading, 1: setIsLoading } = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (data: Record<string, unknown>) => {
    console.log("Session data:", session);
    console.log("User ID:", (session?.user as any)?.id);
    
    if (!(session?.user as any)?.id) {
      toast.error("Необходимо войти в систему");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createPost({
        title: data.title as string,
        description: data.excerpt as string,
        content: data.content as string,
        category: data.category as any,
        imageUrl: data.imageUrl as string | undefined,
        published: data.published as boolean | undefined,
        featured: false,
        authorId: (session?.user as any)?.id,
      });

      if (result.success) {
        toast.success("Пост успешно создан");
        router.push("/admin/news");
      } else {
        toast.error("Ошибка при создании поста");
      }
    } catch (error) {
      toast.error("Ошибка при создании поста");
      console.error("Error creating post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Создать пост</h1>
        <p className="text-muted-foreground">
          Добавьте новую новость, вакансию или объявление
        </p>
      </div>

      <PostForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
