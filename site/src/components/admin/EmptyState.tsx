import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  hasFilters: boolean;
}

export const EmptyState = ({ hasFilters }: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">
            {hasFilters ? "Ничего не найдено" : "Нет записей"}
          </div>
          <p className="text-sm text-gray-400 mb-4">
            {hasFilters
              ? "Попробуйте изменить фильтры или поиск"
              : "Добавьте первую запись"}
          </p>
          {!hasFilters && (
            <Link href="/admin/news/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Добавить запись
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};