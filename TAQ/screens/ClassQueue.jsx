import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  StatusBar,
} from "react-native";
import React from "react";
import QueueEntry from "../components/QueueEntry";
import { Colors } from "../config/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

const ClassQueue = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.safeArea}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={"transparent"}
        translucent
      />
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Class Queue</Text>
        <View style={styles.queueContainer}>
          <QueueEntry
            UBIT={"Manav"}
            Topic={"PA2"}
            Question={"How do I append in a list without making a list?"}
          />
          <QueueEntry
            UBIT={"Thirumal"}
            Topic={"WA4"}
            Question={"How do I append in a list without making a list?"}
          />
          <QueueEntry
            UBIT={"Amit"}
            Topic={"Worksheet"}
            Question={
              "How do I append in a list without making a list? How do I reproduce?"
            }
          />
          <QueueEntry
            UBIT={"Thirumal"}
            Topic={"WA4"}
            Question={"How do I append in a list without making a list?"}
          />
          <QueueEntry
            UBIT={"Thirumal"}
            Topic={"WA4"}
            Question={"How do I append in a list without making a list?"}
          />
          <QueueEntry
            UBIT={"Thirumal"}
            Topic={"WA4"}
            Question={"How do I append in a list without making a list?"}
          />
          <QueueEntry
            UBIT={"Thirumal"}
            Topic={"WA4"}
            Question={"How do I append in a list without making a list?"}
          />
          <QueueEntry
            UBIT={"Thirumal"}
            Topic={"WA4"}
            Question={"How do I append in a list without making a list?"}
          />
          <QueueEntry
            UBIT={"Thirumal"}
            Topic={"WA4"}
            Question={"How do I append in a list without making a list?"}
          />
          <QueueEntry
            UBIT={"Thirumal"}
            Topic={"WA4"}
            Question={"How do I append in a list without making a list?"}
          />
          <QueueEntry
            UBIT={"Thirumal"}
            Topic={"WA4"}
            Question={"How do I append in a list without making a list?"}
          />
          <QueueEntry
            UBIT={"Thirumal"}
            Topic={"WA4"}
            Question={"How do I append in a list without making a list?"}
          />
          <QueueEntry
            UBIT={"Thirumal"}
            Topic={"WA4"}
            Question={"How do I append in a list without making a list?"}
          />
          <QueueEntry
            UBIT={"Thirumal"}
            Topic={"WA4"}
            Question={"How do I append in a list without making a list?"}
          />
          <QueueEntry
            UBIT={"Thirumal"}
            Topic={"WA4"}
            Question={
              "How do I append in a list without making a list?How do I append in a list without making a list?How do I append in a list without making a list?"
            }
          />
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
      <Pressable
        style={styles.addButton}
        onPress={() => {
          /* Add functionality to add a person to the queue */
        }}
      >
        <MaterialIcons
          name="add-circle-outline"
          size={24}
          color={Colors.Background}
        />
        <Text style={styles.addButtonText}>Add in Queue</Text>
      </Pressable>
    </View>
    </SafeAreaView>
  );
};

export default ClassQueue;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.Background,
    paddingTop: 40,
  },
  container: {
    padding: 10,
    textAlign: "center",
    flex: 1, // Ensures main content takes available space
  },
  header: {
    fontSize: 30,
    color: Colors.Primary,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  queueContainer: {
    padding: 10,
    gap: 20,
    borderColor: Colors.Primary,
    marginBottom: 20,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: Colors.Blue,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    position: "absolute",
    bottom: 50, // Adds some spacing from the bottom of the screen
    alignSelf: "center",
    width: "90%",
  },
  addButtonText: {
    color: Colors.Background,
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 100, // Adjust height based on the space you want between the last item and the button
  },
});
