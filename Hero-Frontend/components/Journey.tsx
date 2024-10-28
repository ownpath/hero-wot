import React, { useRef, useEffect, useState } from "react";
import lottie from "lottie-web";
import { motion, useScroll } from "framer-motion";

interface AnimationInstance {
  totalFrames: number;
  goToAndStop: (frame: number, isFrame: boolean) => void;
  destroy: () => void;
}

const LottieScrollAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const [animation, setAnimation] = useState<AnimationInstance | null>(null);

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
    };
  }, [scrollYProgress]);

  return (
    <div
      ref={containerRef}
      className="min-h-[1100vh] w-screen relative bg-[#1a1a1a]"
    >
      <div className="h-[50vh]" />
      <motion.div
        ref={lottieContainerRef}
        className="fixed w-full h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
      />
    </div>
  );
};

const styles = `
.text-precomp {
  animation: float 3s ease-in-out infinite !important;
  display: inline-block !important;
  opacity: 0.5;
}

.smartframe,
.superman {
  position: relative;
}

.frame1,
.frame2,
.superman1,
.superman2 {
  position: absolute;
}

.frame1,
.superman1 {
  animation: showFrame1 0.3s infinite;
}

.frame2,
.superman2 {
  opacity: 0;
  animation: showFrame2 0.3s infinite;
}

@keyframes showFrame1 {
  0%, 50% { opacity: 1; }
  50.1%, 100% { opacity: 0; }
}

@keyframes showFrame2 {
  0%, 50% { opacity: 0; }
  50.1%, 100% { opacity: 1; }
}

@keyframes float {
  0% { transform: translateY(0%); }
  50% { transform: translateY(80px); }
  100% { transform: translateY(0%); }
}

@keyframes noise {
  0%, 100% { background-position: 0% 0%; }
  10% { background-position: -5% -10%; }
  20% { background-position: -15% 5%; }
  30% { background-position: 7% -25%; }
  40% { background-position: 20% 25%; }
  50% { background-position: -25% 10%; }
  60% { background-position: 15% 5%; }
  70% { background-position: 0% 15%; }
  80% { background-position: 25% 35%; }
  90% { background-position: -10% 10%; }
}

/* Noise overlay */
body::before {
  content: "";
  z-index: 50;
  @apply fixed top-0 left-0 w-full h-full pointer-events-none opacity-50;
  background: url(https://herdl.com/wp-content/uploads/2020/11/noise-web.webp);
  background-repeat: repeat;
  background-size: auto;
  animation: noise 100ms infinite;
  mix-blend-mode: multiply;
}

@media only screen and (min-width: 600px) {
  .inside-the-mind-mobile,
  .scroll-header,
  .click-to-view,
  .allhands-window,
  .hello-desktop {
    display: none !important;
  }
  
  .balls-id path {
    fill: aqua !important;
    background-color: blue !important;
  }
}

@media only screen and (max-width: 600px) {
  .inside-the-mind,
  .hello-desktop {
    display: none !important;
  }
}
`;

export default LottieScrollAnimation;
