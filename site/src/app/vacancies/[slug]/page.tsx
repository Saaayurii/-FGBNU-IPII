"use client"

import { Header } from "@/components/Header";
import { Footer } from "@/components/ui/Footer";
import { BackButton } from '@/components/news/BackButton'

export default async function VacanciesDetailPage() {

  return (
    <div className="min-h-screen bg-background">

      <Header />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-10 overflow-hidden">

        <div className="flex items-center text-gray-600 text-sm">
          <span>Дата</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Название вакансии</h1>

        <BackButton />

        <div className="prose lg:prose-xl">
            Описание вакансии
        </div>
      </article>

      <Footer />
    </div>
  );
}