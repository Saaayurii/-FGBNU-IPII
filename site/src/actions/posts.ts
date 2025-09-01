"use server";

import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";
import { PostWithAuthor } from "@/types";
import { revalidatePath } from "next/cache";
import { createHash } from 'crypto';

export async function getPosts(category?: Category): Promise<PostWithAuthor[]> {
  try {
    // Добавляем повторные попытки подключения
    let retries = 3;
    while (retries > 0) {
      try {
        const posts = await prisma.post.findMany({
          where: {
            published: true,
            ...(category && { category })
          },
          include: {
            author: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        
        return posts.map(post => ({
          ...post,
          imageUrl: post.imageUrl || undefined
        }));
      } catch (dbError: any) {
        retries--;
        if (retries === 0 || !dbError.message?.includes("Can't reach database")) {
          throw dbError;
        }
        console.warn(`Database connection failed, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<PostWithAuthor | null> {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug,
        published: true
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    
    return post ? {
      ...post,
      imageUrl: post.imageUrl || undefined
    } : null;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
}

export async function getFeaturedPosts(): Promise<PostWithAuthor[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        featured: true
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 6
    });
    
    return posts.map(post => ({
      ...post,
      imageUrl: post.imageUrl || undefined
    }));
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

export async function incrementPostViews(id: string) {
  try {
    await prisma.post.update({
      where: { id },
      data: {
        views: {
          increment: 1
        }
      }
    });
  } catch (error) {
    console.error("Error incrementing post views:", error);
  }
}

async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // Создаем хэш из заголовка для уникальности
  const hash = createHash('md5').update(title + Date.now().toString()).digest('hex').substring(0, 8);
  const slug = `${baseSlug}-${hash}`;
  
  // Проверяем уникальность
  const existing = await prisma.post.findUnique({
    where: { 
      slug,
      ...(excludeId && { NOT: { id: excludeId } })
    }
  });
  
  if (!existing) {
    return slug;
  }
  
  // Если вдруг коллизия, добавляем timestamp
  return `${baseSlug}-${hash}-${Date.now()}`;
}

export async function createPost(data: {
  title: string;
  description: string;
  content: string;
  category: Category;
  imageUrl?: string;
  published?: boolean;
  featured?: boolean;
  authorId: string;
  // Поля для вакансий
  location?: string;
  employmentType?: string;
  salary?: string;
  requirements?: string;
}) {
  try {
    console.log("Creating post with data:", data);
    
    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: data.authorId }
    });
    
    console.log("User exists check:", userExists);
    
    if (!userExists) {
      console.error("User not found with ID:", data.authorId);
      return { success: false, error: "User not found" };
    }
    
    // Generate unique slug from title
    const slug = await generateUniqueSlug(data.title);
    console.log("Generated slug:", slug);

    const post = await prisma.post.create({
      data: {
        ...data,
        slug,
        publishedAt: data.published ? new Date() : null
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    
    revalidatePath('/');
    revalidatePath('/news');
    
    return { success: true, data: post };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function updatePost(id: string, data: {
  title?: string;
  description?: string;
  content?: string;
  category?: Category;
  imageUrl?: string;
  published?: boolean;
  featured?: boolean;
  // Поля для вакансий
  location?: string;
  employmentType?: string;
  salary?: string;
  requirements?: string;
}) {
  try {
    const updateData: Record<string, unknown> = { ...data };
    
    // Update slug if title changed
    if (data.title) {
      updateData.slug = await generateUniqueSlug(data.title, id);
    }
    
    // Set publishedAt if publishing
    if (data.published !== undefined) {
      updateData.publishedAt = data.published ? new Date() : null;
    }
    
    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    
    revalidatePath('/');
    revalidatePath('/news');
    
    return { success: true, data: post };
  } catch (error) {
    console.error("Error updating post:", error);
    return { success: false, error: "Failed to update post" };
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id }
    });
    
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/admin/news');
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}

// Административные функции
export async function getAllPostsForAdmin(page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;
    
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        include: {
          author: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.post.count()
    ]);
    
    return {
      posts: posts.map(post => ({
        ...post,
        imageUrl: post.imageUrl || undefined,
        author: post.author ? { 
          ...post.author, 
          id: (post.author as any)?.id || '' 
        } : null
      })),
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount
      }
    };
  } catch (error) {
    console.error("Error fetching posts for admin:", error);
    return {
      posts: [],
      pagination: {
        page: 1,
        limit,
        totalPages: 0,
        totalCount: 0
      }
    };
  }
}

export async function getPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    
    return post ? {
      ...post,
      imageUrl: post.imageUrl || undefined,
      author: post.author ? {
        ...post.author,
        id: (post.author as any)?.id || ''
      } : null
    } : null;
  } catch (error) {
    console.error("Error fetching post by id:", error);
    return null;
  }
}

export async function getPostsStats() {
  try {
    const totalPosts = await prisma.post.count();
    const publishedPosts = await prisma.post.count({
      where: { published: true }
    });
    const draftPosts = totalPosts - publishedPosts;
    const featuredPosts = await prisma.post.count({
      where: { featured: true }
    });

    // Посты по категориям
    const newsPosts = await prisma.post.count({
      where: { category: Category.NEWS }
    });
    const vacancyPosts = await prisma.post.count({
      where: { category: Category.VACANCY }
    });
    const announcementPosts = await prisma.post.count({
      where: { category: Category.ANNOUNCEMENT }
    });
    const eventPosts = await prisma.post.count({
      where: { category: Category.EVENT }
    });

    // Общее количество просмотров
    const totalViews = await prisma.post.aggregate({
      _sum: {
        views: true
      }
    });

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      featuredPosts,
      totalViews: totalViews._sum.views || 0,
      byCategory: {
        news: newsPosts,
        vacancy: vacancyPosts,
        announcement: announcementPosts,
        event: eventPosts
      }
    };
  } catch (error) {
    console.error("Error fetching posts stats:", error);
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      featuredPosts: 0,
      totalViews: 0,
      byCategory: {
        news: 0,
        vacancy: 0,
        announcement: 0,
        event: 0
      }
    };
  }
}

export async function bulkDeletePosts(ids: string[]) {
  try {
    const result = await prisma.post.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/admin/news');
    
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Error bulk deleting posts:", error);
    return { success: false, error: "Failed to delete posts" };
  }
}

export async function bulkUpdatePostsStatus(ids: string[], published: boolean) {
  try {
    const result = await prisma.post.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data: {
        published,
        publishedAt: published ? new Date() : null
      }
    });

    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath('/admin/news');
    
    return { success: true, count: result.count };
  } catch (error) {
    console.error("Error bulk updating posts status:", error);
    return { success: false, error: "Failed to update posts status" };
  }
}

export async function searchPosts(query: string, category?: Category) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                title: {
                  contains: query,
                  mode: 'insensitive'
                }
              },
              {
                description: {
                  contains: query,
                  mode: 'insensitive'
                }
              },
              {
                content: {
                  contains: query,
                  mode: 'insensitive'
                }
              }
            ]
          },
          category ? { category } : {}
        ]
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return posts;
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}