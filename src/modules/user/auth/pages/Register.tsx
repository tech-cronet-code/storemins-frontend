import AppStoreBtn from "../../../../components/ui/buttons/AppStoreBtn";
import PlayStoreBtn from "../../../../components/ui/buttons/PlayStoreBtn";

// src/modules/auth/pages/Register.tsx
const Register = () => {
  return (
    <div className="Main-Div h-screen w-screen">
      <div className="Register-Ad-div flex flex-col">
        <div className=""></div>
        <div className="bg-01 w-screen flex flex-col p-10">
          <div className="w-full flex flex-col items-center justify-center gap-7">
            <div className="w-8/12 text-white text-lg flex">
              <span>
                Create a free account and get full access to all features for 30
                days. No credit card needed. Trusted by over 4,000
                professionals.
              </span>
              <div className="">
                <svg
                  width="34"
                  height="26"
                  viewBox="0 0 34 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_27_1905)">
                    <path
                      d="M18.5075 25.8612C18.5075 25.8612 16.9677 17.8377 15.067 16.2037C13.1664 14.5697 3.93607 13.375 3.93607 13.375C3.93607 13.375 13.096 12.0262 14.9614 10.3614C16.8269 8.69658 18.1907 0.611392 18.1907 0.611392C18.1907 0.611392 19.7306 8.63492 21.6312 10.2689C23.5318 11.9029 32.7622 13.0976 32.7622 13.0976C32.7622 13.0976 23.6022 14.4464 21.7368 16.1112C19.8714 17.776 18.5075 25.8612 18.5075 25.8612Z"
                      fill="white"
                    />
                  </g>
                  <path
                    d="M3.8189 6.58224C3.8189 6.58224 3.41967 4.50206 2.92692 4.07843C2.43416 3.6548 0.0411039 3.34507 0.0411039 3.34507C0.0411039 3.34507 2.41591 2.99538 2.89954 2.56376C3.38317 2.13213 3.73677 0.0359685 3.73677 0.0359685C3.73677 0.0359685 4.13599 2.11615 4.62875 2.53978C5.1215 2.96341 7.51456 3.27314 7.51456 3.27314C7.51456 3.27314 5.13975 3.62283 4.65612 4.05445C4.17249 4.48608 3.8189 6.58224 3.8189 6.58224Z"
                    fill="#F9C54E"
                  />
                  <path
                    d="M31.5979 9.66772C31.5979 9.66772 31.3413 8.33046 31.0245 8.05813C30.7077 7.78579 29.1694 7.58668 29.1694 7.58668C29.1694 7.58668 30.696 7.36188 31.0069 7.08441C31.3178 6.80694 31.5451 5.4594 31.5451 5.4594C31.5451 5.4594 31.8018 6.79666 32.1185 7.06899C32.4353 7.34133 33.9737 7.54044 33.9737 7.54044C33.9737 7.54044 32.4471 7.76524 32.1361 8.04271C31.8252 8.32018 31.5979 9.66772 31.5979 9.66772Z"
                    fill="#F9C54E"
                  />
                  <defs>
                    <clipPath id="clip0_27_1905">
                      <rect
                        width="19.371"
                        height="19.371"
                        fill="white"
                        transform="matrix(0.752227 0.658904 -0.752227 0.658904 18.3491 0.472656)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="w-6/12 flex flex-row items-center justify-center gap-3">
              <div className="mt-3 p-1 flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-14 w-14 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
                <img
                  className="inline-block h-14 w-14 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
                <img
                  className="inline-block h-14 w-14 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                  alt=""
                />
                <img
                  className="inline-block h-14 w-14 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
                <img
                  className="inline-block h-14 w-14 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-yellow-300 me-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className="w-4 h-4 text-yellow-300 me-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className="w-4 h-4 text-yellow-300 me-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className="w-4 h-4 text-yellow-300 me-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className="w-4 h-4 text-gray-300 me-1 dark:text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
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
            <div className="w-6/12 flex flex-row items-center justify-center gap-10">
              <PlayStoreBtn />
              <AppStoreBtn />
            </div>
          </div>
        </div>
      </div>
      <div className="Register-form-div"></div>
      <div className=""></div>
    </div>
    // <div className="flex justify-center items-center h-screen bg-gray-100">
    //   <div className="bg-white p-8 rounded shadow-md w-96">
    //     <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
    //     {/* Add registration form here */}
    //   </div>
    // </div>
  );
};

export default Register;
