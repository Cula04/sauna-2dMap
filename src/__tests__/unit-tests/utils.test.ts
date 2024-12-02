import {
  getValidDirections,
  isLetter,
  isPath,
  isIntersection,
  isEnd,
} from "../../utils";
import { Direction } from "../../types";

describe("getValidDirections", () => {
  it("should return an array of valid directions", () => {
    const expectedDirections: Direction[] = [
      { row: -1, col: 0 }, // Up
      { row: 1, col: 0 }, // Down
      { row: 0, col: -1 }, // Left
      { row: 0, col: 1 }, // Right
    ];
    expect(getValidDirections()).toEqual(expectedDirections);
  });
});

describe("isLetter", () => {
  it("should return true for uppercase letters", () => {
    expect(isLetter("A")).toBe(true);
    expect(isLetter("Z")).toBe(true);
  });

  it("should return false for non-uppercase letters", () => {
    expect(isLetter("a")).toBe(false);
    expect(isLetter("1")).toBe(false);
    expect(isLetter("-")).toBe(false);
  });
});

describe("isPath", () => {
  it("should return true for path characters", () => {
    expect(isPath("-")).toBe(true);
    expect(isPath("|")).toBe(true);
    expect(isPath("+")).toBe(true);
    expect(isPath("A")).toBe(true);
  });

  it("should return false for non-path characters", () => {
    expect(isPath("x")).toBe(false);
    expect(isPath(" ")).toBe(false);
    expect(isPath("@")).toBe(false);
  });
});

describe("isIntersection", () => {
  it("should return true for intersection character", () => {
    expect(isIntersection("+")).toBe(true);
  });

  it("should return false for non-intersection characters", () => {
    expect(isIntersection("-")).toBe(false);
    expect(isIntersection("A")).toBe(false);
    expect(isIntersection("x")).toBe(false);
  });
});

describe("isEnd", () => {
  it("should return true for end character", () => {
    expect(isEnd("x")).toBe(true);
  });

  it("should return false for non-end characters", () => {
    expect(isEnd("-")).toBe(false);
    expect(isEnd("A")).toBe(false);
  });
});
