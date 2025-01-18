import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";
import Maze from "@/components/Maze";

const App: React.FC = () => {
  const [alarmSet, setAlarmSet] = useState<boolean>(false);
  const [isMazeVisible, setMazeVisible] = useState<boolean>(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [alarmTime, setAlarmTime] = useState<string>("10");
  const loadAlarmSound = async (): Promise<void> => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/audio/alarm.mp3")
    );
    setSound(sound);
  };

  const scheduleAlarm = async (): Promise<void> => {
    const delay = parseInt(alarmTime, 10);

    if (isNaN(delay) || delay <= 0) {
      Alert.alert("Invalid Time", "Please enter a valid number of seconds.");
      return;
    }

    setAlarmSet(true);
    setTimeout(() => {
      // loadAlarmSound();
      sound?.playAsync();
      setMazeVisible(true);
    }, delay * 1000);
  };

  const stopAlarm = (): void => {
    sound?.stopAsync();
    setMazeVisible(false);
    setAlarmSet(false);
    Alert.alert("Great Job!", "You solved the maze and turned off the alarm.");
  };

  return (
    <View style={styles.container}>
      {isMazeVisible ? (
        <View>
          <Text style={styles.alarmText}>
            Solve the maze to stop the alarm!
          </Text>
          <Maze cols={10} rows={10} onWin={stopAlarm} />
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            value={alarmTime}
            onChangeText={setAlarmTime}
            keyboardType="numeric"
            placeholder="Enter alarm time (seconds)"
          />
          <Button
            title={alarmSet ? "Alarm is Set" : "Set Alarm"}
            onPress={scheduleAlarm}
            disabled={alarmSet}
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
