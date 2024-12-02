// src/__tests__/PathFinder.test.ts
import { PathFinder } from "../../pathFinderClass";

describe("PathFinder Valid Paths", () => {
  it("should collect letters and path correctly", async () => {
    const map = [
      ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      [" ", " ", "x", "-", "B", "-", "+", " ", "C"],
      [" ", " ", " ", " ", " ", " ", "|", " ", "|"],
      [" ", " ", " ", " ", " ", " ", "+", "-", "+"],
    ];

    const pathFinder = new PathFinder(map);
    pathFinder.collectLettersAndPath();

    expect(pathFinder.getLetters()).toBe("ACB");
    expect(pathFinder.getPath()).toBe("@---A---+|C|+-+|+-B-x");
  });

  it("should correctly go trough the intersection", async () => {
    const map2 = [
      ["@", " ", " ", " ", " ", " ", " ", " ", " "],
      ["|", " ", "+", "-", "C", "-", "-", "+", " "],
      ["A", " ", "|", " ", " ", " ", " ", "|", " "],
      ["+", "-", "-", "-", "B", "-", "-", "+", " "],
      [" ", " ", "|", " ", " ", " ", " ", " ", "x"],
      [" ", " ", "|", " ", " ", " ", " ", " ", "|"],
      [" ", " ", "+", "-", "-", "D", "-", "-", "+"],
    ];

    const pathFinder = new PathFinder(map2);
    pathFinder.collectLettersAndPath();

    expect(pathFinder.getLetters()).toBe("ABCD");
    expect(pathFinder.getPath()).toBe("@|A+---B--+|+--C-+|-||+--D--+|x");
  });

  it("should correctly handle if letters are found on turns", async () => {
    const map3 = [
      ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      [" ", " ", "x", "-", "B", "-", "+", " ", "|"],
      [" ", " ", " ", " ", " ", " ", "|", " ", "|"],
      [" ", " ", " ", " ", " ", " ", "+", "-", "C"],
    ];

    const pathFinder = new PathFinder(map3);
    pathFinder.collectLettersAndPath();

    expect(pathFinder.getLetters()).toBe("ACB"); // Adjust expected letters if needed
    expect(pathFinder.getPath()).toBe("@---A---+|||C-+|+-B-x"); // Adjust expected path if needed
  });

  it("should not collect a letter from the same location twice", async () => {
    const map4 = [
      [" ", " ", " ", " ", "+", "-", "O", "-", "N", "-", "+"],
      [" ", " ", " ", " ", "|", " ", " ", " ", " ", " ", "|"],
      [" ", " ", " ", " ", "|", " ", " ", " ", "+", "-", "I", "-", "+"],
      ["@", "-", "G", "-", "O", "-", "+", " ", "|", " ", "|", " ", "|"],
      [" ", " ", " ", " ", "|", " ", "|", " ", "+", "-", "+", " ", "E"],
      [" ", " ", " ", " ", "+", "-", "+", " ", " ", " ", " ", " ", "S"],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "|"],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "x"],
    ];

    const pathFinder = new PathFinder(map4);
    pathFinder.collectLettersAndPath();

    expect(pathFinder.getLetters()).toBe("GOONIES");
    expect(pathFinder.getPath()).toBe(
      "@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x"
    );
  });

  it("should keep direction, even in a compact space", async () => {
    const map5 = [
      [" ", "+", "-", "L", "-", "+"],
      [" ", "|", " ", " ", "+", "A", "-", "+"],
      ["@", "B", "+", " ", "+", "+", " ", "H"],
      [" ", "+", "+", " ", " ", " ", " ", "x"],
    ];

    const pathFinder = new PathFinder(map5);
    pathFinder.collectLettersAndPath();

    expect(pathFinder.getLetters()).toBe("BLAH");
    expect(pathFinder.getPath()).toBe("@B+++B|+-L-+A+++A-+Hx");
  });

  it("should ignore stuff after end of path", async () => {
    const map6 = [
      ["@", "-", "A", "-", "-", "+"],
      [" ", " ", " ", " ", " ", "|"],
      [
        " ",
        " ",
        " ",
        " ",
        " ",
        "+",
        "-",
        "B",
        "-",
        "-",
        "x",
        "-",
        "C",
        "-",
        "-",
        "D",
      ],
    ];

    const pathFinder = new PathFinder(map6);
    pathFinder.collectLettersAndPath();

    expect(pathFinder.getLetters()).toBe("AB");
    expect(pathFinder.getPath()).toBe("@-A--+|+-B--x");
  });
});

