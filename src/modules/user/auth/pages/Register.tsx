import AppStoreBtn from "../../../../components/ui/buttons/AppStoreBtn";
import PlayStoreBtn from "../../../../components/ui/buttons/PlayStoreBtn";
import svg from "../../../../assets/icons/svg";
import img1 from "../../../../assets/icons/App Logo Inspiraton 106.png";
import img2 from "../../../../assets/icons/App Logo Inspiraton 137.png";
import img3 from "../../../../assets/icons/App Logo Inspiraton 164.png";
import img4 from "../../../../assets/icons/App Logo Inspiraton 21.png";
import img5 from "../../../../assets/icons/App Logo Inspiraton 92.png";
import img6 from "../../../../assets/icons/Logo Shapes 21.png";
import img7 from "../../../../assets/icons/App Logo Inspiraton 42.png";
import adImg from "../../../../assets/images/adImg.png";

// src/modules/auth/pages/Register.tsx
const Register = () => {
  return (
    <div className="Main-Div  w-screen flex flex-row items-center justify-center">
      <div className="Register-Ad-div flex flex-col items-center justify-center w-full">
        <div
          className="w-full flex flex-col gap-6 p-10"
          style={{ backgroundColor: "#e4e4e5" }}
        >
          <div className="text-4xl w-full text-center">
            Show the best of your business
          </div>
          <div className="w-11/12 flex flex-row justify-center items-center">
            <div className="flex flex-col gap-10">
              <span className="text-4xl font-bold" style={{ color: "#0B132A" }}>
                We Provide Many <br /> Features You Can Use
              </span>
              <span className="text-2xl" style={{ color: "#4F5665" }}>
                You can explore the features that we
                <br /> provide with fun and have their own
                <br /> functions each feature.
              </span>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-2 items-center justify-center">
                  <span className="w-12">{svg.greenTick}</span>
                  <span style={{ color: "#4F5665" }} className="text-lg">
                    Powerfull online protection.
                  </span>
                </div>
                <div className="flex flex-row gap-2 items-center justify-center">
                  <span className="w-12">{svg.greenTick}</span>
                  <span style={{ color: "#4F5665" }} className="text-lg">
                    Powerfull online protection.
                  </span>
                </div>
                <div className="flex flex-row gap-2 items-center justify-center">
                  <span className="w-12">{svg.greenTick}</span>
                  <span style={{ color: "#4F5665" }} className="text-lg">
                    Powerfull online protection.
                  </span>
                </div>
              </div>
            </div>
            <div className="w-4/12">
              <img src={adImg} alt="wasd" className="w-full" />
            </div>
          </div>
        </div>
        <div
          className="lg:w-3/12  text-md md:text-xl flex flex-col gap-4 p-3"
          // style={{ border: "2px solid red" }}
        >
          <span>Trusted by more than 100+ businessess</span>
          <div className="flex flex-row  items-center gap-3">
            <img src={img4} alt="img" />
            <img src={img7} alt="img" />
            <img src={img5} alt="img" />
            <img src={img1} alt="img" />
            <img src={img2} alt="img" />
            <img src={img3} alt="img" />
            <img src={img6} alt="img" />
          </div>
        </div>
        <div className="bg-01 w-screen flex flex-col p-3 md:p-10">
          <div className="w-full flex flex-col items-center justify-center gap-7">
            <div className="lg:w-8/12 text-white text-md md:text-lg flex items-start justify-center">
              <span>
                Create a free account and get full access to all features for 30
                days. No credit card needed. Trusted by over 4,000
                professionals.
              </span>
              <div className="">{svg.BlinkStar}</div>
            </div>
            <div className="w-full lg:w-6/12 flex flex-row items-center justify-center gap-3">
              <div className="mt-3 p-1 flex -space-x-2 overflow-hidden h-14"></div>
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center">
                  {svg.RatingActiveStar}
                  {svg.RatingActiveStar}
                  {svg.RatingActiveStar}
                  {svg.RatingActiveStar}
                  {svg.RatingNotActiveStar}
                  <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    4.0
                  </p>
                </div>

                <div className="mt-3 text-sm font-medium">
                  <a href="#" className="text-white">
                    From 200+ Reviews
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:w-6/12 flex flex-row items-center justify-center gap-4 md:gap-10">
              <PlayStoreBtn />
              <AppStoreBtn />
            </div>
          </div>
        </div>
      </div>
      <div className="Register-form-div w-full"></div>
    </div>
    // <div className="w-screen flex flex-row">
    //   <div className="w-full" style={{ border: "2px solid red" }}>
    //     w
    //   </div>
    //   <div className="w-full" style={{ border: "2px solid green" }}>
    //     e
    //   </div>
    // </div>
    // <div className="flex justify-center items-center h-screen bg-gray-100">
    //   <div className="bg-white p-8 rounded shadow-md w-96">
    //     <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
    //     {/* Add registration form here */}
    //   </div>
    // </div>
  );
};

export default Register;
