import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Audio } from "expo-av";
import Maze from "@/components/Maze";


const App: React.FC = () => {
 const [alarmSet, setAlarmSet] = useState<boolean>(false);
 const [isMazeVisible, setMazeVisible] = useState<boolean>(false);
 const [sound, setSound] = useState<Audio.Sound | null>(null);
 const [selectedTime, setSelectedTime] = useState<Date>(new Date());
 const [showPicker, setShowPicker] = useState<boolean>(true); // Picker is shown initially


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
     interval = (setInterval as unknown as (handler: () => void, timeout: number) => number)(() => {
       const currentTime = new Date();
       if (
         currentTime.getHours() === selectedTime.getHours() &&
         currentTime.getMinutes() === selectedTime.getMinutes()
       ) {
         if (sound) {
           sound.playAsync();
         }
         setMazeVisible(true);
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
   setShowPicker(false);  // Hide the picker after the alarm is set
   Alert.alert(
     "Alarm Set",
     `The alarm is set for ${selectedTime.toLocaleTimeString([], {
       hour: "2-digit",
       minute: "2-digit",
     })}.`
   );
 };


 const stopAlarm = async (): Promise<void> => {
   if (sound) {
     await sound.stopAsync();
   }
   setMazeVisible(false);
   Alert.alert("Great Job!", "You solved the maze and turned off the alarm. Are you wide awake now :)");
 };


 const handleTimeChange = (event: any, selectedDate?: Date) => {
   if (selectedDate) {
     setSelectedTime(selectedDate);
   }
 };


 return (
   <View style={styles.container}>
     {/* Header */}
     <View style={styles.header}>
       <Text style={styles.headerText}>AA</Text>
     </View>


     {isMazeVisible ? (
       <View>
         <Text style={styles.alarmText}>
           Solve the maze to stop the alarm!
         </Text>
         <Maze cols={10} rows={10} onWin={stopAlarm} />
       </View>
     ) : (
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
   backgroundColor: "#121212", // Dark mode background
 },
 header: {
   width: "100%",
   padding: 20,
   backgroundColor: "#333", // Dark header
   alignItems: "center",
   justifyContent: "center",
 },
 headerText: {
   fontSize: 32,
   fontWeight: "bold",
   color: "#fff", // White text for contrast
 },
 innerContainer: {
   justifyContent: "center",
   alignItems: "center", // Center everything horizontally
   width: "100%", // Ensure the container takes full width
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
   textAlign: "center",  // Center the time horizontally
   marginBottom: 20, // Add margin to give space between text and the button
   color: "#fff", // White text
 },
});


export default App;



