// types/poly-decomp.d.ts
declare module "poly-decomp" {
  export function quickDecomp(vertices: number[][]): number[][][];
  export function decomp(vertices: number[][]): number[][][];
  export function isSimple(vertices: number[][]): boolean;
  export function removeCollinearPoints(
    vertices: number[][],
    thresholdAngle: number
  ): void;
  export function removeDuplicatePoints(
    vertices: number[][],
    precision: number
  ): void;
  export function makeCCW(vertices: number[][]): void;
}
