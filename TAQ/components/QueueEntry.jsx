import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "../config/Colors";

const QueueEntry = ({ UBIT, Topic, Question, onRemove }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Function to handle removal action
  const handleRemove = () => {
    onRemove(); // Call the parent function to remove the entry (or any other logic)
    setModalVisible(false); // Close the modal
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.nameContainer}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "600" }}>
            {UBIT}
          </Text>
          <Text style={styles.topic}>{Topic}</Text>
        </View>
        <View style={styles.question}>
          <Text style={{ color: "#bac2de", fontWeight: "semibold" }}>
            {Question}
          </Text>
        </View>
      </View>
      <View style={styles.icon}>
        <Pressable onPress={() => setModalVisible(true)}>
          <MaterialIcons name="highlight-remove" size={30} color="#EF4444" />
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalText}>
                  Are you sure you want to remove this student from the queue?
                </Text>
                <View style={styles.modalButtons}>
                  <Pressable
                    style={styles.modalButtonCancel}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={styles.modalButtonRemove}
                    onPress={handleRemove}
                  >
                    <Text style={styles.modalButtonTextRemove}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default QueueEntry;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // borderWidth: 1,
    borderRadius: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    // borderColor: "white",
    backgroundColor: Colors.Tertiary,
  },
  textContainer: {
    gap: 5,
  },
  nameContainer: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    fontWeight: "bold",
    backgroundColor: "",
  },
  topic: {
    color: "rgb(94, 234, 212)",
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "rgba(96, 165, 139, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  question: {
    marginTop: 5,
    maxWidth: 250,
    minHeight: 40,
  },
  icon: {
    alignSelf: "center",
  },
  // Modal styles
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Background overlay
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },
  modalButtonCancel: {
    backgroundColor: Colors.Blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonTextCancel: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalButtonRemove: {
    backgroundColor: Colors.Red,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonTextRemove: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