describe("PathFinder Invalid Paths", () => {
  it("should throw an error for a map with an invalid start", async () => {
    const wrongMap = [
      [" ", " ", " ", " ", "-", "A", "-", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      [" ", "x", "-", "B", "-", "+", " ", " ", "C"],
      [" ", " ", " ", " ", " ", "|", " ", " ", "|"],
      [" ", " ", " ", " ", " ", "+", "-", "-", "+"],
    ];

    const pathFinder = new PathFinder(wrongMap);

    expect(() => pathFinder.collectLettersAndPath()).toThrow(
      "Start position '@' missing"
    );
  });

  it("should throw an error for a map with a missing end position", async () => {
    const wrongMap2 = [
      [" ", " ", "@", "-", "-", "A", "-", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      [" ", " ", "B", "-", "+", " ", " ", " ", "C"],
      [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
      [" ", " ", " ", " ", "+", "-", "-", "-", "+"],
    ];

    const pathFinder = new PathFinder(wrongMap2);

    expect(() => pathFinder.collectLettersAndPath()).toThrow(
      "End position 'x' not found"
    );
  });

  it("should throw an error for a map with multiple start positions", async () => {
    const wrongMap3 = [
      [" ", " ", "@", "-", "-", "A", "-", "-", "x"],
      [" ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", "x", "-", "B", "-", "+", " ", " ", " "],
      [" ", " ", " ", " ", " ", "|", " ", " ", " "],
      [" ", " ", " ", " ", " ", "@", " ", " ", " "],
    ];

    const pathFinder = new PathFinder(wrongMap3);

    expect(() => pathFinder.collectLettersAndPath()).toThrow(
      "Multiple start positions '@'"
    );
  });

  it("should throw an error for a map with a fork in the path", async () => {
    const wrongMap4 = [
      [" ", " ", " ", " ", " ", " ", "x", "-", "B"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      [" ", " ", "@", "-", "-", "A", "-", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      [" ", " ", " ", " ", "x", "+", " ", " ", "C"],
      [" ", " ", " ", " ", " ", "|", " ", " ", "|"],
      [" ", " ", " ", " ", " ", "+", "-", "-", "+"],
    ];

    const pathFinder = new PathFinder(wrongMap4);

    expect(() => pathFinder.collectLettersAndPath()).toThrow(
      "Invalid map: Multiple valid ways to move after intersection"
    );
  });

  it("should throw an error for a map with a broken path", async () => {
    const wrongMap5 = [
      [" ", " ", "@", "-", "-", "A", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", "|"],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", "B", "-", "x"],
    ];

    const pathFinder = new PathFinder(wrongMap5);

    expect(() => pathFinder.collectLettersAndPath()).toThrow(
      "Broken path or invalid map"
    );
  });

  it("should throw an error for a map with multiple starting directions", async () => {
    const wrongMap6 = [["x", "-", "B", "-", "@", "-", "A", "-", "x"]];

    const pathFinder = new PathFinder(wrongMap6);

    expect(() => pathFinder.collectLettersAndPath()).toThrow(
      "Invalid map: There should be exactly one starting direction."
    );
  });

  it("should throw an error for a map with a fake turn", async () => {
    const wrongMap7 = [["@", "-", "A", "-", "+", "-", "B", "-", "x"]];

    const pathFinder = new PathFinder(wrongMap7);

    expect(() => pathFinder.collectLettersAndPath()).toThrow(
      "Invalid map: No valid horizontal direction found - fake turn"
    );
  });
});
