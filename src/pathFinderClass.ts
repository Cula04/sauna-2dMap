import { Position, Direction } from "./types";
import {
  getValidDirections,
  isEnd,
  isIntersection,
  isLetter,
  isPath,
} from "./utils";

export class PathFinder {
  private map: string[][];
  private visited: Set<string>;
  private letters = "";
  private path = "@";

  constructor(map: string[][]) {
    this.map = map;
    this.visited = new Set<string>();
  }

  getLetters(): string {
    return this.letters;
  }

  getPath(): string {
    return this.path;
  }

  getCurrentChar(position: Position): string {
    return this.map[position.row]?.[position.col];
  }

  getNextChar(
    current: Position,
    direction: Position
  ): { nextRow: number; nextCol: number; nextChar: string } {
    const nextRow = current.row + direction.row;
    const nextCol = current.col + direction.col;

    // ETTSTSTSTSTTSTSTS ????????????????????????
    if (this.map?.length <= nextRow || this.map[nextRow]?.length <= nextCol)
      return { nextRow: -1, nextCol: -1, nextChar: " " };

    const nextChar = this.getCurrentChar({ row: nextRow, col: nextCol });
    return { nextRow, nextCol, nextChar };
  }

  findStart(): Position {
    let startCount = 0;
    let startPos: Position | null = null;
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {
        if (this.getCurrentChar({ row, col }) === "@") {
          startCount++;
          startPos = { row, col };
        }
      }
    }
    if (startCount === 0 || !startPos)
      throw new Error("Start position '@' missing");
    if (startCount > 1) throw new Error("Multiple start positions '@'");
    return startPos;
  }

  findEnd(): boolean {
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {
        if (this.getCurrentChar({ row, col }) === "x") {
          return true;
        }
      }
    }
    throw new Error("End position 'x' not found");
  }

  findStartingDirection(start: Position): Direction {
    const directions = getValidDirections();

    let validDirection: Direction;
    let directionCount = 0;

    for (const direction of directions) {
      const { nextChar } = this.getNextChar(start, direction);
      if (nextChar && nextChar !== " ") {
        validDirection = direction;
        directionCount++;
      }
    }

    if (directionCount !== 1) {
      throw new Error(
        "Invalid map: There should be exactly one starting direction."
      );
    }

    return validDirection!;
  }

  changeDirectionOnLetter(current: Position, direction: Direction): boolean {
    const { nextRow, nextCol, nextChar } = this.getNextChar(current, direction);

    if (!isLetter(nextChar)) return false;

    const { nextChar: nextNextChar } = this.getNextChar(
      { row: nextRow, col: nextCol },
      direction
    );
    if (!nextNextChar || nextNextChar === " ") return true;

    return false;
  }

  newDirectionOnIntersection(
    nextRow: number,
    nextCol: number,
    direction: Direction
  ): Direction {
    let newDirection = direction;
    if (direction.row === 0) {
      // Moving horizontally
      if (
        ["|", "+"].includes(this.map[nextRow - 1]?.[nextCol]) ||
        isLetter(this.map[nextRow - 1]?.[nextCol])
      ) {
        newDirection = { row: -1, col: 0 }; // Move up
      } else if (
        ["|", "+"].includes(this.map[nextRow + 1]?.[nextCol]) ||
        isLetter(this.map[nextRow + 1]?.[nextCol])
      ) {
        newDirection = { row: 1, col: 0 }; // Move down
      } else if (this.map[nextRow - 1]?.[nextCol] === "-") {
        newDirection = { row: -2, col: 0 }; // Move up two rows
      } else if (this.map[nextRow + 1]?.[nextCol] === "-") {
        newDirection = { row: 2, col: 0 }; // Move down two rows
      } else {
        throw new Error(
          "Invalid map: No valid horizontal direction found - fake turn"
        );
      }
    } else {
      // Moving vertically
      if (
        ["-", "+"].includes(this.map[nextRow][nextCol - 1]) ||
        isLetter(this.map[nextRow][nextCol - 1])
      ) {
        newDirection = { row: 0, col: -1 }; // Move left
      } else if (
        ["-", "+"].includes(this.map[nextRow][nextCol + 1]) ||
        isLetter(this.map[nextRow][nextCol + 1])
      ) {
        newDirection = { row: 0, col: 1 }; // Move right
      } else if (this.map[nextRow][nextCol - 1] === "|") {
        newDirection = { row: 0, col: -2 }; // Move left two columns
      } else if (this.map[nextRow][nextCol + 1] === "|") {
        newDirection = { row: 0, col: 2 }; // Move right two columns
      } else {
        throw new Error(
          "Invalid map: No valid vertical direction found - fake turn"
        );
      }
    }

    return newDirection;
  }

  isDirectionFromWhichWeAreComing(
    dir: Direction,
    direction: Direction
  ): boolean {
    return dir.row === -direction.row && dir.col === -direction.col;
  }

  isValidPathAfterIntersection(nextChar: string, dir: Direction): boolean {
    if (nextChar && nextChar !== " " && isPath(nextChar)) {
      if (dir.row === 0 && nextChar === "|") return false;
      if (dir.col === 0 && nextChar === "-") return false;
      return true;
    }
    return false;
  }

  checkValidWaysOnIntersection(current: Position, direction: Direction): void {
    const currentChar = this.getCurrentChar(current);
    if (!isIntersection(currentChar)) return;

    const directions = getValidDirections();

    let validWays = 0;

    for (const dir of directions) {
      if (this.isDirectionFromWhichWeAreComing(dir, direction)) continue;

      const { nextChar } = this.getNextChar(current, dir);
      if (this.isValidPathAfterIntersection(nextChar, dir)) validWays++;
    }

    if (validWays === 0) {
      throw new Error("Invalid map: No valid ways to move after intersection");
    }
    if (validWays > 1) {
      throw new Error(
        "Invalid map: Multiple valid ways to move after intersection"
      );
    }
  }

  collectLettersAndPath(): void {
    const start = this.findStart();
    this.findEnd(); // Ensure there's an end position

    let current = start!;
    let direction = this.findStartingDirection(current);
    this.visited.add(`${current.row},${current.col}`);

    while (true) {
      let changeDirection = false;
      const { nextRow, nextCol, nextChar } = this.getNextChar(
        current,
        direction
      );
      this.path += nextChar;

      if (isEnd(nextChar)) break;

      if (!isPath(nextChar)) throw new Error("Broken path or invalid map");

      this.checkValidWaysOnIntersection(
        { row: nextRow, col: nextCol },
        direction
      );

      if (!this.visited.has(`${nextRow},${nextCol}`)) {
        if (isLetter(nextChar)) {
          this.letters += nextChar;
          changeDirection = this.changeDirectionOnLetter(current, direction);
        }
        this.visited.add(`${nextRow},${nextCol}`);
      }

      if (isIntersection(nextChar) || changeDirection) {
        direction = this.newDirectionOnIntersection(
          nextRow,
          nextCol,
          direction
        );
      }

      current = { row: nextRow, col: nextCol };
    }
  }
}
