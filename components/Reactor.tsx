import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

interface ReactorTaskProps {
  onWin: () => void;
}

const MAX_WRONG_ATTEMPTS = 3;

const ReactorTask: React.FC<ReactorTaskProps> = ({ onWin }) => {
  const [round, setRound] = useState<number>(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false);
  const [highlightedButton, setHighlightedButton] = useState<number | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [isWaitingForNextRound, setIsWaitingForNextRound] = useState<boolean>(false);

  useEffect(() => {
    if (!isWaitingForNextRound) {
      generateSequence();
    }
  }, [round, isWaitingForNextRound]);

  const generateSequence = () => {
    const newSequence = Array.from(
      { length: round + 2 },
      () => Math.floor(Math.random() * 9)
    );
    setSequence(newSequence);
    setPlayerSequence([]);
    setIsPlayerTurn(false);
    setWrongAttempts(0);

    let index = 0;
    const interval = setInterval(() => {
      if (index < newSequence.length) {
        setHighlightedButton(newSequence[index]);
        setTimeout(() => setHighlightedButton(null), 400);
        index++;
      } else {
        clearInterval(interval);
        setIsPlayerTurn(true);
      }
    }, 800);
  };

  const handlePress = (buttonIndex: number) => {
    if (!isPlayerTurn) return;

    const updatedPlayerSequence = [...playerSequence, buttonIndex];
    setPlayerSequence(updatedPlayerSequence);

    if (sequence[updatedPlayerSequence.length - 1] !== buttonIndex) {
      setWrongAttempts((prev) => prev + 1);
      flashButton(buttonIndex, "red");

      if (wrongAttempts + 1 >= MAX_WRONG_ATTEMPTS) {
        Alert.alert(
          "Too Many Mistakes!",
          "You have exceeded the maximum wrong attempts. Restarting the round.",
          [{ text: "OK", onPress: restartRound }]
        );
      }
      return;
    }

    flashButton(buttonIndex, "green");

    if (updatedPlayerSequence.length === sequence.length) {
      if (round === 3) {
        Alert.alert("Success!", "You completed all rounds!", [{ text: "OK", onPress: onWin }]);
      } else {
        setIsWaitingForNextRound(true);
        Alert.alert(
          "Great!",
          `Round ${round} complete!`,
          [{ text: "OK", onPress: proceedToNextRound }]
        );
      }
    }
  };

  const restartRound = () => {
    setPlayerSequence([]);
    setWrongAttempts(0);
    setIsPlayerTurn(false);
    generateSequence();
  };

  const proceedToNextRound = () => {
    setIsWaitingForNextRound(false);
    setRound(round + 1);
  };

  const flashButton = (buttonIndex: number, color: string) => {
    setHighlightedButton(buttonIndex);
    setTimeout(() => setHighlightedButton(null), 400);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.roundText}>Round {round} of 3</Text>
      <View style={styles.grid}>
        {Array.from({ length: 9 }, (_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              highlightedButton === index ? { backgroundColor: "yellow" } : null,
              highlightedButton === index && wrongAttempts ? { backgroundColor: "red" } : null,
              highlightedButton === index && !wrongAttempts ? { backgroundColor: "green" } : null,
            ]}
            onPress={() => handlePress(index)}
          >
            <Text style={styles.buttonText}>{index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {!isPlayerTurn && <Text style={styles.instructions}>Watch the sequence!</Text>}
      {isPlayerTurn && (
        <Text style={styles.instructions}>
          Your turn! Tap the buttons in order. Attempts left: {MAX_WRONG_ATTEMPTS - wrongAttempts}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  roundText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 300,
    height: 300,
  },
  button: {
    width: 90,
    height: 90,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  instructions: {
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export default ReactorTask;
