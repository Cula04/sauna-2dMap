import { Direction } from "./types";

export function getValidDirections(): Direction[] {
  return [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 }, // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 }, // Right
  ];
}

export function isLetter(char: string): boolean {
  return !!char && /[A-Z]/.test(char);
}

export function isPath(char: string): boolean {
  return char === "-" || char === "|" || char === "+" || isLetter(char);
}

export function isIntersection(char: string): boolean {
  return char === "+";
}

export function isEnd(char: string): boolean {
  return char === "x";
}
