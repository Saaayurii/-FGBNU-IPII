import { Suspense } from "react";
import { MainPage } from "@/components/MainPage";
import { getPosts } from "@/actions/posts";
import { getSliderImages } from "@/actions/slider";

async function HomePage() {
  // Параллельно загружаем данные
  const [posts, sliderImages] = await Promise.all([
    getPosts(),
    getSliderImages()
  ]);

  // Разделяем посты по категориям
  const newsPosts = posts.filter(post => post.category === 'NEWS');
  const vacancyPosts = posts.filter(post => post.category === 'VACANCY');

  return (
    <MainPage 
      newsPosts={newsPosts}
      vacancyPosts={vacancyPosts}
      sliderImages={sliderImages}
    />
  );
}

export default function Home() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      }
    >
      <HomePage />
    </Suspense>
  );
}
