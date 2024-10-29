import React, { useState, useEffect } from "react";
import Image from "next/image";
import HourglassAnimation from "../animehome";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/button";
import HourglassContainer from "@/components/HourglassContainer";
import MainLogo from "@/components/MainLogo";
import { ThemeSwitch } from "@/components/theme-switch";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

function getRemainingTime() {
  // Create current date in IST
  const now = new Date();
  // Add IST offset (UTC+5:30)
  const ISTOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds

  // Create target date (Oct 29, 2024 00:00 IST)
  const targetDate = new Date(2024, 9, 29);
  // Adjust for IST
  targetDate.setTime(targetDate.getTime() + ISTOffset);

  // Reset both dates to midnight IST
  now.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  // Calculate the difference in days
  const difference = targetDate.getTime() - now.getTime();
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  return Math.max(0, days);
}

const CombinedHourglass = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(getRemainingTime());

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 10) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Initial calculation
    setDaysRemaining(getRemainingTime());

    // Update every day at midnight IST
    const timer = setInterval(
      () => {
        setDaysRemaining(getRemainingTime());
      },
      1000 * 60 * 60 * 24
    ); // 24 hours

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      await router.push("/postgreeting");
    } else {
      await router.push("/login");
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-background flex flex-col">
      {/* Theme Switch Container */}
      <div className="fixed bottom-0 right-0 z-50 flex items-center">
        <div className="relative flex items-center justify-center">
          <Image
            src="/ThemeSwitch.gif"
            alt="Theme Switch Background"
            width={214}
            height={160}
            priority
            className="pointer-events-none w-20 h-14 sm:w-28 sm:h-20 md:w-40 md:h-32 lg:w-[214px] lg:h-40"
          />
          <div className="absolute flex items-center justify-center">
            <ThemeSwitch className="scale-75 sm:scale-100 md:scale-125 lg:scale-150 hover:scale-160 transition-transform duration-200" />
          </div>
        </div>
      </div>

      {/* <motion.div
        className="fixed bottom-8 right-4 sm:bottom-24 sm:right-32 z-40 flex items-center scale-50 sm:scale-75 md:scale-90 lg:scale-100"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-white text-[10px] sm:text-sm mr-2 italic font-light">
          Click me!
        </span>

        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[60px] lg:h-[60px]"
        >
          <path
            d="M5 15C10 15 20 15 25 25C30 35 30 45 40 52C45 55 50 58 55 58"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeDasharray="3 3"
          />
          <path
            d="M55 58L60 64L50 64Z"
            fill="white"
            stroke="white"
            strokeWidth="5"
          />{" "}
        </svg>
      </motion.div> */}

      {/* Main Content Container */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-[761px] flex flex-col items-center">
          {/* Hourglass Stack Container */}
          <div className="relative w-full">
            {/* Base Layer - Static Hourglass */}
            <div className="w-full">
              <HourglassContainer className="w-full h-auto text-hourglass" />
            </div>
            {/* Physics Animation Layer */}
            <div className="absolute inset-0 w-full">
              <HourglassAnimation
                comingSoonClass="text-comingSoon"
                numbersClass="text-numbers"
              />
            </div>

            {/* Animated Scroll Down CTA */}

            {isVisible && (
              <motion.div
                className="fixed left-0 right-0 mx-auto w-fit hidden lg:flex"
                style={{ bottom: "1vh" }} // Remove the translateX from style
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  y: [0, 10, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.8, ease: "easeInOut" },
                  y: {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: [0.4, 0.0, 0.2, 1],
                  },
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-numbers text-sm tracking-[4px] uppercase">
                    Scroll Down
                  </span>
                  <ChevronDown className="text-numbers w-6 h-6" />
                </div>
              </motion.div>
            )}

            {/* Content Stack  */}
            <div className="absolute inset-0 flex flex-col items-center">
              {/* Logo Section */}
              <div className="mt-14">
                <MainLogo
                  className="w-16 h-16 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-full lg:h-auto text-numbers"
                  // w-16 and h-16 equals 64px
                />
              </div>

              {/* Central Content */}
              <div className="flex flex-col items-center mt-auto mb-[45px] sm:mb-[70px] md:mb-[100px] lg:mb-[140px]">
                {/* Number Container */}
                <div className="flex flex-col items-center gap-y-8 sm:gap-y-12 md:gap-y-16 lg:gap-y-16">
                  {/* Countdown Number */}
                  <div
                    className="font-playfair font-bold leading-[0.9] text-numbers
                        text-[200px] 
                        sm:text-[300px] 
                        md:text-[400px] 
                        lg:text-[480px]"
                  >
                    {daysRemaining}
                  </div>
                  {/* Days to Go Text */}
                  <div
                    className="text-daysToGo
                              text-[13px] tracking-[4.5px]
                              sm:text-[14px] sm:tracking-[5.5px]
                              md:text-[15px] md:tracking-[6.5px]
                              lg:text-[16px] lg:tracking-[7.2px]"
                  >
                    DAYS TO GO
                  </div>
                </div>

                {/* Text Content */}
                <div
                  className="flex flex-col items-center 
                  mt-2 
                  sm:mt-4 
                  md:mt-6 
                  lg:mt-8"
                >
                  {/* A Tale Awaits Heading */}
                  <h1
                    className="font-ztNeueRalewe italic font-extrabold text-aTaleAwaits text-center
  text-[32px] leading-[38.4px] tracking-[-1.8px] mb-[4.5px]    
  sm:text-[42px] sm:leading-[50.4px] sm:tracking-[-2.2px] sm:mb-[5.5px] 
  md:text-[56px] md:leading-[67.2px] md:tracking-[-2.6px] md:mb-[6.5px]  
  lg:text-[68px] lg:leading-[81.6px] lg:tracking-[-3.2px] lg:mb-[7.5px]"
                  >
                    A Tale Awaits
                  </h1>

                  <p
                    className="text-becomePartOfStory text-center mx-auto
                    text-[12px] mb-3
                    sm:text-[13px] sm:mb-4
                    md:text-[14px] md:mb-4
                    lg:text-[15px] lg:mb-5"
                  >
                    Contribute to a loving narrative that echoes <br /> in
                    hearts and inspires generations.
                  </p>

                  {/* Button */}
                  <Button
                    radius="none"
                    className="bg-buttonBackground text-buttonText rounded-[4px] flex items-center gap-2 justify-center
                      text-[13px] w-[220px] h-[48px] px-8 py-3
                      sm:text-[14px] sm:w-[230px] sm:h-[50px]
                      md:text-[14px] md:w-[240px] md:h-[52px]
                      lg:text-[14px] lg:w-[248px] lg:h-[54px] lg:px-10 lg:py-4"
                    onPress={handleSubmit}
                  >
                    Send Your Heartfelt Wishes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#202020] z-40 h-20 w-full flex items-center justify-center ">
        <Image
          src="/HeroLogo.svg"
          alt="Theme Switch Background"
          width={20}
          height={31}
          className="w-9 h-9 flex items-center justify-center"
        />
      </footer>
    </div>
  );
};

export default CombinedHourglass;
