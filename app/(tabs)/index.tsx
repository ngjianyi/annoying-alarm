import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";

const App: React.FC = () => {
  const [isAlarmSet, setIsAlarmSet] = useState<boolean>(false);
  const [isMazeVisible, setMazeVisible] = useState<boolean>(false);
  const [alarmTime, setAlarmTime] = useState<string>("10");

  const scheduleAlarm = async (): Promise<void> => {
    const delay = parseInt(alarmTime, 10);

    if (isNaN(delay) || delay <= 0) {
      Alert.alert("Invalid Time", "Please enter a valid number of seconds.");
      return;
    }

    setIsAlarmSet(true);
    setTimeout(() => {
      setMazeVisible(true);
    }, delay * 1000);
  };

  return (
    <View style={styles.container}>
      {isMazeVisible ? (
        <View>
          <Text style={styles.alarmText}>
            Solve the maze to stop the alarm!
          </Text>
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            value={alarmTime}
            onChangeText={setAlarmTime}
            keyboardType="numeric"
            placeholder="Enter alarm time in seconds"
          />
          <Button
            title={isAlarmSet ? "Alarm is Set" : "Set Alarm"}
            onPress={scheduleAlarm}
            disabled={isAlarmSet}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  alarmText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
    color: "red",
  },
  input: {
    width: 200,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
  },
});

export default App;
