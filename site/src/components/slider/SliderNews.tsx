'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Image from 'next/image';


import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';


const Gallery = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  
  const images = [
    "/images/1754390811351-jz23oz38jvq.jpg",
    "/images/1754390811351-jz23oz38jvq.jpg",
    "/images/1754390811351-jz23oz38jvq.jpg",
    "/images/1754390811351-jz23oz38jvq.jpg",
  ];


  return (
    <div className="max-w-4xl mx-auto p-4">

      <Swiper
        loop={true}
        spaceBetween={10}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next'
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="rounded-xl shadow-lg mb-4 h-96"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="relative">
            <Image
              src={src}
              alt={`Nature image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority={index === 0}
            />
          </SwiperSlide>
        ))}
        

        <div className="swiper-button-prev after:text-white bg-black/30 p-2 rounded-full backdrop-blur-sm hover:bg-black/50 transition-all"></div>
        <div className="swiper-button-next after:text-white bg-black/30 p-2 rounded-full backdrop-blur-sm hover:bg-black/50 transition-all"></div>
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={8}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="h-15"
        breakpoints={{
          0: { slidesPerView: 3 },
          640: { slidesPerView: 4 },
          1024: { slidesPerView: 5 }
        }}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="cursor-pointer rounded-lg overflow-hidden opacity-50 hover:opacity-100 transition-opacity">
            <div className="relative h-full w-full">
              <Image
                src={src}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 20vw, 15vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Gallery;



