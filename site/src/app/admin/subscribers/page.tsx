"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Mail,
  Search,
  MoreHorizontal,
  UserPlus,
  Download,
  Trash2,
  UserX,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockSubscribers = [
  {
    id: 1,
    email: "ivan.petrov@example.com",
    name: "Иван Петров",
    subscribeDate: "2024-01-15",
    status: "active",
    source: "website",
  },
  {
    id: 2,
    email: "maria.sidorova@example.com",
    name: "Мария Сидорова",
    subscribeDate: "2024-01-20",
    status: "active",
    source: "newsletter",
  },
  {
    id: 3,
    email: "alex.kozlov@example.com",
    name: "Алексей Козлов",
    subscribeDate: "2024-02-01",
    status: "unsubscribed",
    source: "website",
  },
  {
    id: 4,
    email: "elena.volkova@example.com",
    name: "Елена Волкова",
    subscribeDate: "2024-02-10",
    status: "active",
    source: "website",
  },
];

export default function SubscribersPage() {
  const { 0: searchTerm, 1: setSearchTerm } = useState("");
  const { 0: subscribers, 1: setSubscribers } = useState(mockSubscribers);

  const filteredSubscribers = subscribers.filter(
    (subscriber) =>
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeSubscribers = subscribers.filter(
    (s) => s.status === "active"
  ).length;
  const unsubscribedCount = subscribers.filter(
    (s) => s.status === "unsubscribed"
  ).length;

  const handleUnsubscribe = (id: number) => {
    setSubscribers((prev) =>
      prev.map((subscriber) =>
        subscriber.id === id
          ? { ...subscriber, status: "unsubscribed" as const }
          : subscriber
      )
    );
  };

  const handleDelete = (id: number) => {
    setSubscribers((prev) => prev.filter((subscriber) => subscriber.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Активен
          </Badge>
        );
      case "unsubscribed":
        return <Badge variant="secondary">Отписан</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case "website":
        return <Badge variant="outline">Веб-сайт</Badge>;
      case "newsletter":
        return <Badge variant="outline">Рассылка</Badge>;
      default:
        return <Badge variant="outline">{source}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Подписчики</h1>
        <p className="text-gray-600 mt-1">
          Управление подписчиками и рассылками
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего подписчиков
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
            <p className="text-xs text-muted-foreground">
              Общее количество подписчиков
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные подписчики
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">Получают рассылку</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Отписавшиеся</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unsubscribedCount}</div>
            <p className="text-xs text-muted-foreground">
              Не получают рассылку
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Управление подписчиками */}
      <Card>
        <CardHeader>
          <CardTitle>Список подписчиков</CardTitle>
          <CardDescription>Поиск и управление подписчиками</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Поиск по email или имени..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Добавить подписчика
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Дата подписки</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Источник</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-gray-500">
                        <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">
                          {searchTerm ? "Подписчик не найден" : "Список пуст"}
                        </p>
                        <p className="text-sm text-gray-400">
                          {searchTerm
                            ? "Попробуйте изменить запрос для поиска"
                            : "Подписчики пока отсутствуют"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">
                        {subscriber.email}
                      </TableCell>
                      <TableCell>{subscriber.name}</TableCell>
                      <TableCell>
                        {new Date(subscriber.subscribeDate).toLocaleDateString(
                          "ru-RU"
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(subscriber.status)}</TableCell>
                      <TableCell>{getSourceBadge(subscriber.source)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Отправить письмо
                            </DropdownMenuItem>
                            {subscriber.status === "active" && (
                              <DropdownMenuItem
                                onClick={() => handleUnsubscribe(subscriber.id)}
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Отписать
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDelete(subscriber.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
