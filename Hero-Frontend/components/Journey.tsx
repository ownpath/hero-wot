import React, { useRef, useEffect, useState } from "react";
import lottie from "lottie-web";
import { motion, useScroll } from "framer-motion";
import { Progress } from "@nextui-org/progress";

interface AnimationInstance {
  addEventListener(arg0: string, arg1: () => void): unknown;
  totalFrames: number;
  goToAndStop: (frame: number, isFrame: boolean) => void;
  destroy: () => void;
}

const LottieScrollAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const [animation, setAnimation] = useState<AnimationInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const container = lottieContainerRef.current;
    if (!container) return;

    const anim = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "/danceHover7.json",
    }) as AnimationInstance;

    // Add loading handlers
    anim.addEventListener("data_ready", () => {
      setIsLoading(false);
      setLoadingProgress(100);
    });

    anim.addEventListener("data_failed", () => {
      setIsLoading(false);
      setLoadingProgress(0);
      console.error("Failed to load animation");
    });

    anim.addEventListener("DOMLoaded", () => {
      setLoadingProgress(50);
    });

    // Simulate progress during loading
    let progressInterval: NodeJS.Timeout;
    if (isLoading) {
      progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) return prev; // Cap at 90% until fully loaded
          return Math.min(prev + Math.random() * 10, 90);
        });
      }, 200);
    }

    setAnimation(anim);

    const handleScroll = () => {
      if (anim) {
        const progress = scrollYProgress.get();
        const frame = Math.round(progress * (anim.totalFrames - 1));
        anim.goToAndStop(frame, true);
      }
    };

    const handleResize = () => {
      window.dispatchEvent(new Event("resize"));
    };

    window.addEventListener("resize", handleResize);
    const unsubscribe = scrollYProgress.on("change", handleScroll);

    return () => {
      anim?.destroy();
      window.removeEventListener("resize", handleResize);
      unsubscribe();
      clearInterval(progressInterval);
    };
  }, [scrollYProgress]);

  return (
    <div
      ref={containerRef}
      className="min-h-[1100vh] w-screen relative bg-[#1a1a1a]"
    >
      <div className="h-[50vh]" />

      {/* Loading Progress */}
      {isLoading && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 z-20 flex flex-col gap-2">
          <Progress
            size="md"
            radius="sm"
            value={loadingProgress}
            color="primary"
            aria-label="Loading animation..."
            className="max-w-md"
            showValueLabel={true}
            classNames={{
              base: "max-w-md",
              labelWrapper: "text-gray-400",
              value: "text-gray-400",
            }}
          />
        </div>
      )}

      <motion.div
        ref={lottieContainerRef}
        className={`fixed w-full h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
      />
    </div>
  );
};

export default LottieScrollAnimation;
