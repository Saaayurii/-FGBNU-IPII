"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Users,
  Image as ImageIcon,
  Mail,
  Eye,
  TrendingUp,
  Target,
} from "lucide-react";
import { getPostsStats } from "@/actions/posts";
import { getSubscribersStats } from "@/actions/subscribers";
import { getSliderStats } from "@/actions/slider";
import { getNewsletterStats } from "@/actions/newsletter";
import type {
  PostsStats,
  SubscribersStats,
  SliderStats,
  NewsletterStats,
} from "@/types";

export var AdminStats = () => {
  const { 0: postsStats, 1: setPostsStats } = useState<PostsStats | null>(null);
  const { 0: subscribersStats, 1: setSubscribersStats } =
    useState<SubscribersStats | null>(null);
  const { 0: sliderStats, 1: setSliderStats } = useState<SliderStats | null>(
    null
  );
  const { 0: newsletterStats, 1: setNewsletterStats } =
    useState<NewsletterStats | null>(null);
  const { 0: loading, 1: setLoading } = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [posts, subscribers, slider, newsletter] = await Promise.all([
          getPostsStats(),
          getSubscribersStats(),
          getSliderStats(),
          getNewsletterStats(),
        ]);

        setPostsStats(posts);
        setSubscribersStats(subscribers);
        setSliderStats(slider);
        setNewsletterStats(newsletter);
      } catch (error) {
        console.error("Ошибка при загрузке статистики:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      title: "Всего публикаций",
      value: postsStats?.totalPosts || 0,
      change: `${postsStats?.publishedPosts || 0} опубликовано`,
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Просмотры публикаций",
      value: postsStats?.totalViews || 0,
      change: `${postsStats?.featuredPosts || 0} в избранном`,
      icon: Eye,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Всего подписчиков",
      value: subscribersStats?.total || 0,
      change: `${subscribersStats?.active || 0} активных (${Math.round(subscribersStats?.activeRate || 0)}%)`,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Новые подписчики в этом месяце",
      value: subscribersStats?.newThisMonth || 0,
      change: "Рост за месяц",
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Изображения в слайдере",
      value: sliderStats?.totalImages || 0,
      change: `${sliderStats?.activeImages || 0} активных`,
      icon: ImageIcon,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Рассылка",
      value: newsletterStats?.totalEmails || 0,
      change: `Успешно: ${Math.round(newsletterStats?.successRate || 0)}%`,
      icon: Mail,
      color: "text-cyan-600 dark:text-cyan-400",
    },
    {
      title: "Новости",
      value: postsStats?.byCategory?.news || 0,
      change: "Публикаций в категории новости",
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Вакансии",
      value: postsStats?.byCategory?.vacancy || 0,
      change: "Публикаций в категории вакансии",
      icon: Target,
      color: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Раздел с детализацией по категориям публикаций и рассылке */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Статистика по категориям публикаций
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Новости</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {postsStats?.byCategory?.news || 0}
                </Badge>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${((postsStats?.byCategory?.news || 0) / (postsStats?.totalPosts || 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Вакансии</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {postsStats?.byCategory?.vacancy || 0}
                </Badge>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{
                      width: `${((postsStats?.byCategory?.vacancy || 0) / (postsStats?.totalPosts || 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Объявления</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {postsStats?.byCategory?.announcement || 0}
                </Badge>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{
                      width: `${((postsStats?.byCategory?.announcement || 0) / (postsStats?.totalPosts || 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">События</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {postsStats?.byCategory?.event || 0}
                </Badge>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${((postsStats?.byCategory?.event || 0) / (postsStats?.totalPosts || 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-cyan-600" />
              Статистика рассылки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Успешные письма</span>
              <Badge className="bg-green-100 text-green-800">
                {newsletterStats?.successfulEmails || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Не доставлено</span>
              <Badge className="bg-red-100 text-red-800">
                {newsletterStats?.failedEmails || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Процент успешной доставки
              </span>
              <Badge className="bg-blue-100 text-blue-800">
                {Math.round(newsletterStats?.successRate || 0)}%
              </Badge>
            </div>
            <div className="pt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${newsletterStats?.successRate || 0}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
