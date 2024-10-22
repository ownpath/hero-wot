// utils/svgUtils.ts
import Matter from "matter-js";

interface Vertex {
  x: number;
  y: number;
}

interface SVGCache {
  [key: string]: Vertex[];
}

const svgCache: SVGCache = {};

export function svgPathToVertices(path: string): Matter.Vector[] {
  // Check cache
  if (svgCache[path]) {
    return svgCache[path].map((v) => Matter.Vector.create(v.x, v.y));
  }

  // Split path commands by letters, and keep numeric values
  const commands = path.match(/[a-zA-Z][^a-zA-Z]*/g) || [];
  const vertices: Vertex[] = [];
  let currentX = 0;
  let currentY = 0;

  commands.forEach((command) => {
    const type = command[0];
    const numbers = command.slice(1).trim().split(/[ ,]+/).map(Number);

    switch (type) {
      case "M": // Move to
        currentX = numbers[0];
        currentY = numbers[1];
        vertices.push({ x: currentX, y: currentY });
        break;
      case "L": // Line to
        currentX = numbers[0];
        currentY = numbers[1];
        vertices.push({ x: currentX, y: currentY });
        break;
      case "H": // Horizontal line
        currentX = numbers[0];
        vertices.push({ x: currentX, y: currentY });
        break;
      case "V": // Vertical line
        currentY = numbers[0];
        vertices.push({ x: currentX, y: currentY });
        break;
      case "Z": // Close path
        if (vertices.length > 0) {
          vertices.push({ ...vertices[0] }); // Close the path with the first vertex
        }
        break;
      default:
        console.warn(`SVG command ${type} not handled`);
    }
  });

  // Cache the vertices
  svgCache[path] = vertices;

  // Convert to Matter.js vectors
  return vertices.map((v) => Matter.Vector.create(v.x, v.y));
}

export function createVerticesFromSVGPath(path: string): Matter.Vector[] {
  const vertices = svgPathToVertices(path);

  // Ensure the path is closed
  if (
    vertices.length > 0 &&
    (vertices[0].x !== vertices[vertices.length - 1].x ||
      vertices[0].y !== vertices[vertices.length - 1].y)
  ) {
    vertices.push({ ...vertices[0] });
  }

  return vertices;
}
