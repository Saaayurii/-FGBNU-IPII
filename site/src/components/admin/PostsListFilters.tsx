"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

interface PostsListFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: "ALL" | "NEWS" | "VACANCY" | "ANNOUNCEMENT" | "EVENT";
  onCategoryChange: (value: "ALL" | "NEWS" | "VACANCY" | "ANNOUNCEMENT" | "EVENT") => void;
  statusFilter: "ALL" | "PUBLISHED" | "DRAFT";
  onStatusChange: (value: "ALL" | "PUBLISHED" | "DRAFT") => void;
}

export const PostsListFilters = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
}: PostsListFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Поиск по заголовку или описанию..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select
        value={categoryFilter}
        onValueChange={(value: any) => onCategoryChange(value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Категория" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Все</SelectItem>
          <SelectItem value="NEWS">Новости</SelectItem>
          <SelectItem value="VACANCY">Вакансии</SelectItem>
          <SelectItem value="ANNOUNCEMENT">Объявления</SelectItem>
          <SelectItem value="EVENT">События</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={statusFilter}
        onValueChange={(value: any) => onStatusChange(value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Статус" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Все</SelectItem>
          <SelectItem value="PUBLISHED">Опубликовано</SelectItem>
          <SelectItem value="DRAFT">Черновик</SelectItem>
        </SelectContent>
      </Select>

      <Link href="/admin/news/create">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Добавить
        </Button>
      </Link>
    </div>
  );
};