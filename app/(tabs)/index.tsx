import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Audio } from "expo-av";
import Maze from "@/components/Maze";
import ReactorTask from "@/components/Reactor";
import Sudoku from "@/components/Sudoku";

const App: React.FC = () => {
  const [alarmSet, setAlarmSet] = useState<boolean>(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState<boolean>(true);
  const [task, setTask] = useState<"maze" | "reactor" | "sudoku" | null>(null);

  useEffect(() => {
    const loadAlarmSound = async (): Promise<void> => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/audio/alarm.mp3")
      );
      setSound(sound);
    };

    loadAlarmSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    let interval: number;

    if (alarmSet) {
      interval = (
        setInterval as unknown as (
          handler: () => void,
          timeout: number
        ) => number
      )(() => {
        const currentTime = new Date();
        if (
          currentTime.getHours() === selectedTime.getHours() &&
          currentTime.getMinutes() === selectedTime.getMinutes()
        ) {
          if (sound) {
            sound.playAsync();
          }
          const tasks: ("maze" | "reactor" | "sudoku")[] = [
            "maze",
            "reactor",
            "sudoku",
          ];
          const randomTaskIndex = Math.floor(Math.random() * tasks.length);
          setTask(tasks[randomTaskIndex]);
          setAlarmSet(false);
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [alarmSet, selectedTime, sound]);

  const scheduleAlarm = (): void => {
    setAlarmSet(true);
    setShowPicker(false);
    Alert.alert(
      "Alarm Set",
      `The alarm is set for ${selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}.`
    );
  };

  const stopAlarm = (): void => {
    sound?.stopAsync();
    setTask(null);
    Alert.alert(
      "Great Job!",
      "You completed the task and turned off the alarm."
    );
    setShowPicker(true);
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      {task === "maze" && (
        <View>
          <Text style={styles.alarmText}>
            Solve the maze to stop the alarm!
          </Text>
          <Maze cols={10} rows={10} onWin={stopAlarm} />
        </View>
      )}
      {task === "reactor" && (
        <View>
          <Text style={styles.alarmText}>
            Complete the memory game to stop the alarm!
          </Text>
          <ReactorTask onWin={stopAlarm} />
        </View>
      )}
      {task === "sudoku" && (
        <View>
          <Text style={styles.alarmText}>
            Complete the memory game to stop the alarm!
          </Text>
          <Sudoku onWin={stopAlarm} />
        </View>
      )}
      {!task && (
        <View style={styles.innerContainer}>
          {/* Only show the DateTimePicker if the picker is not hidden */}
          {showPicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleTimeChange}
            />
          )}
          <Text style={styles.selectedTimeText}>
            Selected Time:{" "}
            {selectedTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
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
    backgroundColor: "#fff",
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  alarmText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
    color: "red",
  },
  selectedTimeText: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
});

export default App;
