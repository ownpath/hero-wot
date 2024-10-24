import React, { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import decomp from "poly-decomp";
import { createVerticesFromSVGPath } from "@/utils/svgUtils";
import { useTheme } from "next-themes";

interface Props {
  comingSoonClass?: string;
  numbersClass?: string;
}

interface LetterConfig {
  letter: string;
  imgPath: string;
}

interface NumberItem {
  number: string;
  imgPath: string;
}

const HOURGLASS_PATH =
  "M145 0V561.767L158.87 664L184.056 730L214.354 781L263.5 837.899L322 883.57C322 883.57 386.346 918.244 422.147 928.332H628.353C664.154 918.244 728.5 883.57 728.5 883.57L787 837.899L836.146 781L866.444 730L891.63 664L905.5 561.767V0H1051V959H0V0H145Z";

const letters: LetterConfig[] = [
  { letter: "C", imgPath: "/shapes/c.svg" },
  { letter: "o", imgPath: "/shapes/o.svg" },
  { letter: "m", imgPath: "/shapes/m.svg" },
  { letter: "i", imgPath: "/shapes/i.svg" },
  { letter: "n", imgPath: "/shapes/n.svg" },
  { letter: "g", imgPath: "/shapes/g.svg" },
  { letter: "S", imgPath: "/shapes/s.svg" },
  { letter: "o", imgPath: "/shapes/o2.svg" },
  { letter: "o", imgPath: "/shapes/o3.svg" },
  { letter: "n", imgPath: "/shapes/n2.svg" },
];

const numbers: NumberItem[] = [
  { number: "0", imgPath: "/shapes/0.svg" },
  { number: "1", imgPath: "/shapes/1.svg" },
  { number: "2", imgPath: "/shapes/2.svg" },
  { number: "3", imgPath: "/shapes/3.svg" },
  { number: "4", imgPath: "/shapes/4.svg" },
  { number: "5", imgPath: "/shapes/5.svg" },
  { number: "6", imgPath: "/shapes/6.svg" },
  { number: "7", imgPath: "/shapes/7.svg" },
  { number: "8", imgPath: "/shapes/8.svg" },
  { number: "9", imgPath: "/shapes/9.svg" },
];

const getTailwindColor = (className: string): Promise<string> => {
  return new Promise((resolve) => {
    // Small delay to ensure DOM has updated with new theme
    setTimeout(() => {
      const tempEl = document.createElement("div");
      tempEl.className = className;
      document.body.appendChild(tempEl);
      const color = window.getComputedStyle(tempEl).color;
      document.body.removeChild(tempEl);
      resolve(color);
    }, 50); // Small delay to allow theme to apply
  });
};

const createSVGBodyFromPath = (
  path: string,
  x: number,
  y: number,
  options: Matter.IBodyDefinition
): Matter.Body => {
  const vertices = createVerticesFromSVGPath(path);
  const scaleFactor: number =
    window.innerWidth > 761 ? 1 : window.innerWidth / 761;
  const centerPoint = Matter.Vertices.centre(vertices);
  const scaledVertices = Matter.Vertices.scale(
    vertices,
    scaleFactor,
    scaleFactor,
    centerPoint
  );

  return Matter.Bodies.fromVertices(x, y, [scaledVertices], options, true);
};

const svgCache = new Map<string, Promise<string>>();

const clearSVGCache = () => {
  svgCache.forEach(async (promise) => {
    try {
      const url = await promise;
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error revoking URL:", error);
    }
  });
  svgCache.clear();
};

const loadAndColorSVG = async (
  imgPath: string,
  color: string
): Promise<string> => {
  const cacheKey = `${imgPath}-${color}`;

  if (svgCache.has(cacheKey)) {
    return svgCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(imgPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${imgPath}`);
    }

    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = svgDoc.querySelector("svg");

    if (!svgElement) {
      throw new Error("SVG element not found");
    }

    svgElement.querySelectorAll("path").forEach((path) => {
      path.setAttribute("fill", color);
    });

    const serializer = new XMLSerializer();
    const updatedSvgText = serializer.serializeToString(svgElement);
    const blob = new Blob([updatedSvgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    svgCache.set(cacheKey, Promise.resolve(url));
    return url;
  } catch (error) {
    console.error("Error loading SVG:", error);
    throw error;
  }
};

const HourglassAnimation: React.FC<Props> = ({
  comingSoonClass = "text-comingSoon",
  numbersClass = "text-numbers",
}) => {
  const { resolvedTheme, theme } = useTheme();
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const renderRef = useRef<Matter.Render>();
  const runnerRef = useRef<Matter.Runner>();
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [coloredSVGs, setColoredSVGs] = useState<{
    letters: string[];
    numbers: string[];
  } | null>(null);

  const cleanup = useCallback(() => {
    if (renderRef.current && runnerRef.current && engineRef.current) {
      Matter.Render.stop(renderRef.current);
      Matter.Runner.stop(runnerRef.current);
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);

      if (renderRef.current.canvas) {
        renderRef.current.canvas.remove();
      }
      renderRef.current.textures = {};
    }
  }, []);

  const preloadSVGs = useCallback(async () => {
    if (!mounted) return;

    console.log("Starting preload...", { theme, resolvedTheme });
    setIsLoading(true);
    cleanup();
    clearSVGCache();

    try {
      const [comingSoonColor, numbersColor] = await Promise.all([
        getTailwindColor(comingSoonClass),
        getTailwindColor(numbersClass),
      ]);

      console.log("Colors fetched:", { comingSoonColor, numbersColor });

      const letterSVGs = await Promise.all(
        letters.map((letter) =>
          loadAndColorSVG(letter.imgPath, comingSoonColor)
        )
      );

      const numberSVGs = await Promise.all(
        numbers.map((number) => loadAndColorSVG(number.imgPath, numbersColor))
      );

      console.log("SVGs loaded:", {
        letterCount: letterSVGs.length,
        numberCount: numberSVGs.length,
      });

      setColoredSVGs({ letters: letterSVGs, numbers: numberSVGs });
      setIsLoading(false);
    } catch (error) {
      console.error("Error preloading SVGs:", error);
      setIsLoading(false);
    }
  }, [mounted, theme, resolvedTheme, comingSoonClass, numbersClass, cleanup]);

  const initScene = () => {
    if (!sceneRef.current || !coloredSVGs) {
      console.log("Cannot init scene:", {
        hasRef: !!sceneRef.current,
        hasSVGs: !!coloredSVGs,
      });
      return;
    }

    console.log("Initializing scene...");

    try {
      const { Engine, Render, World, Bodies, Runner } = Matter;

      cleanup();

      Matter.Common.setDecomp(decomp);

      const engine = Engine.create();
      engineRef.current = engine;

      const width = window.innerWidth;
      const height = 959;

      const render = Render.create({
        element: sceneRef.current,
        engine: engine,
        options: {
          width,
          height,
          background: "transparent",
          wireframes: false,
          pixelRatio: window.devicePixelRatio || 1,
        },
      });

      renderRef.current = render;

      const hourglass = createSVGBodyFromPath(
        HOURGLASS_PATH,
        width / 2,
        window.innerWidth > 761 ? 700 : (window.innerWidth / 761) * 700,
        {
          isStatic: true,
          render: {
            fillStyle: "rgba(0, 0, 0, 0)",
          },
        }
      );

      World.add(engine.world, hourglass);

      // Add letters
      coloredSVGs.letters.forEach((svgUrl, index) => {
        const yPosition = index < 6 ? height * 0.2 : height * 0.3;
        const xOffset = ((index % 6) - 2.5) * 50;

        const letterBody = Bodies.rectangle(
          width / 2 + xOffset,
          yPosition,
          window.innerWidth > 761 ? 120 : (window.innerWidth / 761) * 120,
          window.innerWidth > 761 ? 200 : (window.innerWidth / 761) * 200,
          {
            restitution: 0.2,
            friction: 0.1,
            density: 0.001,
            render: {
              sprite: {
                texture: svgUrl,
                xScale: window.innerWidth > 761 ? 1 : window.innerWidth / 761,
                yScale: window.innerWidth > 761 ? 1 : window.innerWidth / 761,
              },
            },
          }
        );

        World.add(engine.world, letterBody);
      });

      // Add numbers
      coloredSVGs.numbers.forEach((svgUrl, index) => {
        const numberBody = Bodies.rectangle(
          width / 2 + (index - 4) * 100,
          -200,
          window.innerWidth > 761 ? 100 : (window.innerWidth / 761) * 100,
          window.innerWidth > 761 ? 150 : (window.innerWidth / 761) * 150,
          {
            restitution: 0.7,
            render: {
              sprite: {
                texture: svgUrl,
                xScale: window.innerWidth > 761 ? 1 : window.innerWidth / 761,
                yScale: window.innerWidth > 761 ? 1 : window.innerWidth / 761,
              },
            },
          }
        );

        World.add(engine.world, numberBody);
      });

      engine.world.gravity.y = 0.5;

      const runner = Runner.create();
      Runner.run(runner, engine);
      Render.run(render);
      runnerRef.current = runner;

      console.log("Scene initialized successfully");
    } catch (error) {
      console.error("Error initializing scene:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      cleanup();
      clearSVGCache();
    };
  }, [cleanup]);

  useEffect(() => {
    if (!mounted) return;

    const loadAfterThemeChange = async () => {
      // Wait for theme to be fully applied
      await new Promise((resolve) => setTimeout(resolve, 100));
      await preloadSVGs();
    };

    loadAfterThemeChange();
  }, [mounted, theme, resolvedTheme, preloadSVGs]);

  useEffect(() => {
    if (!isLoading && coloredSVGs && mounted) {
      console.log("Loading complete, initializing scene");
      initScene();
    }
  }, [isLoading, coloredSVGs, mounted]);

  useEffect(() => {
    if (!mounted) return;

    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        preloadSVGs();
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [mounted, preloadSVGs]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative w-full h-screen">
      <div
        ref={sceneRef}
        className="flex items-center justify-center inset-0 z-10 bg-transparent"
      />
      <div className="fixed inset-0 z-50 pointer-events-none opacity-50 mix-blend-multiply" />
    </div>
  );
};

export default HourglassAnimation;
