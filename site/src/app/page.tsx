import { Suspense } from "react";
import { MainPage } from "@/components/MainPage";
import { getPosts } from "@/actions/posts";
import { getSliderImages } from "@/actions/slider";

var HomePage = () => {
  // Параллельно загружаем данные
  return Promise.all([
    getPosts(),
    getSliderImages()
  ]).then(([posts, sliderImages]) => {
    // Разделяем посты по категориям
    var newsPosts = posts.filter(post => post.category === 'NEWS');
    var vacancyPosts = posts.filter(post => post.category === 'VACANCY');

    return (
      <MainPage 
        newsPosts={newsPosts}
        vacancyPosts={vacancyPosts}
        sliderImages={sliderImages}
      />
    );
  });
}

var Home = () => {
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

export default Home;
