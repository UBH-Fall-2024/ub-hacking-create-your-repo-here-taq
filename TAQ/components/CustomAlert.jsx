import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Colors } from "../config/Colors";

const CustomAlert = ({
  visible,
  onClose,
  onConfirm,
  title = "Alert",
  message = "Are you sure?",
  confirmText = "Yes",
  cancelText = "Cancel",
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.messageText}>{message}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                onClose();
              }}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(17, 17, 27, 0.75)", // Background with opacity
  },
  modalView: {
    width: Dimensions.get("window").width * 0.85,
    backgroundColor: Colors.Tertiary,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: Colors.Background,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titleText: {
    color: Colors.Primary,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  messageText: {
    color: Colors.Secondary,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.Background,
    borderWidth: 1,
    borderColor: Colors.Secondary,
  },
  confirmButton: {
    backgroundColor: Colors.Red,
  },
  cancelButtonText: {
    color: Colors.Secondary,
    fontSize: 16,
    fontWeight: "500",
  },
  confirmButtonText: {
    color: Colors.Primary,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CustomAlert;
