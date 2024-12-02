import { PathFinder } from "../../pathFinderClass";
import { Position, Direction } from "../../types";
import { isIntersection, isLetter, isPath } from "../../utils";

jest.mock("../../utils", () => ({
  getValidDirections: jest.fn(() => [
    { row: 0, col: 1 }, // Right
    { row: 1, col: 0 }, // Down
    { row: 0, col: -1 }, // Left
    { row: -1, col: 0 }, // Up
  ]),
  isLetter: jest.fn(),
  isEnd: jest.fn(),
  isIntersection: jest.fn(),
  isPath: jest.fn(),
}));

describe("PathFinder", () => {
  let map: string[][];
  let pathFinder: PathFinder;

  //   beforeEach(() => {
  //     map = [
  //       ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
  //       [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
  //       [" ", " ", "x", "-", "B", "-", "+", " ", "C"],
  //       [" ", " ", " ", " ", " ", " ", "|", " ", "|"],
  //       [" ", " ", " ", " ", " ", " ", "+", "-", "+"],
  //     ];
  //     pathFinder = new PathFinder(map);
  //   });

  //   test("findStart should return the correct start position", () => {
  //     const start = pathFinder.findStart();
  //     expect(start).toEqual({ row: 0, col: 0 });
  //   });

  //   test("findEnd should return true if end position exists", () => {
  //     expect(pathFinder.findEnd()).toBe(true);
  //   });

  //   test("findStartingDirection should return the correct starting direction", () => {
  //     const start = pathFinder.findStart();
  //     const direction = pathFinder.findStartingDirection(start!);
  //     expect(direction).toEqual({ row: 0, col: 1 }); // Assuming right direction
  //   });

  //   test("getNextChar should return the correct next character", () => {
  //     const current: Position = { row: 0, col: 0 };
  //     const direction: Direction = { row: 0, col: 1 };
  //     const nextChar = pathFinder.getNextChar(current, direction);
  //     expect(nextChar).toEqual({ nextRow: 0, nextCol: 1, nextChar: "-" });
  //   });

  //   test("collectLettersAndPath should collect the correct letters and path", () => {
  //     pathFinder.collectLettersAndPath();
  //     expect(pathFinder.getLetters()).toBe("ACB");
  //     expect(pathFinder.getPath()).toBe("@---A---+|C|+-+|+-B-x");
  //   });

  //   test("changeDirectionOnLetter should return true if direction changes on letter", () => {
  //     const current: Position = { row: 0, col: 4 };
  //     const direction: Direction = { row: 0, col: 1 };
  //     const changeDirection = pathFinder.changeDirectionOnLetter(
  //       current,
  //       direction
  //     );
  //     expect(changeDirection).toBe(false);
  //   });

  //   test("newDirectionOnIntersection should return the correct new direction", () => {
  //     const nextRow = 2;
  //     const nextCol = 6;
  //     const direction: Direction = { row: 0, col: 1 };
  //     const newDirection = pathFinder.newDirectionOnIntersection(
  //       nextRow,
  //       nextCol,
  //       direction
  //     );
  //     expect(newDirection).toEqual({ row: 1, col: 0 }); // Assuming down direction
  //   });

  //   test("should throw error if start position is missing", () => {
  //     const emptyMap: string[][] = [];
  //     const emptyPathFinder = new PathFinder(emptyMap);
  //     expect(() => emptyPathFinder.findStart()).toThrow(
  //       "Start position '@' missing"
  //     );
  //   });

  //   test("should handle map with no start character", () => {
  //     const noStartMap: string[][] = [
  //       ["-", "-", "-", "A", "-", "-", "-", "+"],
  //       [" ", " ", " ", " ", " ", " ", " ", "|"],
  //       [" ", " ", "x", "-", "B", "-", "+", "C"],
  //       [" ", " ", " ", " ", " ", " ", "|", "|"],
  //       [" ", " ", " ", " ", " ", " ", "+", "+"],
  //     ];
  //     const noStartPathFinder = new PathFinder(noStartMap);
  //     expect(() => noStartPathFinder.findStart()).toThrow(
  //       "Start position '@' missing"
  //     );
  //   });

  //   test("should handle map with no end character", () => {
  //     const noEndMap: string[][] = [
  //       ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
  //       [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
  //       [" ", " ", "L", "-", "B", "-", "+", " ", " "],
  //       [" ", " ", " ", " ", " ", " ", "|", " ", "|"],
  //       [" ", " ", " ", " ", " ", " ", "+", "-", "+"],
  //     ];
  //     const noEndPathFinder = new PathFinder(noEndMap);
  //     expect(() => noEndPathFinder.findEnd()).toThrow(
  //       "End position 'x' not found"
  //     );
  //   });

  //   test("should handle intersections with multiple possible directions", () => {
  //     const intersectionMap: string[][] = [
  //       ["@", "-", "+", "-", "A"],
  //       [" ", " ", "|", " ", "|"],
  //       [" ", " ", "+", "-", "+"],
  //       [" ", " ", " ", " ", " "],
  //     ];
  //     const intersectionPathFinder = new PathFinder(intersectionMap);
  //     const start = intersectionPathFinder.findStart();
  //     const direction = intersectionPathFinder.findStartingDirection(start!);
  //     const newDirection = intersectionPathFinder.newDirectionOnIntersection(
  //       0,
  //       2,
  //       direction!
  //     );
  //     expect(newDirection).toEqual({ row: 1, col: 0 }); // Assuming down direction
  //   });

  describe("getNextChar", () => {
    let pathFinder: PathFinder;
    const map = [
      ["@", "-", "-", "-", "A"],
      [" ", " ", " ", " ", "|"],
      [" ", " ", "x", "-", "B"],
    ];

    beforeEach(() => {
      pathFinder = new PathFinder(map);
    });

    it("should return the correct next character and position when moving right", () => {
      const current: Position = { row: 0, col: 0 };
      const direction: Position = { row: 0, col: 1 };
      const result = pathFinder.getNextChar(current, direction);
      expect(result).toEqual({ nextRow: 0, nextCol: 1, nextChar: "-" });
    });

    it("should return the correct next character and position when moving down", () => {
      const current: Position = { row: 0, col: 4 };
      const direction: Position = { row: 1, col: 0 };
      const result = pathFinder.getNextChar(current, direction);
      expect(result).toEqual({ nextRow: 1, nextCol: 4, nextChar: "|" });
    });

    it('should return -1 for nextRow and nextCol and " " for nextChar when out of bounds', () => {
      const current: Position = { row: 2, col: 4 };
      const direction: Position = { row: 1, col: 0 };
      const result = pathFinder.getNextChar(current, direction);
      expect(result).toEqual({ nextRow: -1, nextCol: -1, nextChar: " " });
    });

    it("should return the correct next character and position when moving left", () => {
      const current: Position = { row: 2, col: 3 };
      const direction: Position = { row: 0, col: -1 };
      const result = pathFinder.getNextChar(current, direction);
      expect(result).toEqual({ nextRow: 2, nextCol: 2, nextChar: "x" });
    });

    it("should return the correct next character and position when moving up", () => {
      const current: Position = { row: 1, col: 4 };
      const direction: Position = { row: -1, col: 0 };
      const result = pathFinder.getNextChar(current, direction);
      expect(result).toEqual({ nextRow: 0, nextCol: 4, nextChar: "A" });
    });
  });

  describe("findStart", () => {
    it('should return the correct start position when there is exactly one "@"', () => {
      const map = [
        [" ", " ", " "],
        [" ", "@", " "],
        [" ", " ", " "],
      ];
      const pathFinder = new PathFinder(map);
      const expectedStart: Position = { row: 1, col: 1 };
      expect(pathFinder.findStart()).toEqual(expectedStart);
    });

    it('should throw an error if there is no "@" in the map', () => {
      const map = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
      ];
      const pathFinder = new PathFinder(map);
      expect(() => pathFinder.findStart()).toThrow(
        "Start position '@' missing"
      );
    });

    it('should throw an error if there are multiple "@" in the map', () => {
      const map = [
        ["@", " ", " "],
        [" ", "@", " "],
        [" ", " ", " "],
      ];
      const pathFinder = new PathFinder(map);
      expect(() => pathFinder.findStart()).toThrow(
        "Multiple start positions '@'"
      );
    });
  });

  describe("findEnd", () => {
    it("should return true if the end position 'x' is found", () => {
      const map = [
        ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
        [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
        [" ", " ", "x", "-", "B", "-", "+", " ", "C"],
        [" ", " ", " ", " ", " ", " ", "|", " ", "|"],
        [" ", " ", " ", " ", " ", " ", "+", "-", "+"],
      ];
      const pathFinder = new PathFinder(map);
      expect(pathFinder.findEnd()).toBe(true);
    });

    it("should throw an error if the end position 'x' is not found", () => {
      const map = [
        ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
        [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
        [" ", " ", " ", "-", "B", "-", "+", " ", "C"],
        [" ", " ", " ", " ", " ", " ", "|", " ", "|"],
        [" ", " ", " ", " ", " ", " ", "+", "-", "+"],
      ];
      const pathFinder = new PathFinder(map);
      expect(() => pathFinder.findEnd()).toThrow("End position 'x' not found");
    });
  });

  describe("findStartingDirection", () => {
    it("should return the correct starting direction when there is exactly one valid direction", () => {
      const map = [
        ["@", "-", " "],
        [" ", " ", " "],
        [" ", " ", " "],
      ];
      const pathFinder = new PathFinder(map);
      const start: Position = { row: 0, col: 0 };
      const expectedDirection: Direction = { row: 0, col: 1 }; // Right

      const direction = pathFinder.findStartingDirection(start);

      expect(direction).toEqual(expectedDirection);
    });

    it("should throw an error when there are no valid starting directions", () => {
      const map = [
        ["@", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
      ];
      const pathFinder = new PathFinder(map);
      const start: Position = { row: 0, col: 0 };

      expect(() => pathFinder.findStartingDirection(start)).toThrow(
        "Invalid map: There should be exactly one starting direction."
      );
    });

    it("should throw an error when there are multiple valid starting directions", () => {
      const map = [
        ["@", "-", "-"],
        ["|", " ", " "],
        [" ", " ", " "],
      ];
      const pathFinder = new PathFinder(map);
      const start: Position = { row: 0, col: 0 };

      expect(() => pathFinder.findStartingDirection(start)).toThrow(
        "Invalid map: There should be exactly one starting direction."
      );
    });
  });

  describe("changeDirectionOnLetter", () => {
    let pathFinder: PathFinder;
    const map = [
      ["@", "-", "A", "-", "x"],
      [" ", " ", "|", " ", " "],
      ["G", " ", "B", "-", "C"],
    ];

    beforeEach(() => {
      pathFinder = new PathFinder(map);
    });

    it("should return false if the next character is not a letter", () => {
      (isLetter as jest.Mock).mockReturnValue(false);

      const current: Position = { row: 0, col: 1 };
      const direction: Direction = { row: 0, col: 1 };

      const result = pathFinder.changeDirectionOnLetter(current, direction);
      expect(result).toBe(false);
    });

    it("should return true if the next character is a letter and there is no valid next character", () => {
      (isLetter as jest.Mock).mockReturnValue(true);

      const current: Position = { row: 3, col: 2 };
      const direction: Direction = { row: 0, col: -1 };

      const result = pathFinder.changeDirectionOnLetter(current, direction);
      expect(result).toBe(true);
    });

    it("should return false if the next character is a letter but there is a valid next character", () => {
      (isLetter as jest.Mock).mockReturnValue(true);

      const current: Position = { row: 2, col: 2 };
      const direction: Direction = { row: 0, col: 1 };

      const result = pathFinder.changeDirectionOnLetter(current, direction);
      expect(result).toBe(false);
    });
  });

  describe("newDirectionOnIntersection", () => {
    let pathFinder: PathFinder;
    let map: string[][];

    beforeEach(() => {
      map = [
        [" ", " ", " ", " ", " "],
        [" ", "@", "-", "-", "+"],
        [" ", " ", " ", " ", "|"],
        [" ", " ", " ", " ", "x"],
      ];
      pathFinder = new PathFinder(map);
    });

    test("should move up when moving horizontally and there is a valid path above", () => {
      const direction: Direction = { row: 0, col: 1 }; // Moving right
      const newDirection = pathFinder.newDirectionOnIntersection(
        1,
        4,
        direction
      );
      expect(newDirection).toEqual({ row: -1, col: 0 }); // Move up
    });

    test("should move left when moving vertically and there is a valid path to the left", () => {
      const direction: Direction = { row: 1, col: 0 }; // Moving down
      map[2][3] = "-"; // Add a path to the left
      const newDirection = pathFinder.newDirectionOnIntersection(
        2,
        4,
        direction
      );
      expect(newDirection).toEqual({ row: 0, col: -1 }); // Move left
    });

    test("should throw an error if no valid direction is found", () => {
      const direction: Direction = { row: 0, col: 1 }; // Moving right
      (isLetter as jest.Mock).mockReturnValue(false);
      expect(() => {
        pathFinder.newDirectionOnIntersection(3, 0, direction);
      }).toThrow(
        "Invalid map: No valid horizontal direction found - fake turn"
      );
    });
  });

  describe("isDirectionFromWhichWeAreComing", () => {
    let pathFinder: PathFinder;

    beforeEach(() => {
      // Initialize with a dummy map, as the map is not used in this test
      pathFinder = new PathFinder([[]]);
    });

    it("should return true if the direction is the opposite", () => {
      const currentDirection: Direction = { row: 1, col: 0 }; // Moving down
      const oppositeDirection: Direction = { row: -1, col: 0 }; // Moving up

      expect(
        pathFinder.isDirectionFromWhichWeAreComing(
          oppositeDirection,
          currentDirection
        )
      ).toBe(true);
    });

    it("should return false if the direction is not the opposite", () => {
      const currentDirection: Direction = { row: 1, col: 0 }; // Moving down
      const differentDirection: Direction = { row: 0, col: 1 }; // Moving right

      expect(
        pathFinder.isDirectionFromWhichWeAreComing(
          differentDirection,
          currentDirection
        )
      ).toBe(false);
    });

    it("should return false if the direction is the same", () => {
      const currentDirection: Direction = { row: 1, col: 0 }; // Moving down

      expect(
        pathFinder.isDirectionFromWhichWeAreComing(
          currentDirection,
          currentDirection
        )
      ).toBe(false);
    });
  });

  describe("isValidPathAfterIntersection", () => {
    let pathFinder: PathFinder;

    beforeEach(() => {
      const map = [
        ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
        [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
        [" ", " ", "x", "-", "B", "-", "+", " ", "C"],
        [" ", " ", " ", " ", " ", " ", "|", " ", "|"],
        [" ", " ", " ", " ", " ", " ", "+", "-", "+"],
      ];
      pathFinder = new PathFinder(map);
    });
    it('should return false for vertical direction and "|" character', () => {
      const direction: Direction = { row: 0, col: 1 }; // Horizontal direction
      (isPath as jest.Mock).mockReturnValue(true);
      expect(pathFinder.isValidPathAfterIntersection("|", direction)).toBe(
        false
      );
    });

    it('should return false for horizontal direction and "-" character', () => {
      const direction: Direction = { row: 1, col: 0 }; // Vertical direction
      (isPath as jest.Mock).mockReturnValue(true);
      expect(pathFinder.isValidPathAfterIntersection("-", direction)).toBe(
        false
      );
    });

    it("should return true for valid path character", () => {
      const direction: Direction = { row: 0, col: 1 }; // Horizontal direction
      (isPath as jest.Mock).mockReturnValue(true);
      expect(pathFinder.isValidPathAfterIntersection("-", direction)).toBe(
        true
      );
    });

    it("should return false for non-path character", () => {
      const direction: Direction = { row: 0, col: 1 }; // Horizontal direction
      (isPath as jest.Mock).mockReturnValue(false);
      expect(pathFinder.isValidPathAfterIntersection(" ", direction)).toBe(
        false
      );
    });
  });

  describe("checkValidWaysOnIntersection", () => {
    let pathFinder: PathFinder;
    let map: string[][];

    beforeEach(() => {
      map = [
        [" ", " ", " ", " ", " "],
        ["@", "-", "-", "+", " "],
        [" ", " ", " ", "|", " "],
        [" ", " ", " ", "x", " "],
      ];
      pathFinder = new PathFinder(map);
    });

    it("should not throw an error for a valid intersection with one valid way", () => {
      const current: Position = { row: 1, col: 3 }; // Position of '+'
      const direction: Direction = { row: 0, col: 1 }; // Moving right

      (isIntersection as jest.Mock).mockReturnValue(true);
      (isPath as jest.Mock).mockReturnValue(true);

      expect(() => {
        pathFinder.checkValidWaysOnIntersection(current, direction);
      }).not.toThrow();
    });

    it("should throw an error for an intersection with no valid ways", () => {
      const current: Position = { row: 1, col: 3 }; // Position of '+'
      const direction: Direction = { row: 0, col: 1 }; // Moving left

      // Modify the map to create a scenario with no valid ways
      map[2][3] = " "; // Remove the path below the intersection

      (isIntersection as jest.Mock).mockReturnValue(true);
      (isPath as jest.Mock).mockReturnValue(true);
      expect(() => {
        pathFinder.checkValidWaysOnIntersection(current, direction);
      }).toThrow("Invalid map: No valid ways to move after intersection");
    });

    it("should throw an error for an intersection with multiple valid ways", () => {
      const current: Position = { row: 1, col: 3 }; // Position of '+'
      const direction: Direction = { row: 0, col: 1 }; // Moving right

      (isIntersection as jest.Mock).mockReturnValue(true);
      (isPath as jest.Mock).mockReturnValue(true);
      map[0][3] = "|"; // Add a path below the intersection

      expect(() => {
        pathFinder.checkValidWaysOnIntersection(current, direction);
      }).toThrow("Invalid map: Multiple valid ways to move after intersection");
    });
  });
});
