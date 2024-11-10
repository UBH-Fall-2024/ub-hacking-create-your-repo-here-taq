import { SafeAreaView, StyleSheet, Text, View, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from "../config/Colors";
import React from "react";

const UserOut = ({ queueLength, estimatedTime }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.header}>{`There ${
            queueLength - 1 == 1 ? "is" : "are"
          } ${queueLength - 1} ${
            queueLength - 1 == 1 ? "person" : "people"
          } ahead of you`}</Text>
          <Text
            style={styles.description}
          >{`Estimated wait time: ${estimatedTime} minutes`}</Text>
        </View>
        <Pressable style={styles.button}>
            <Ionicons name="enter-outline" size={24} color="white" />
          <Text style={{ fontWeight: "600", fontSize: 15, color: "white" }}>
            Enter the Queue
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default UserOut;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Make SafeAreaView take the full screen height
    backgroundColor: Colors.Background,
    paddingHorizontal: 0, // Ensure no horizontal padding
    paddingVertical: 0, // Ensure no vertical padding
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 50,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.Background,
  },
  textContainer: {
    gap: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.Primary,
  },
  description: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "white",
  },
  button: {
    flexDirection: "row",
    backgroundColor: Colors.Blue,
    gap: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
