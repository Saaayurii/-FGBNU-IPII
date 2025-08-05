'use client';

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { News } from "@/components/News";
import { Programs } from "@/components/Programs";
import { Features } from "@/components/Features";
import { ContactMap } from "@/components/ContactMap";
import { Footer } from "@/components/layout/Footer";

interface MainPageProps {
  newsPosts: any[];
  vacancyPosts: any[];
  sliderImages: any[];
}

export function MainPage({ newsPosts, vacancyPosts, sliderImages }: MainPageProps) {
  const handleNewsClick = () => {
    const newsSection = document.getElementById('news-section');
    if (newsSection) {
      newsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactsClick = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNewsClick={handleNewsClick} onContactsClick={handleContactsClick} />
      <main>
        <Hero sliderImages={sliderImages} />
        <div id="news-section">
          <News posts={newsPosts} />
        </div>
        <Programs vacancies={vacancyPosts} />
        <Features />
        <div id="contact-section">
          <ContactMap />
        </div>
      </main>
      <Footer />
    </div>
  );
}