import React, { useRef, useEffect, useState } from "react";
import lottie from "lottie-web";
import { motion, useScroll, useTransform } from "framer-motion";

// Simple debounce function implementation
const debounce = (func: any, wait: any) => {
  let timeout: any;
  return function executedFunction(...args: any) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const LottieScrollAnimation = () => {
  const containerRef = useRef(null);
  const lottieContainerRef = useRef(null);
  const [animation, setAnimation] = useState(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["center center", "200% bottom"],
  });

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: lottieContainerRef.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "/danceHover7.json",
    });

    setAnimation(anim);

    const handleScroll = () => {
      if (anim) {
        const frame = Math.round(
          scrollYProgress.get() * (anim.totalFrames - 1)
        );
        anim.goToAndStop(frame, true);
      }
    };

    // Optimized resize handler
    const handleResize = debounce(() => {
      // Force recalculation of scroll values
      window.dispatchEvent(new Event("resize"));
    }, 250);

    window.addEventListener("resize", handleResize);

    // Subscribe to scrollYProgress changes
    const unsubscribe = scrollYProgress.on("change", handleScroll);

    return () => {
      if (anim) {
        anim.destroy();
      }
      window.removeEventListener("resize", handleResize);
      unsubscribe();
    };
  }, []);

  return (
    <div className="container" ref={containerRef}>
      <motion.div className="animation-container" ref={lottieContainerRef} />
    </div>
  );
};

// Styles
const styles = `
.container {
  width: 100vw;
  height: 14.28vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.animation-container {
  position: fixed;
  width: 100%;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

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

body::before {
  content: "";
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url(https://herdl.com/wp-content/uploads/2020/11/noise-web.webp);
  background-repeat: repeat;
  background-size: auto;
  animation: noise 100ms infinite;
  pointer-events: none;
  opacity: 0.5;
  mix-blend-mode: multiply;
}
`;

export default LottieScrollAnimation;
