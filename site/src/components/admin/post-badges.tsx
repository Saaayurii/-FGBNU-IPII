import { Badge } from "@/components/ui/badge";

export const getCategoryBadge = (category: string) => {
  switch (category) {
    case "NEWS":
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          Новости
        </Badge>
      );
    case "VACANCY":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Вакансии
        </Badge>
      );
    case "ANNOUNCEMENT":
      return (
        <Badge variant="default" className="bg-purple-100 text-purple-800">
          Объявления
        </Badge>
      );
    case "EVENT":
      return (
        <Badge variant="default" className="bg-orange-100 text-orange-800">
          События
        </Badge>
      );
    default:
      return <Badge variant="outline">{category}</Badge>;
  }
};

export const getStatusBadge = (published: boolean) => {
  return published ? (
    <Badge variant="default" className="bg-green-100 text-green-800">
      Опубликовано
    </Badge>
  ) : (
    <Badge variant="secondary">Черновик</Badge>
  );
};