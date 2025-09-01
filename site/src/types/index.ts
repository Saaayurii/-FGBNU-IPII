import { Post, User, SliderImage, Subscriber, Category, Role } from '@prisma/client'

// Базовый тип Post с исправленным imageUrl
export type BasePost = Omit<Post, 'imageUrl'> & {
  imageUrl?: string | undefined
}

// Расширенные типы с relations
export type PostWithAuthor = BasePost & {
  author: Pick<User, 'name' | 'email'> | null
}

// Исправленный тип для админки с excerpt
export type AdminPostType = BasePost & {
  author: Pick<User, 'id' | 'name' | 'email'> | null
  excerpt?: string
  _count?: {
    views: number
  }
}

export type AdminPost = BasePost & {
  author: Pick<User, 'id' | 'name' | 'email'> | null
  _count?: {
    views: number
  }
}

export type SliderImageWithStats = SliderImage & {
  _count?: any
}

// Типы для форм
export type CreatePostData = {
  title: string
  description: string
  content: string
  category: Category
  imageUrl?: string
  published?: boolean
  featured?: boolean
  // Поля для вакансий
  location?: string
  employmentType?: string
  salary?: string
  requirements?: string
}

export type UpdatePostData = Partial<CreatePostData> & {
  id: string
}

export type CreateSliderData = {
  title?: string
  imageUrl: string
  link?: string
  order: number
}

// API Response типы
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Типы для пагинации
export type PaginationInfo = {
  page: number
  limit: number
  totalPages: number
  totalCount: number
}

export type PaginatedResponse<T> = {
  items: T[]
  pagination: PaginationInfo
}

export type PostsData = {
  posts: AdminPost[]
  pagination: PaginationInfo
}

// Типы для статистики
export type PostsStats = {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  featuredPosts: number
  totalViews: number
  byCategory: {
    news: number
    vacancy: number
    announcement: number
    event: number
  }
}

export type SubscribersStats = {
  total: number
  active: number
  inactive: number
  newThisMonth: number
  activeRate: number
}

export type SliderStats = {
  totalImages: number
  activeImages: number
  inactiveImages: number
}

export type NewsletterStats = {
  totalSubscribers: number
  activeSubscribers: number
  totalEmails: number
  successfulEmails: number
  failedEmails: number
  successRate: number
}

// Типы для файлов
export type UploadedFile = {
  fileName: string
  filePath: string
  originalName: string
  size: number
  type: string
}

export type UploadResponse = ApiResponse<UploadedFile>

export type MultipleUploadResponse = ApiResponse<{
  uploaded: UploadedFile[]
  errors: Array<{
    fileName: string
    error: string
  }>
  totalUploaded: number
  totalErrors: number
}>

// Типы для админ панели
export type AdminStats = {
  posts: PostsStats
  subscribers: SubscribersStats
  slider: SliderStats
  newsletter: NewsletterStats
}

// Экспорт основных типов из Prisma
export type { Post, User, SliderImage, Subscriber, Category, Role }