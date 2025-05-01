// AdForm.tsx
// import { useState } from "react";
import img1 from "../../../assets/icons/App Logo Inspiraton 106.png";
import img2 from "../../../assets/icons/App Logo Inspiraton 137.png";
import img3 from "../../../assets/icons/App Logo Inspiraton 164.png";
import img4 from "../../../assets/icons/App Logo Inspiraton 21.png";
import img7 from "../../../assets/icons/App Logo Inspiraton 42.png";
import img5 from "../../../assets/icons/App Logo Inspiraton 92.png";
import img6 from "../../../assets/icons/Logo Shapes 21.png";
import svg from "../../../assets/icons/svg";
// import svg from "../../../assets/icons/svg";
import adImg from "../../../assets/images/adImg.png";
import AppStoreBtn from "../../../components/UI/Button/AppStoreBtn";
import PlayStoreBtn from "../../../components/UI/Button/PlayStoreBtn";

const logos = [img1, img2, img3, img4, img5, img6, img7];

const AdForm = () => {
  return (
    <>
      {/* Start LEFT SIDE Add Form*/}
      <div
        className="md:w-full flex flex-col items-center justify-center
       bg-white"
      >
        <div className="w-full h-full space-y-1">
          {/* Top Content */}
          <div className="bg-[#e4e4e5] hidden md:block p-6 lg:p-8 space-y-1">
            <h2 className="text-3xl font-semibold text-center">
              Show the best of your business
            </h2>
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-[#0B132A] leading-tight">
                  We Provide Many <br /> Features You Can Use
                </h3>
                <p className="text-[#4F5665] leading-relaxed">
                  You can explore the features that we provide with fun and have
                  their own functions each feature.
                </p>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-[#4F5665]"
                  >
                    <span>✅</span>
                    <span>Powerful online protection.</span>
                  </div>
                ))}
              </div>
              <img
                src={adImg}
                alt="Ad"
                className="w-full max-w-xs lg:max-w-[50%]"
              />
            </div>
          </div>
          {/* Logos */}
          <div className="text-center hidden md:block my-3">
            <p className="text-gray-700">
              Trusted by more than 100+ businesses
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {logos.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`logo-${i}`}
                  className="w-14 object-contain"
                />
              ))}
            </div>
          </div>
          {/* Bottom Download Section */}
          <div className="bg-[#000052] flex flex-col items-center justify-center text-white p-6 space-y-1">
            <p className="text-sm lg:text-base">
              Create a free account and get full access to all features for 30
              days. No credit card needed. Trusted by over 4,000 professionals.
            </p>
            <div className="flex items-center gap-2 text-yellow-300 mt-3">
              {svg.RatingActiveStar}
              {svg.RatingActiveStar}
              {svg.RatingActiveStar}
              {svg.RatingActiveStar}
              {svg.RatingNotActiveStar}
              <span className="text-white text-sm">4.0 from 200+ reviews</span>
            </div>
            <div className="flex gap-2 md:gap-4 mt-4">
              <PlayStoreBtn />
              <AppStoreBtn />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdForm;
