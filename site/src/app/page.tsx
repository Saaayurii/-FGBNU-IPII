import { MainPage } from "@/components/MainPage";
import { getPosts } from "@/actions/posts";
import { getSliderImages } from "@/actions/slider";

export default async function HomePage() {
  // Параллельно загружаем данные
  const [posts, sliderImages] = await Promise.all([
    getPosts(),
    getSliderImages()
  ]);

  console.log("All posts from database:", posts.length, posts);

  // Разделяем посты по категориям
  const newsPosts = posts.filter(post => post.category === 'NEWS');
  const vacancyPosts = posts.filter(post => post.category === 'VACANCY');

  console.log("News posts:", newsPosts.length, newsPosts);
  console.log("Vacancy posts:", vacancyPosts.length, vacancyPosts);

  return (
    <MainPage 
      newsPosts={newsPosts}
      vacancyPosts={vacancyPosts}
      sliderImages={sliderImages}
    />
  );
}
