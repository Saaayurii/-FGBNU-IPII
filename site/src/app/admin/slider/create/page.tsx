"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SliderForm } from "@/components/admin/SliderForm";
import { createSliderImage } from "@/actions/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateSliderPage() {
  const { 0: isLoading, 1: setIsLoading } = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    description: string;
    imageUrl: string;
    link?: string;
    isActive: boolean;
    order: number;
  }) => {
    setIsLoading(true);

    try {
      const result = await createSliderImage({
        title: data.title,
        imageUrl: data.imageUrl,
        link: data.link,
        order: data.order,
      });

      if (result.success) {
        toast.success("Изображение слайдера успешно создано!");
        router.push("/admin/slider");
      } else {
        toast.error(result.error || "Не удалось создать изображение слайдера");
      }
    } catch (error) {
      console.error("Error creating slider image:", error);
      toast.error("Произошла ошибка при создании изображения слайдера");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/slider">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к слайдеру
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Добавить изображение в слайдер
          </h1>
          <p className="text-muted-foreground">
            Создание нового изображения для слайдера на главной странице
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Информация об изображении</CardTitle>
        </CardHeader>
        <CardContent>
          <SliderForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
