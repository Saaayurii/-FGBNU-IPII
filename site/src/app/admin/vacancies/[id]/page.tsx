"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPostById } from "@/actions/posts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Edit, Calendar, User, Eye, MapPin, Briefcase, DollarSign, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AdminPost } from "@/types";

export default function ViewVacancyPage() {
  const [vacancy, setVacancy] = useState<AdminPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  if (!vacancy) {
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
          <AlertDescription>Вакансия не найдена</AlertDescription>
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
          <Link href={`/admin/vacancies/${vacancy.id}/edit`}>
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
                <Badge className="bg-green-100 text-green-800">
                  Вакансия
                </Badge>
                <Badge variant={vacancy.published ? "default" : "secondary"}>
                  {vacancy.published ? "Активна" : "Неактивна"}
                </Badge>
              </div>
              <CardTitle className="text-2xl leading-tight">
                {vacancy.title}
              </CardTitle>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {vacancy.author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{vacancy.author.name || vacancy.author.email}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(vacancy.createdAt).toLocaleDateString("ru-RU")}
              </span>
            </div>
            {vacancy._count?.views && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{vacancy._count.views} просмотров</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {vacancy.imageUrl && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={vacancy.imageUrl}
                alt={vacancy.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancy.location && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-sm">Местоположение</div>
                  <div className="text-gray-600">{vacancy.location}</div>
                </div>
              </div>
            )}

            {vacancy.employmentType && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Briefcase className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-sm">Тип занятости</div>
                  <div className="text-gray-600">{vacancy.employmentType}</div>
                </div>
              </div>
            )}

            {vacancy.salary && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-medium text-sm">Заработная плата</div>
                  <div className="text-gray-600">{vacancy.salary}</div>
                </div>
              </div>
            )}
          </div>

          {vacancy.description && (
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold mb-2">Описание вакансии</h3>
              <p className="text-muted-foreground leading-relaxed">
                {vacancy.description}
              </p>
            </div>
          )}

          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold mb-2">Подробная информация</h3>
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: vacancy.content }}
            />
          </div>

          {vacancy.requirements && (
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Требования к кандидату
              </h3>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {vacancy.requirements}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}