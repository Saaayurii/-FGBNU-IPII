"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Send,
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  Search,
  Mail,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { adminApi } from "@/lib/core";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  status: "draft" | "sent" | "scheduled";
  recipientsCount: number;
  sentAt?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function NewsletterPage() {
  const { 0: newsletters, 1: setNewsletters } = useState<Newsletter[]>([]);
  const { 0: filteredNewsletters, 1: setFilteredNewsletters } = useState<
    Newsletter[]
  >([]);
  const { 0: isLoading, 1: setIsLoading } = useState(true);
  const { 0: searchTerm, 1: setSearchTerm } = useState("");
  const { 0: statusFilter, 1: setStatusFilter } = useState("all");

  useEffect(() => {
    fetchNewsletters();
  }, []);

  useEffect(() => {
    let filtered = newsletters;

    if (searchTerm) {
      filtered = filtered.filter(
        (newsletter) =>
          newsletter.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          newsletter.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (newsletter) => newsletter.status === statusFilter
      );
    }

    setFilteredNewsletters(filtered);
  }, [newsletters, searchTerm, statusFilter]);

  const fetchNewsletters = async () => {
    try {
      const data = await adminApi.newsletters.getAll();
      setNewsletters(data);
      setFilteredNewsletters(data);
    } catch (error) {
      console.error("Error fetching newsletters:", error);
      toast.error("Произошла ошибка при загрузке рассылок");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi.newsletters.delete(id);
      toast.success("Рассылка удалена");
      fetchNewsletters();
    } catch (error) {
      console.error("Error deleting newsletter:", error);
      toast.error("Произошла ошибка при удалении рассылки");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge variant="default" className="bg-green-500">
            Отправлена
          </Badge>
        );
      case "scheduled":
        return <Badge variant="secondary">Запланирована</Badge>;
      case "draft":
      default:
        return <Badge variant="outline">Черновик</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Рассылки</h1>
            <p className="text-muted-foreground">Управление email рассылками</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = {
    total: newsletters.length,
    sent: newsletters.filter((n) => n.status === "sent").length,
    draft: newsletters.filter((n) => n.status === "draft").length,
    scheduled: newsletters.filter((n) => n.status === "scheduled").length,
    totalRecipients: newsletters.reduce((sum, n) => sum + n.recipientsCount, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Рассылки</h1>
          <p className="text-muted-foreground">Управление email рассылками</p>
        </div>
        <Button asChild>
          <Link href="/admin/newsletter/create">
            <Plus className="h-4 w-4 mr-2" />
            Создать рассылку
          </Link>
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Всего
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Отправлено
                </p>
                <p className="text-2xl font-bold">{stats.sent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Edit className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Черновиков
                </p>
                <p className="text-2xl font-bold">{stats.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Запланировано
                </p>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Получателей
                </p>
                <p className="text-2xl font-bold">{stats.totalRecipients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по теме или содержанию..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="draft">Черновики</SelectItem>
                <SelectItem value="sent">Отправленные</SelectItem>
                <SelectItem value="scheduled">Запланированные</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredNewsletters.length === 0 && !isLoading ? (
        searchTerm || statusFilter !== "all" ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground text-center mb-4">
                По вашему запросу не найдено ни одной рассылки. Попробуйте
                изменить критерии поиска.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Сбросить фильтры
              </Button>
            </CardContent>
          </Card>
        ) : newsletters.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Send className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Нет рассылок</h3>
              <p className="text-muted-foreground text-center mb-4">
                Вы еще не создали ни одной рассылки. Создайте первую рассылку
                для общения с подписчиками.
              </p>
              <Button asChild>
                <Link href="/admin/newsletter/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Создать рассылку
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : null
      ) : (
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Показано {filteredNewsletters.length} из {newsletters.length}{" "}
              рассылок
            </p>
          </div>
          {filteredNewsletters.map((newsletter) => (
            <Card key={newsletter.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">
                        {newsletter.subject}
                      </CardTitle>
                      {getStatusBadge(newsletter.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {newsletter.recipientsCount} получателей
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {newsletter.status === "sent" && newsletter.sentAt
                          ? `Отправлена ${new Date(newsletter.sentAt).toLocaleDateString("ru-RU")}`
                          : newsletter.status === "scheduled" &&
                              newsletter.scheduledAt
                            ? `Запланирована на ${new Date(newsletter.scheduledAt).toLocaleDateString("ru-RU")}`
                            : `Создана ${new Date(newsletter.createdAt).toLocaleDateString("ru-RU")}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/newsletter/${newsletter.id}/preview`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Просмотр
                      </Link>
                    </Button>
                    {newsletter.status === "draft" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/newsletter/${newsletter.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Редактировать
                        </Link>
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Удалить рассылку?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Это действие нельзя отменить. Рассылка &quot;
                            {newsletter.subject}&quot; будет удалена навсегда.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(newsletter.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {newsletter.content.replace(/<[^>]*>/g, "").substring(0, 200)}
                  {newsletter.content.length > 200 ? "..." : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
