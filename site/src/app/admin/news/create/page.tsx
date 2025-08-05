'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PostForm } from '@/components/admin/PostForm';
import { createPost } from '@/actions/posts';
import { toast } from 'sonner';

export default function CreatePostPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (data: any) => {
    if (!session?.user?.id) {
      toast.error('Необходимо войти в систему');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createPost({
        title: data.title,
        description: data.excerpt,
        content: data.content,
        category: data.category,
        imageUrl: data.imageUrl,
        published: data.published,
        featured: false,
        authorId: session.user.id
      });

      if (result.success) {
        toast.success('Пост успешно создан');
        router.push('/admin/news');
      } else {
        toast.error('Ошибка при создании поста');
      }
    } catch (error) {
      toast.error('Ошибка при создании поста');
      console.error('Error creating post:', error);
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