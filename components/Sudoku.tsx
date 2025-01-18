import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";

const baseGrid = [
  [1, 2, 3, 4],
  [3, 4, 1, 2],
  [2, 3, 4, 1],
  [4, 1, 2, 3],
];

const transposeMatrix = (grid: number[][]): number[][] => {
  const gridCopy = grid.map((row) => [...row]);
  return gridCopy[0].map((_, i) => gridCopy.map((row) => row[i]));
};

const shuffleRowsAndColumns = (grid: number[][]): number[][] => {
  const gridCopy = grid.map((row) => [...row]);

  // Shuffle rows within each subgrid
  for (let i = 0; i < 4; i += 2) {
    if (Math.random() > 0.5) {
      [gridCopy[i], gridCopy[i + 1]] = [gridCopy[i + 1], gridCopy[i]];
    }
  }

  let transposedGrid = transposeMatrix(gridCopy);

  // Shuffle columns within each subgrid
  for (let i = 0; i < 4; i += 2) {
    if (Math.random() > 0.5) {
      [transposedGrid[i], transposedGrid[i + 1]] = [
        transposedGrid[i + 1],
        transposedGrid[i],
      ];
    }
  }

  return transposeMatrix(transposedGrid);
};

const shuffleNumbers = (grid: number[][]): number[][] => {
  const numbers: number[] = [1, 2, 3, 4];
  const shuffledNumbers: number[] = [...numbers].sort(
    () => Math.random() - 0.5
  );
  const mapping: Record<number, number> = numbers.reduce((acc, num, i) => {
    acc[num] = shuffledNumbers[i];
    return acc;
  }, {} as Record<number, number>);

  return grid.map((row) => row.map((num) => mapping[num]));
};

const removeNumbers = (grid: number[][], cellsToRemove: number): number[][] => {
  const gridCopy = grid.map((row) => [...row]);
  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 4);
    const col = Math.floor(Math.random() * 4);
    if (gridCopy[row][col] !== 0) {
      gridCopy[row][col] = 0;
      cellsToRemove--;
    }
  }
  return gridCopy;
};

interface SudokuProps {
  onWin: () => void;
}

const Sudoku: React.FC<SudokuProps> = ({ onWin }) => {
  const [solution, setSolution] = useState<number[][]>([]);
  const [puzzle, setPuzzle] = useState<number[][]>([]);
  const [userInput, setUserInput] = useState<number[][]>([]);

  useEffect(() => {
    generateNewPuzzle();
  }, []);

  const generateNewPuzzle = () => {
    const shuffledGrid = shuffleRowsAndColumns(baseGrid);
    const finalGrid = shuffleNumbers(shuffledGrid);
    setSolution(finalGrid);

    const unsolvedPuzzle = removeNumbers(finalGrid, 8);
    setPuzzle(unsolvedPuzzle);

    setUserInput(
      unsolvedPuzzle.map((row: number[]) => row.map((cell: number) => cell))
    );
  };

  const handleCellPress = (row: number, col: number): void => {
    const newUserInput = userInput.map((r) => [...r]);
    if (userInput[row][col] === 4) {
      newUserInput[row][col] = 0;
    } else {
      newUserInput[row][col] += 1;
    }
    setUserInput(newUserInput);

    const isUserInputCorrect = newUserInput.every((row, i) =>
      row.every((cell, j) => {
        const userValue = cell || 0;
        return puzzle[i][j] !== 0 || userValue === solution[i][j];
      })
    );

    if (isUserInputCorrect) {
      onWin();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {puzzle.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  cell !== 0 ? styles.prefilledCell : styles.inputCell,
                  colIndex === 1 && styles.thickRightBorder,
                  rowIndex === 1 && styles.thickBottomBorder,
                ]}
              >
                {cell !== 0 ? (
                  <Text style={styles.prefilledNumber}>{cell}</Text>
                ) : (
                  <Pressable
                    onPress={() => {
                      handleCellPress(rowIndex, colIndex);
                    }}
                    style={styles.pressable}
                  >
                    <Text style={styles.pressableText}>
                      {userInput[rowIndex][colIndex] === 0
                        ? ""
                        : userInput[rowIndex][colIndex].toString()}
                    </Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={generateNewPuzzle}>
        <Text style={styles.buttonText}>New Puzzle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  grid: {
    borderWidth: 2,
    borderColor: "black",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 0.5,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  prefilledCell: {
    backgroundColor: "#E8E8E8",
  },
  inputCell: {
    backgroundColor: "white",
  },
  thickRightBorder: {
    borderRightWidth: 2,
  },
  thickBottomBorder: {
    borderBottomWidth: 2,
  },
  shadedCell: {
    backgroundColor: "#f0f0f0",
  },
  input: {
    width: 30,
    height: 30,
    textAlign: "center",
    fontSize: 20,
    color: "#2196F3",
  },
  prefilledNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666666",
  },
  pressable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  pressableText: {
    fontSize: 18,
    color: "#007BFF",
  },
  fixedNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default Sudoku;
