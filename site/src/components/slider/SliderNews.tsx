'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';

export default function SliderNews() {
  const slides = [
    'http://172.16.0.34/storage/posts/preview_images/Qd4g93fZnF8FQzauJn5oi3idOdpCPbuDefWlj1mI.jpg',
    'http://172.16.0.34/storage/posts/preview_images/Qd4g93fZnF8FQzauJn5oi3idOdpCPbuDefWlj1mI.jpg',
    'http://172.16.0.34/storage/posts/preview_images/Qd4g93fZnF8FQzauJn5oi3idOdpCPbuDefWlj1mI.jpg',
    'http://172.16.0.34/storage/posts/preview_images/Qd4g93fZnF8FQzauJn5oi3idOdpCPbuDefWlj1mI.jpg',
    'http://172.16.0.34/storage/posts/preview_images/Qd4g93fZnF8FQzauJn5oi3idOdpCPbuDefWlj1mI.jpg',
  ];

  return (
      <Swiper
        effect="cards"
        grabCursor={true}
        modules={[EffectCards]}
        className="w-[600px] sm:w-[600px] md:w-[600px] lg:w-[600px] h-[450px] sm:h-[450px] md:h-[450px] lg:h-[450px] float-left"
      >
        {slides.map((src, idx) => (
          <SwiperSlide
            key={idx}
            className="flex justify-center items-center bg-gray-200 rounded-2xl overflow-hidden shadow-lg shadow-black/40"
          >
            <img
              src={src}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </SwiperSlide>
        ))}
      </Swiper>
  );
}

