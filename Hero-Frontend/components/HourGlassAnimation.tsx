import React, { useEffect, useRef } from "react";
import Matter from "matter-js";

const MatterAnimation: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const Runner = Matter.Runner;
    const Bodies = Matter.Bodies;
    const Composite = Matter.Composite;
    const MouseConstraint = Matter.MouseConstraint;
    const Mouse = Matter.Mouse;
    const Events = Matter.Events;
    const Body = Matter.Body;

    // Create an engine
    engineRef.current = Engine.create();

    // Create a renderer
    renderRef.current = Render.create({
      element: sceneRef.current,
      engine: engineRef.current,
      options: {
        width: sceneRef.current.clientWidth,
        height: sceneRef.current.clientHeight,
        wireframes: false,
        background: "transparent",
      },
    });

    const createRectangles = () => {
      const matterElems =
        sceneRef.current?.querySelectorAll<HTMLElement>(".dm-matter-elem");
      if (!matterElems) return [];

      return Array.from(matterElems).map((matterElem) => {
        const elemWidth = matterElem.offsetWidth;
        const elemHeight = matterElem.offsetHeight;
        const elemPosX = matterElem.offsetLeft + elemWidth / 2;
        const elemPosY = matterElem.offsetTop + elemHeight / 2;

        const elemBody = Bodies.rectangle(
          elemPosX,
          elemPosY,
          elemWidth,
          elemHeight,
          {
            density: 0.01,
            friction: 0.1,
            restitution: 0.5,
            render: { opacity: 0 },
          }
        );

        if (engineRef.current) {
          Composite.add(engineRef.current.world, elemBody);
        }
        return { body: elemBody, elem: matterElem };
      });
    };

    const createCircles = () => {
      const matterCircles = sceneRef.current?.querySelectorAll<HTMLElement>(
        ".dm-matter-elem-circle"
      );
      if (!matterCircles) return [];

      return Array.from(matterCircles).map((matterCircle) => {
        const circleWidth = matterCircle.offsetWidth;
        const circleHeight = matterCircle.offsetHeight;
        const circlePosX = matterCircle.offsetLeft + circleWidth / 2;
        const circlePosY = matterCircle.offsetTop + circleHeight / 2;

        const circleBody = Bodies.circle(
          circlePosX,
          circlePosY,
          Math.max(circleWidth, circleHeight) / 2,
          {
            density: 0.01,
            friction: 0.1,
            restitution: 0.5,
            render: { opacity: 0 },
          }
        );

        if (engineRef.current) {
          Composite.add(engineRef.current.world, circleBody);
        }
        return { body: circleBody, elem: matterCircle };
      });
    };

    const createPills = () => {
      const matterPills = sceneRef.current?.querySelectorAll<HTMLElement>(
        ".dm-matter-elem-pill"
      );
      if (!matterPills) return [];

      return Array.from(matterPills).map((matterPill) => {
        const pillWidth = matterPill.offsetWidth;
        const pillHeight = matterPill.offsetHeight;
        const pillPosX = matterPill.offsetLeft + pillWidth / 2;
        const pillPosY = matterPill.offsetTop + pillHeight / 2;
        const pillRadius = pillHeight / 2;

        const leftCircle = Bodies.circle(
          pillPosX - pillWidth / 2 + pillRadius,
          pillPosY,
          pillRadius,
          {
            density: 0.01,
            friction: 0.1,
            restitution: 0.5,
            render: { opacity: 0 },
          }
        );

        const rightCircle = Bodies.circle(
          pillPosX + pillWidth / 2 - pillRadius,
          pillPosY,
          pillRadius,
          {
            density: 0.01,
            friction: 0.1,
            restitution: 0.5,
            render: { opacity: 0 },
          }
        );

        const rect = Bodies.rectangle(
          pillPosX,
          pillPosY,
          pillWidth - pillHeight,
          pillHeight,
          {
            density: 0.01,
            friction: 0.1,
            restitution: 0.5,
            render: { opacity: 0 },
          }
        );

        const pillBody = Body.create({
          parts: [leftCircle, rightCircle, rect],
          friction: 0.1,
          restitution: 0.5,
        });

        if (engineRef.current) {
          Composite.add(engineRef.current.world, pillBody);
        }
        return { body: pillBody, elem: matterPill };
      });
    };

    const createBoundaries = () => {
      if (!sceneRef.current || !engineRef.current) return;

      const width = sceneRef.current.clientWidth;
      const height = sceneRef.current.clientHeight;

      const ground = Bodies.rectangle(width / 2, height, width, 1, {
        isStatic: true,
        render: { opacity: 0 },
      });
      const leftWall = Bodies.rectangle(0, height / 2, 1, height, {
        isStatic: true,
        render: { opacity: 0 },
      });
      const rightWall = Bodies.rectangle(width, height / 2, 1, height, {
        isStatic: true,
        render: { opacity: 0 },
      });
      const topWall = Bodies.rectangle(width / 2, 0, width, 1, {
        isStatic: true,
        render: { opacity: 0 },
      });

      Composite.add(engineRef.current.world, [
        ground,
        leftWall,
        rightWall,
        topWall,
      ]);
    };

    const elemBodies = createRectangles();
    const elemCircles = createCircles();
    const elemPills = createPills();
    createBoundaries();

    // Add mouse control
    if (renderRef.current && engineRef.current && renderRef.current.canvas) {
      const mouse = Mouse.create(renderRef.current.canvas);
      const mouseConstraint = MouseConstraint.create(engineRef.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: { visible: false },
        },
      });

      Composite.add(engineRef.current.world, mouseConstraint);
      renderRef.current.mouse = mouse;
    }

    // Update positions and rotations
    if (engineRef.current) {
      Events.on(engineRef.current, "afterUpdate", () => {
        [...elemBodies, ...elemCircles, ...elemPills].forEach(
          ({ body, elem }) => {
            const { x, y } = body.position;
            const angle = body.angle;
            elem.style.transform = `translate(${x - elem.offsetWidth / 2}px, ${y - elem.offsetHeight / 2}px) rotate(${angle}rad)`;
          }
        );
      });
    }

    // Run the engine
    runnerRef.current = Runner.create();
    if (engineRef.current) {
      Runner.run(runnerRef.current, engineRef.current);
    }
    if (renderRef.current) {
      Render.run(renderRef.current);
    }

    // Cleanup function
    return () => {
      if (renderRef.current) {
        Render.stop(renderRef.current);
        if (renderRef.current.canvas) {
          renderRef.current.canvas.remove();
        }
        renderRef.current.canvas = null as any;
        renderRef.current.context = null as any;
        renderRef.current = null;
      }
      if (engineRef.current && runnerRef.current) {
        Runner.stop(runnerRef.current);
        Engine.clear(engineRef.current);
        engineRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      className="matter-box"
      style={{ width: "100%", height: "400px", position: "relative" }}
    >
      <div
        className="dm-matter-elem"
        style={{
          width: "50px",
          height: "50px",
          background: "red",
          position: "absolute",
        }}
      ></div>
      <div
        className="dm-matter-elem-circle"
        style={{
          width: "50px",
          height: "50px",
          background: "blue",
          borderRadius: "50%",
          position: "absolute",
        }}
      ></div>
      <div
        className="dm-matter-elem-pill"
        style={{
          width: "100px",
          height: "50px",
          background: "green",
          borderRadius: "25px",
          position: "absolute",
        }}
      ></div>
    </div>
  );
};

export default MatterAnimation;
