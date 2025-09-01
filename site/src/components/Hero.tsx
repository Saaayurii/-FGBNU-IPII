"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface SliderImage {
  id: string;
  title?: string;
  imageUrl: string;
  link?: string;
  order: number;
  active: boolean;
}

interface HeroProps {
  sliderImages?: SliderImage[];
}

export function Hero({ sliderImages = [] }: HeroProps) {
  const { 0: currentSlide, 1: setCurrentSlide } = useState(0);

  // Fallback slider images if none provided from database
  const fallbackImages = [
    {
      id: "1",
      imageUrl:
        "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=1200&q=80",
      title: "Беспилотный летательный аппарат в полете",
      order: 0,
      active: true,
    },
    {
      id: "2",
      imageUrl:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
      title: "Лаборатория искусственного интеллекта",
      order: 1,
      active: true,
    },
    {
      id: "3",
      imageUrl:
        "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&q=80",
      title: "Компьютерное зрение и обработка изображений",
      order: 2,
      active: true,
    },
    {
      id: "4",
      imageUrl:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
      title: "Нейронные сети и глубокое обучение",
      order: 3,
      active: true,
    },
    {
      id: "5",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      title: "Геолокация и картография",
      order: 4,
      active: true,
    },
  ];

  const activeImages =
    sliderImages.length > 0
      ? sliderImages
        .filter((img) => img.active)
        .sort((a, b) => a.order - b.order)
      : fallbackImages;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + activeImages.length) % activeImages.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-advance slides
  useEffect(() => {
    if (activeImages.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, [activeImages.length]);

  return (
    <section className="py-16 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto">
              Сайт совета молодых учёных
              <span className="text-primary block mt-2">ФГБНУ ИПИИ</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Лаборатория интеллектуальных систем и анализа данных (ЛИСАД)
              является основным структурным научным подразделением ФГБНУ
              «Институт проблем искусственного интеллекта».
            </p>
          </div>

          <div className="mt-10 space-y-8 max-w-full mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <div className="rounded-lg pt-8 pb-0 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                О деятельности лаборатории
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                Исследования лаборатории проводятся в соответствии с Указом
                Президента Российской Федерации от 28 февраля 2024 г. N 145 "О
                Стратегии научно-технологического развития Российской Федерации"
                и относятся к п. 5. «Интеллектуальные транспортные и
                телекоммуникационные системы, включая автономные транспортные
                средства» приоритетных направлений согласно Указу Президента
                Российской Федерации от 18 июня 2024 г. № 529, "Об утверждении
                приоритетных направлений научно-технологического развития и
                перечня важнейших наукоемких технологий".
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Разработка технологий компьютерного зрения, предназначенных для
                навигации беспилотными летательными аппаратами (БПЛА) с помощью
                ориентиров, карты местности, позволяющие достичь высокой
                точности навигации для БПЛА, особенно без сигнала от спутниковой
                навигационной системы (СНС), представляет собой актуальную
                задачу, имеющую важное практическое значение. Выполнение задач
                БПЛА осложняется рядом факторов: окружающая среда наполнена
                различными подвижными и неподвижными препятствиями, теряется
                сигнал дистанционного управления с пульта оператора и СНС,
                невозможность обеспечить достоверность навигационной информации
                в случае отсутствия сигнала СНС.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Институт всячески способствует участию сотрудников лаборатории в
                конференциях и семинарах. Четверо молодых ученых приняли участие
                в Одиннадцатой всероссийской молодёжной школе-семинаре по
                проблемам информационной безопасности ПЕРСПЕКТИВА-2024 (г.
                Таганрог). Двое молодых ученых приняли участие в Десятой
                международной конференции по когнитивной науке (г. Пятигорск).
              </p>
            </div>

            {/* Custom Slider */}
            {activeImages.length > 0 && (
              <div className="rounded-lg pb-4 md:pb-6 pt-0">
                <h3 className="text-xl md:text-2xl font-semibold text-center mb-6 md:mb-10 mt-6 md:mt-10">
                  Наши исследования в фотографиях
                </h3>
                <div className="relative">
                  <div className="relative h-64 sm:h-80 md:h-96 lg:h-115 rounded-lg overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out h-full"
                      style={{
                        transform: `translateX(-${currentSlide * 100}%)`,
                      }}
                    >
                      {activeImages.map((image, index) => (
                        <div
                          key={image.id}
                          className="w-full h-full flex-shrink-0 relative"
                        >
                          <Image
                            src={image.imageUrl}
                            alt={image.title || `Слайд ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
                          />
                          {image.title && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6">
                              <h4 className="text-white font-semibold text-base md:text-lg">
                                {image.title}
                              </h4>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Navigation Arrows */}
                    {activeImages.length > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer"
                          aria-label="Предыдущий слайд"
                        >
                          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer"
                          aria-label="Следующий слайд"
                        >
                          <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                        </button>

                        {/* Dots Navigation */}
                        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
                          {activeImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => goToSlide(index)}
                              className={`w-2.5 h-2.5 md:w-2 md:h-2 rounded-full transition-all ${index === currentSlide
                                  ? "bg-white"
                                  : "bg-white/50"
                                }`}
                              aria-label={`Перейти к слайду ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
