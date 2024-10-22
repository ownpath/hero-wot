import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import decomp from "poly-decomp";
import { createVerticesFromSVGPath } from "@/utils/svgUtils";

interface Props {
  hourGlassColor?: string;
  comingSoonColor?: string;
  numbersColor?: string;
}

// Interfaces
interface Props {
  hourGlassColor?: string;
  comingSoonColor?: string;
  numbersColor?: string;
}

interface LetterConfig {
  letter: string;
  imgPath: string;
}

interface NumberConfig {
  number: string;
  imgPath: string;
  path: string;
}

// The SVG path for the hourglass shape
const hourglassPath =
  "M437.854 928C437.854 956.257 456.674 981.009 483.853 988.668C643.774 1033.74 761 1180.78 761 1355.23V1918H0V1355.23C0 1180.78 117.226 1033.74 277.147 988.668C304.326 981.009 323.146 956.262 323.146 928C323.146 899.743 304.326 874.991 277.147 867.332C117.226 822.268 0 675.215 0 500.767V-62H761V500.767C761 675.215 643.774 822.264 483.853 867.332C456.674 874.991 437.854 899.738 437.854 928Z";

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

const numbers = Array.from({ length: 10 }, (_, i) => ({
  number: i.toString(),
  path: `...your ${i} SVG path here...`,
}));

const HourglassAnimation: React.FC<Props> = ({
  hourGlassColor = "#ff5310",
  comingSoonColor = "#100000",
  numbersColor = "#FFFFFF",
}) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const renderRef = useRef<Matter.Render>();
  const runnerRef = useRef<Matter.Runner>();

  const createSVGBodyFromPath = (
    path: string,
    x: number,
    y: number,
    options: Matter.IBodyDefinition
  ) => {
    const vertices = createVerticesFromSVGPath(path);
    return Matter.Bodies.fromVertices(x, y, [vertices], options, true);
  };

  const cleanup = () => {
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
  };

  const initScene = () => {
    if (!sceneRef.current) return;

    try {
      const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } =
        Matter;

      cleanup();

      // Set up decomp
      //window.decomp = decomp;
      Matter.Common.setDecomp(decomp);

      // Create engine
      const engine = Engine.create();
      engineRef.current = engine;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Create renderer
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

      // Create hourglass boundary
      const hourglass = createSVGBodyFromPath(
        hourglassPath,
        width / 2,
        height / 1.5,
        {
          isStatic: true,
          render: {
            fillStyle: "transparent",
            strokeStyle: hourGlassColor,
            lineWidth: 1,
          },
        }
      );
      World.add(engine.world, hourglass);

      // Add letters
      letters.forEach((letter, index) => {
        const yPosition = index < 6 ? height * 0.2 : height * 0.3;
        const xOffset = ((index % 6) - 2.5) * 50;

        const letterBody = createSVGBodyFromPath(
          letter.imgPath,
          width / 2 + xOffset,
          yPosition,
          {
            render: {
              fillStyle: comingSoonColor,
            },
            restitution: 0.2,
            friction: 0.1,
            density: 0.001,
          }
        );
        World.add(engine.world, letterBody);
      });

      // Add numbers
      numbers.forEach((number, index) => {
        const numberBody = createSVGBodyFromPath(
          number.path,
          width / 2 + (index - 4.5) * 40,
          height * 0.1,
          {
            render: {
              fillStyle: numbersColor,
            },
            restitution: 0.7,
            friction: 0.1,
            density: 0.001,
          }
        );
        World.add(engine.world, numberBody);
      });

      // Add mouse interaction
      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });
      World.add(engine.world, mouseConstraint);

      // Add gravity
      engine.world.gravity.y = 0.5;

      // Start simulation
      const runner = Runner.create();
      Runner.run(runner, engine);
      Render.run(render);
      runnerRef.current = runner;

      // Keep the mouse in sync with rendering
      render.mouse = mouse;
    } catch (error) {
      console.error("Error initializing scene:", error);
    }
  };

  useEffect(() => {
    initScene();

    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initScene, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      cleanup();
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      <div
        ref={sceneRef}
        className="absolute inset-0 z-10 overflow-hidden bg-transparent"
      />

      {/* Static hourglass SVG for visual reference */}
      <svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4 z-0"
        width="761"
        height="1918"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={hourglassPath} fill={hourGlassColor} />
      </svg>

      {/* Noise overlay */}
      <div
        className="fixed inset-0 z-50 pointer-events-none opacity-50 mix-blend-multiply"
        style={{
          backgroundImage:
            "url(https://herdl.com/wp-content/uploads/2020/11/noise-web.webp)",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          animation: "noise 100ms infinite",
        }}
      />
    </div>
  );
};

export default HourglassAnimation;
