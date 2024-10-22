import React from "react";
import Image from "next/image";

const HourglassWithContent = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-indigo-700">
      <div className="flex justify-center">
        <div className="relative w-full max-w-[761px] mx-auto">
          {/* Base Layer - Hourglass SVG */}
          <div className="relative z-0">
            <Image
              src="/Full-illustration.svg"
              alt="Coming Soon Illustration"
              width={761}
              height={1918}
              priority
              className="w-full h-auto"
            />
          </div>

          {/* Content Container */}
          <div className="absolute inset-0 flex flex-col items-center">
            {/* Logo at the top */}
            <div className="mt-14">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={56}
                height={59}
                priority
                className="w-[56px] h-[59px]"
              />
            </div>

            {/* Main Content */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-[20%] w-full flex flex-col items-center">
              {/* Number Container */}
              <div className="text-center">
                <div className="text-[240px] leading-none font-serif text-white sm:text-[640px] md:text-[640px]">
                  8
                </div>
                <div className="text-white tracking-[4px] text-xs">
                  DAYS TO GO
                </div>
              </div>

              {/* Text Content */}
              <h1 className="font-serif italic text-[48px] text-white mt-6 mb-4">
                A Tale Awaits
              </h1>
              <p className="text-white/70 text-center text-xs max-w-[400px] mb-8">
                Become a part of the story that continues to inspire
                generations.
              </p>

              {/* Button */}
              <button className="bg-[#F8BE45] hover:bg-[#F8BE45]/90 text-black px-8 py-3.5 rounded-full flex items-center gap-2 text-sm w-[218px] h-[56px] justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 5L2 12.5L9 13.5M21 5L18.5 20L9 13.5M21 5L9 13.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Send Your Best Wishes
              </button>
            </div>

            {/* Record Icon */}
            {/* <div className="absolute bottom-[20%] right-20">
              <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-black border-2 border-white relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[#EE2326] text-2xl">♥</div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourglassWithContent;
