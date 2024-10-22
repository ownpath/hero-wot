import React from "react";
import Image from "next/image";
import HourglassAnimation from "./animehome";
import { useRouter } from "next/router";

const CombinedHourglass = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    console.log("acccessToken", accessToken);
    if (accessToken) {
      router.push("/postgreeting");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-indigo-700">
      <div className="flex justify-center">
        <div className="relative w-full max-w-[761px] mx-auto">
          {/* Base Layer - Static Hourglass */}
          <div className="relative z-0">
            <Image
              src="/shapes/Container.svg"
              alt="Coming Soon Illustration"
              width={761}
              height={1918}
              priority
              className="w-full h-auto"
            />
          </div>
          {/* Physics Animation Layer */}
          <div className="absolute inset-0 z-10">
            <HourglassAnimation
              hourGlassColor="#ff2000"
              comingSoonColor="#FDC500"
              numbersColor="#FFFFFF"
            />
          </div>

          <div className="absolute inset-0 flex flex-col items-center z-20">
            {/* Logo at the top */}
            <div className="mt-14">
              <Image
                src="/Main-logo.svg"
                alt="Logo"
                width={56}
                height={59}
                priority
                className="w-[56px] h-[59px]"
              />
            </div>

            {/* Main Content */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-[20%] w-full flex flex-col items-center justify-center">
              {/* Number Container */}
              <div className="text-center">
                <div className="text-[240px] leading-none font-serif text-white sm:text-[520px] md:text-[520px]">
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
              <button
                className="bg-[#F8BE45] hover:bg-[#F8BE45]/90 text-black px-8 py-3.5 rounded-full flex items-center gap-2 text-sm w-[218px] h-[56px] justify-center"
                onClick={handleSubmit}
              >
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedHourglass;
