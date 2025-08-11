"use client"

import { Header } from "@/components/Header";
import { Footer } from "@/components/ui/Footer";
import { fetchNewsBySlug } from '@/types/api';
import { notFound } from 'next/navigation';
import { BackButton } from '@/components/news/BackButton'
import SliderNews from '@/components/slider/SliderNews'

export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const newsItem = await fetchNewsBySlug(params.slug);

  if (!newsItem) return notFound();

  return (
    <div className="min-h-screen bg-background">

      <Header />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-10 overflow-hidden">

        <div className="flex items-center text-gray-600 text-sm">
          <span>{new Date(newsItem.date).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span>{newsItem.category}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{newsItem.title}</h1>

        <BackButton />

        <div className="prose lg:prose-xl">
          <div className="">
            {/* <img
              src={newsItem.image}
              alt={newsItem.title}
              className="float-left max-w-[550px] max-h-[450px] w-full h-auto mr-6 mb-2 rounded-lg"
            /> */}
            <SliderNews />
          </div>
          <p className="text-justify">
            {newsItem.content}
          </p>

        </div>
      </article>

      <Footer />
    </div>
  );
}