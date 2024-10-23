import React from "react";
import Image from "next/image";
import HourglassAnimation from "./animehome";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/button";
import HourglassContainer from "@/components/HourglassContainer";
import MainLogo from "@/components/MainLogo";
import { ThemeSwitch } from "@/components/theme-switch";
import { getTailwindColor } from "./animehome";

const CombinedHourglass = () => {
  const router = useRouter();

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");

    console.log("accessToken", accessToken);
    if (accessToken) {
      await router.push("/postgreeting");
    } else {
      await router.push("/login");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-background">
      {/* Theme Switch Container */}
      <div className="fixed bottom-0 right-0 z-50 flex items-center">
        <div className="relative">
          {/* GIF Background */}
          <Image
            src="/ThemeSwitch.gif"
            alt="Theme Switch Background"
            width={160}
            height={160}
            priority
            className="pointer-events-none"
          />
          {/* Theme Switch Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ThemeSwitch className="scale-150 hover:scale-160 transition-transform duration-200" />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative w-full max-w-[761px] mx-auto">
          {/* Base Layer - Static Hourglass */}
          <div className="relative z-0">
            <HourglassContainer className="w-full h-auto text-hourglass" />
          </div>
          {/* Physics Animation Layer */}
          <div className="absolute inset-0 z-10">
            <HourglassAnimation
              hourGlassColor={getTailwindColor("text-hourglass")}
              comingSoonColor={getTailwindColor("text-comingSoon")}
              numbersColor={getTailwindColor("text-numbers")}
            />
          </div>

          <div className="absolute inset-0 flex flex-col items-center z-20">
            {/* Logo at the top */}
            <div className="mt-14">
              <MainLogo className="w-full h-auto text-numbers" />
            </div>

            {/* Main Content */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-[15%] w-full flex flex-col items-center justify-center">
              {/* Number Container */}
              <div className="text-center flex flex-col gap-y-[18.2] sm:gap-y-8">
                <div className="font-playfair text-[240px] font-bold leading-[0.9] text-numbers sm:text-[480px] md:text-[480px]">
                  6
                </div>
                <div className="text-daysToGo tracking-[7.2px] text-[14px] sm:text-xl">
                  DAYS TO GO
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col items-center mt-4 sm:mt-8">
                <h1 className="font-ztNeueRalewe italic font-extrabold text-[36px] sm:text-[64px] text-aTaleAwaits leading-[76.8px] tracking-[-3.2px] text-center sm:mb-8">
                  A Tale Awaits
                </h1>
                <p className="text-becomePartOfStory text-center text-[14px] mx-auto w-full mb-5 sm:mb-10">
                  Become a part of the story that continues <br /> to inspire
                  generations.
                </p>

                {/* Button */}
                <Button
                  radius="none"
                  className="bg-buttonBackground text-buttonText text-[14px] font-medium px-10 py-4 rounded-[4px] flex items-center gap-2 w-[248px] h-[54px] justify-center"
                  onPress={handleSubmit}
                >
                  Send Your Best Wishes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-[#202020] z-40 h-24 w-full hidden"></footer>
    </div>
  );
};

export default CombinedHourglass;
