import { NewsItem, NewsListResponse } from './news';

// Моковые данные для демонстрации
const mockNews: NewsItem[] = [
  {
    id: 1,
    title: "Запуск нового продукта",
    slug: "product-launch",
    date: "2023-10-15",
    excerpt: "Мы рады объявить о запуске нашего флагманского продукта... Мы рады объявить о запуске нашего флагманского продукта... Мы рады объявить о запуске нашего флагманского продукта...",
    content: "В современном мире информационные технологии играют ключевую роль в развитии общества. Каждая сфера нашей жизни так или иначе связана с цифровыми решениями: от общения и получения знаний до работы и отдыха. Интернет стал неотъемлемой частью повседневности, а мобильные устройства позволяют быть на связи практически в любом месте. Мы привыкли получать новости мгновенно, совершать покупки онлайн и управлять процессами на расстоянии.Однако столь бурное развитие технологий несёт с собой и определённые вызовы. Вопросы конфиденциальности, защиты данных и цифровой безопасности становятся всё более актуальными. Компании и разработчики обязаны уделять внимание надёжности своих систем, чтобы защитить пользователей от киберугроз. С другой стороны, сами пользователи должны осознавать риски и соблюдать правила цифровой гигиены.Не менее важным является и вопрос адаптации образования к новым условиям. Сегодня детям и взрослым необходимы навыки, которые позволят эффективно работать с информацией, критически её оценивать и создавать собственный цифровой контент. Образовательные платформы, онлайн-курсы и интерактивные приложения помогают расширять знания, но требуют от педагогов нового подхода к обучению.В бизнес-среде цифровизация открывает огромные возможности. Автоматизация процессов, анализ больших данных и внедрение искусственного интеллекта позволяют компаниям быстрее реагировать на изменения рынка и предлагать клиентам более персонализированные решения. Конкуренция усиливается, и выигрывают те, кто умеет гибко адаптироваться и внедрять инновации.Вместе с тем важно помнить, что технологии — это инструмент, а не цель. Их основная задача — улучшать качество жизни людей, облегчать труд, помогать в принятии решений и расширять горизонты. При этом человек остаётся в центре всех процессов, и именно от нас зависит, в каком направлении будет развиваться цифровая среда.Будущее обещает быть ещё более технологичным. Развитие искусственного интеллекта, виртуальной и дополненной реальности, Интернета вещей и робототехники создаст новые форматы взаимодействия с миром. Но вместе с этим появятся и новые вопросы: как сохранить баланс между автоматизацией и человеческим участием, как не потерять личное пространство, как обеспечить справедливый доступ к технологиям для всех.Таким образом, технологический прогресс открывает перед нами широкие перспективы, но требует осознанного подхода. Только сочетание инноваций, этики и ответственности позволит построить цифровое будущее, в котором комфорт, безопасность и развитие будут идти рука об руку.",
    category: "Совет молодых ученых",
    image: "http://172.16.0.34/storage/posts/preview_images/Qd4g93fZnF8FQzauJn5oi3idOdpCPbuDefWlj1mI.jpg"
  },
  {
    id: 2,
    title: "Партнерство с ведущей компанией",
    slug: "new-partnership",
    date: "2023-10-10",
    excerpt: "Заключено стратегическое партнерство с мировым лидером...",
    content: "Полное содержание новости...",
    category: "Отдел образования",
    image: "http://172.16.0.34/storage/posts/preview_images/A604wzDp7hlOIKIbF6gX1TRdZheGfNGwZXwyF5X2.jpg"
  },
  {
    id: 3,
    title: "Запуск нового продукта 2",
    slug: "product-launch",
    date: "2023-10-15",
    excerpt: "Мы рады объявить о запуске нашего флагманского продукта...",
    content: "Полное содержание новости...",
    category: "Научный отдел",
    image: "/images/news/product.jpg"
  },
  {
    id: 4,
    title: "Партнерство с ведущей компанией 2",
    slug: "new-partnership",
    date: "2023-10-10",
    excerpt: "Заключено стратегическое партнерство с мировым лидером...",
    content: "Полное содержание новости...",
    category: "Бизнес"
  },
  {
    id: 5,
    title: "Запуск нового продукта 3",
    slug: "product-launch",
    date: "2023-10-15",
    excerpt: "Мы рады объявить о запуске нашего флагманского продукта...",
    content: "Полное содержание новости...",
    category: "Технологии",
    image: "/images/news/product.jpg"
  },
  {
    id: 6,
    title: "Партнерство с ведущей компанией 3",
    slug: "new-partnership",
    date: "2023-10-10",
    excerpt: "Заключено стратегическое партнерство с мировым лидером...",
    content: "Полное содержание новости...",
    category: "Бизнес"
  },
  // ...другие элементы
];

export async function fetchNews(
  page: number = 1, 
  perPage: number = 6,
  filters: { from?: string; to?: string; category?: string }
): Promise<NewsListResponse> {
  // Клонируем массив для работы
  let filteredNews = [...mockNews];
  
  // Фильтр по категории с проверкой на undefined
  if (filters.category && filters.category.trim() !== "") {
    const categoryLower = filters.category.toLowerCase();
    filteredNews = filteredNews.filter(item => 
      item.category.toLowerCase().includes(categoryLower)
    );
  }
  
  // Фильтр по дате "от"
  if (filters.from) {
    const fromDate = new Date(filters.from);
    // Проверка валидности даты
    if (!isNaN(fromDate.getTime())) {
      filteredNews = filteredNews.filter(item => {
        const itemDate = new Date(item.date);
        return !isNaN(itemDate.getTime()) && itemDate >= fromDate;
      });
    }
  }
  
  // Фильтр по дате "до"
  if (filters.to) {
    const toDate = new Date(filters.to);
    // Проверка валидности даты
    if (!isNaN(toDate.getTime())) {
      filteredNews = filteredNews.filter(item => {
        const itemDate = new Date(item.date);
        return !isNaN(itemDate.getTime()) && itemDate <= toDate;
      });
    }
  }
  
  // Пагинация
  const startIndex = (page - 1) * perPage;
  const totalItems = filteredNews.length;
  const totalPages = Math.ceil(totalItems / perPage);
  
  // Корректировка страницы, если она выходит за пределы
  const correctedPage = page < 1 ? 1 : page > totalPages ? totalPages : page;
  const paginatedNews = filteredNews.slice(
    (correctedPage - 1) * perPage,
    correctedPage * perPage
  );
  
  return {
    news: paginatedNews,
    totalPages: totalPages || 1,
    currentPage: correctedPage,
    totalItems
  };
}

export async function fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
  const newsItem = mockNews.find(item => item.slug === slug);
  return newsItem || null;
}

export async function fetchCategories(): Promise<string[]> {
  return Array.from(new Set(mockNews.map(item => item.category)));
}