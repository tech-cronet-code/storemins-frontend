import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

const featureData = [
  {
    title: "For Meeting",
    description: "Auto-accept meetings only for available time slots",
    imageSrc: "https://cdn-icons-png.flaticon.com/512/747/747310.png",
    ctaLabel: "See it in action",
    bgImage:
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    title: "Smart Sync",
    description: "Instantly sync across devices",
    imageSrc: "https://cdn-icons-png.flaticon.com/512/709/709496.png",
    ctaLabel: "Try now",
    bgImage:
      "https://images.pexels.com/photos/5082580/pexels-photo-5082580.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "AI Scheduling",
    description: "Let AI schedule your meetings",
    imageSrc: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png",
    ctaLabel: "Learn More",
    bgImage:
      "https://images.pexels.com/photos/3760810/pexels-photo-3760810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const FeatureCarouselInsideCard = () => {
  return (
    <div className="rounded-2xl shadow-lg overflow-hidden">
      <Swiper
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        loop
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        className="w-full h-full"
      >
        {featureData.map((feature, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="relative h-[260px] w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${feature.bgImage})` }}
            >
              <div className="absolute inset-0 bg-black/30 z-0" />

              <div className="relative z-10 h-full flex flex-col justify-between p-5 text-white">
                <div>
                  <p className="text-[11px] font-semibold text-blue-200 uppercase tracking-wide mb-1">
                    {feature.title}
                  </p>
                  <p className="text-lg font-semibold leading-snug">
                    {feature.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => console.log(`${feature.title} clicked`)}
                    className="bg-gradient-to-br from-[#6B5EFF] to-[#837CFF] text-white text-sm font-medium px-5 py-2 rounded-full shadow-md hover:scale-105 transition-all duration-200"
                  >
                    {feature.ctaLabel}
                  </button>
                  <img
                    src={feature.imageSrc}
                    alt="icon"
                    className="w-11 h-11 object-contain rounded-full bg-white/10 p-2 shadow-md"
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeatureCarouselInsideCard;
