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

interface NumberItem {
  number: string;
  imgPath: string;
}

// interface NumberConfig {
//   number: string;
//   imgPath: string;
//   path: string;
// }

// The SVG path for the hourglass shape
const hourglassPath =
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

function loadAndColorSVG(imgPath: string, color: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fetch(imgPath)
      .then((response) => response.text())
      .then((svgText) => {
        // Parse the SVG as a DOM element
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDoc.querySelector("svg");

        if (!svgElement) {
          return reject("SVG element not found");
        }

        // Change the fill color of all paths in the SVG
        const paths = svgElement.querySelectorAll("path");
        paths.forEach((path) => {
          path.setAttribute("fill", color);
        });

        // Serialize the updated SVG back to a string
        const serializer = new XMLSerializer();
        const updatedSvgText = serializer.serializeToString(svgElement);

        // Convert the updated SVG string to a Blob and create an Object URL
        const blob = new Blob([updatedSvgText], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);

        // Resolve the updated image URL
        resolve(url);
      })
      .catch((error) => {
        console.error("Error loading or coloring SVG:", error);
        reject(error);
      });
  });
}

const HourglassAnimation: React.FC<Props> = ({
  hourGlassColor = "#ff2000",
  comingSoonColor = "#FF0000",
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
    const scaleFactor: number =
      window.innerWidth > 761 ? 1 : window.innerWidth / 761;
    const centerPoint: Matter.Vector = Matter.Vertices.centre(vertices);
    const scaledVertices = Matter.Vertices.scale(
      vertices,
      scaleFactor,
      scaleFactor,
      centerPoint
    );

    return Matter.Bodies.fromVertices(x, y, [scaledVertices], options, true);
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

      console.log("width of bound", width);

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
        window.innerWidth > 761 ? 700 : (window.innerWidth / 761) * 700,
        {
          isStatic: true,
          render: {
            fillStyle: "rgba(0, 255, 0, 0)",
          },
        }
      );

      World.add(engine.world, hourglass);

      // Add letters
      letters.forEach((letter, index) => {
        if (letter.imgPath) {
          const yPosition = index < 6 ? height * 0.2 : height * 0.3; // Position based on index
          const xOffset = ((index % 6) - 2.5) * 50; // Adjust xOffset for alignment

          const color = comingSoonColor; // Use comingSoonColor as fill color

          // Load and color the SVG for the letter
          loadAndColorSVG(letter.imgPath, color)
            .then((coloredSVGUrl) => {
              // Create a rectangle body and use the SVG as its texture
              const letterBody = Bodies.rectangle(
                width / 2 + xOffset,
                yPosition,
                window.innerWidth > 761 ? 120 : (window.innerWidth / 761) * 120, // width of the body
                window.innerWidth > 761 ? 200 : (window.innerWidth / 761) * 200, // height of the body
                {
                  restitution: 0.2,
                  friction: 0.1,
                  density: 0.001,
                  render: {
                    sprite: {
                      texture: coloredSVGUrl, // Use the colored SVG as the texture
                      xScale:
                        window.innerWidth > 761 ? 1 : window.innerWidth / 761,
                      yScale:
                        window.innerWidth > 761 ? 1 : window.innerWidth / 761,
                    },
                  },
                }
              );

              // Add the letter body to the Matter.js world
              World.add(engine.world, letterBody);
            })
            .catch((error) => {
              console.error("Error applying color to SVG:", error);
            });
        }
      });

      // Add numbers
      numbers.forEach((number, index) => {
        if (number.imgPath) {
          const color = numbersColor; // Use numbersColor as fill color

          // Load and color the SVG for the number
          loadAndColorSVG(number.imgPath, color)
            .then((coloredSVGUrl) => {
              const yPosition = -200; // Position numbers slightly above the letters

              // Create a rectangle body and use the SVG as its texture
              const numberBody = Bodies.rectangle(
                width / 2 + (index - 4) * 100, // Spread numbers horizontally
                yPosition,
                window.innerWidth > 761 ? 100 : (window.innerWidth / 761) * 100, // width of the body
                window.innerWidth > 761 ? 150 : (window.innerWidth / 761) * 150, // height of the body
                {
                  restitution: 0.7,
                  render: {
                    sprite: {
                      texture: coloredSVGUrl, // Use the colored SVG as the texture
                      xScale: 1,
                      yScale: 1,
                    },
                  },
                }
              );

              // Add the number body to the Matter.js world
              World.add(engine.world, numberBody);
            })
            .catch((error) => {
              console.error("Error applying color to SVG:", error);
            });
        }
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
    <div className="relative w-full h-screen">
      <div
        ref={sceneRef}
        className="flex items-center justify-center inset-0 z-10 bg-transparent"
      />

      {/* Static hourglass SVG for visual reference */}

      {/* Noise overlay */}
      <div
        className="fixed inset-0 z-50 pointer-events-none opacity-50 mix-blend-multiply"
        // style={{
        //   backgroundImage:
        //     "url(https://herdl.com/wp-content/uploads/2020/11/noise-web.webp)",
        //   backgroundRepeat: "repeat",
        //   backgroundSize: "auto",
        //   animation: "noise 100ms infinite",
        // }}
      />
    </div>
  );
};

export default HourglassAnimation;
