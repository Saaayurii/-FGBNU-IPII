"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPostById, updatePost } from "@/actions/posts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PostForm } from "@/components/admin/PostForm";
import { AdminPost } from "@/types";

export default function EditVacancyPage() {
  const [vacancy, setVacancy] = useState<AdminPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const vacancyId = params.id as string;

  useEffect(() => {
    const loadVacancy = async () => {
      try {
        setIsLoading(true);
        const vacancyData = await getPostById(vacancyId);

        if (!vacancyData) {
          setError("Вакансия не найдена");
          return;
        }

        if (vacancyData.category !== "VACANCY") {
          setError("Это не вакансия");
          return;
        }

        setVacancy(vacancyData);
      } catch (err) {
        setError("Ошибка при загрузке вакансии");
        console.error("Error loading vacancy:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (vacancyId) {
      loadVacancy();
    }
  }, [vacancyId]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setIsSaving(true);
    try {
      const result = await updatePost(vacancyId, {
        title: data.title as string,
        description: data.description as string,
        content: data.content as string,
        category: "VACANCY" as const,
        imageUrl: data.imageUrl as string | undefined,
        published: data.published as boolean,
        location: data.location as string | undefined,
        employmentType: data.employmentType as string | undefined,
        salary: data.salary as string | undefined,
        requirements: data.requirements as string | undefined,
      });

      if (result.success) {
        toast.success("Вакансия успешно обновлена");
        router.push("/admin/vacancies");
      } else {
        toast.error("Ошибка при обновлении вакансии");
      }
    } catch (error) {
      toast.error("Ошибка при обновлении вакансии");
      console.error("Error updating vacancy:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Загрузка вакансии...</span>
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

  if (!vacancy) {
    return (
      <Alert>
        <AlertDescription>Вакансия не найдена</AlertDescription>
      </Alert>
    );
  }

  const initialData = {
    id: vacancy.id,
    title: vacancy.title,
    excerpt: vacancy.description,
    content: vacancy.content,
    category: "VACANCY" as const,
    imageUrl: vacancy.imageUrl,
    published: vacancy.published,
    location: vacancy.location,
    employmentType: vacancy.employmentType,
    salary: vacancy.salary,
    requirements: vacancy.requirements,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Редактировать вакансию
        </h1>
        <p className="text-muted-foreground">
          Внесите изменения в существующую вакансию
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