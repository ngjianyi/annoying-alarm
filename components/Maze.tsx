import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

class Cell {
  row: number;
  col: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  visited: boolean;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
    this.visited = false;
  }
}

const generateMaze = (rows: number, cols: number) => {
  const grid: Cell[][] = Array(rows)
    .fill(null)
    .map((_, row) =>
      Array(cols)
        .fill(null)
        .map((_, col) => new Cell(row, col))
    );

  const stack: Cell[] = [];
  const startCell = grid[0][0];
  startCell.visited = true;
  stack.push(startCell);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current, grid, rows, cols);

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      removeWalls(current, next);
      next.visited = true;
      stack.push(next);
    }
  }

  return grid;
};

const getUnvisitedNeighbors = (
  cell: Cell,
  grid: Cell[][],
  rows: number,
  cols: number
) => {
  const neighbors: Cell[] = [];
  const { row, col } = cell;

  const directions = [
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
  ];

  directions.forEach((dir) => {
    const newRow = row + dir.row;
    const newCol = col + dir.col;

    if (
      newRow >= 0 &&
      newRow < rows &&
      newCol >= 0 &&
      newCol < cols &&
      !grid[newRow][newCol].visited
    ) {
      neighbors.push(grid[newRow][newCol]);
    }
  });

  return neighbors;
};

const removeWalls = (current: Cell, next: Cell) => {
  const rowDiff = next.row - current.row;
  const colDiff = next.col - current.col;

  if (colDiff === 1) {
    current.walls.right = false;
    next.walls.left = false;
  } else if (colDiff === -1) {
    current.walls.left = false;
    next.walls.right = false;
  } else if (rowDiff === 1) {
    current.walls.bottom = false;
    next.walls.top = false;
  } else if (rowDiff === -1) {
    current.walls.top = false;
    next.walls.bottom = false;
  }
};

interface MazeProps {
  cols: number;
  rows: number;
  onWin: () => void;
}

const Maze: React.FC<MazeProps> = ({ cols, rows, onWin }) => {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPosition, setPlayerPosition] = useState({ row: 0, col: 0 });
  const [mazeSolved, setMazeSolved] = useState(false);
  const [isMazeVisible, setIsMazeVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsMazeVisible((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMaze(generateMaze(rows, cols));
    setPlayerPosition({ row: 0, col: 0 });
    setMazeSolved(false);
  }, [rows, cols]);

  const movePlayer = (dRow: number, dCol: number) => {
    const newRow = playerPosition.row + dRow;
    const newCol = playerPosition.col + dCol;
    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      const currentCell = maze[playerPosition.row][playerPosition.col];
      if (
        (dRow === -1 && !currentCell.walls.top) ||
        (dRow === 1 && !currentCell.walls.bottom) ||
        (dCol === -1 && !currentCell.walls.left) ||
        (dCol === 1 && !currentCell.walls.right)
      ) {
        setPlayerPosition({ row: newRow, col: newCol });

        if (newRow === rows - 1 && newCol === cols - 1) {
          setMazeSolved(true);
          onWin();
        }
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.maze}>
        {maze.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  {
                    borderTopWidth: cell.walls.top ? 2 : 0,
                    borderRightWidth: cell.walls.right ? 2 : 0,
                    borderBottomWidth: cell.walls.bottom ? 2 : 0,
                    borderLeftWidth: cell.walls.left ? 2 : 0,
                    borderColor: isMazeVisible ? "black" : "transparent",
                    backgroundColor:
                      rowIndex === playerPosition.row &&
                      colIndex === playerPosition.col
                        ? "#4CAF50"
                        : rowIndex === rows - 1 && colIndex === cols - 1
                        ? "#f44336"
                        : "white",
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      {mazeSolved ? (
        <TouchableOpacity style={styles.button} onPress={onWin}>
          <Text style={styles.buttonText}>Stop Alarm</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => movePlayer(-1, 0)}
          >
            <AntDesign name="caretup" size={40} color="blue" />
          </TouchableOpacity>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => movePlayer(0, -1)}
            >
              <AntDesign name="caretleft" size={40} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => movePlayer(0, 1)}
            >
              <AntDesign name="caretright" size={40} color="blue" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => movePlayer(1, 0)}
          >
            <AntDesign name="caretdown" size={40} color="blue" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  maze: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "black",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 30,
    height: 30,
    borderColor: "black",
  },
  buttons: {
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default Maze;
