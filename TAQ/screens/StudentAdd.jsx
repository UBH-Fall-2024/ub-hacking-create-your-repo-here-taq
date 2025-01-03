import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "../config/Colors";
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

const StudentAdd = ({ route }) => {
  const [queueLength, setQueueLength] = useState(0);
  const [inQueue, setInQueue] = useState(false);
  const [queueID, setQueueID] = useState(null);
  const [question, setQuestion] = useState("");
  const [tag, setTag] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabaseRef = React.useRef(null);

  console.log(route.params);

  useEffect(() => {
    const getQueueIDAndLength = async () => {
      try {
        // Get the queueID based on location and classID
        let { data: queueID, error: queueIDError } = await supabase
          .from("queues")
          .select("id")
          .eq("location", route.params.location)
          .eq("class", route.params.classID);

        if (queueIDError) {
          console.error("Error fetching queueID:", queueIDError);
          Alert.alert("Error", queueIDError.message);
          return;
        }

        if (queueID.length === 0) {
          console.log("No queue available for this location");
          setQueueID(null);
          return;
        }

        console.log("Fetched queueID:", queueID[0].id);
        setQueueID(queueID[0].id);

        // Get the queue length
        let { data: queueEntries, error: queueLengthError } = await supabase
          .from("queue_entries")
          .select("*")
          .eq("queue", queueID[0].id)
          .neq("student", route.params.userId)
          .lt("created_at", new Date().toISOString());

        if (queueLengthError) {
          console.error("Error fetching queueLength:", queueLengthError);
          Alert.alert("Error", queueLengthError.message);
          return;
        }

        console.log("Fetched queueLength:", queueEntries.length);
        setQueueLength(queueEntries.length);
      } catch (error) {
        console.error("Error in getQueueIDAndLength:", error);
        Alert.alert("Error", error.message);
      }
    };

    getQueueIDAndLength().finally(() => setLoading(false));

    const sub = supabase
      .channel("queue_entries")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "queue_entries",
        },
        (payload) => {
          switch (payload.type) {
            case "INSERT":
              setQueueLength((prev) => prev + 1);
              break;
            case "DELETE":
              // Check if the student is in the queue
              setQueueLength((prev) => prev - 1);
              break;
            default:
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, [supabaseRef.current]);

  const handleOnPress = () => {
    if (inQueue) {
      // Leave the queue
      Alert.alert(
        "Leave the Queue",
        "Are you sure you want to leave the queue?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Leave",
            onPress: async () => {
              try {
                let { error } = await supabase
                  .from("queue_entries")
                  .delete()
                  .eq("queue", queueID)
                  .eq("student", route.params.userId);

                if (error) {
                  console.error("Error leaving the queue:", error);
                  Alert.alert("Error", error.message);
                  return;
                }

                console.log("Successfully left the queue");
                setInQueue(false);
                setQueueLength(queueLength - 1);
              } catch (error) {
                console.error("Error in handleOnPress:", error);
                Alert.alert("Error", error.message);
              }
            },
          },
        ]
      );
    } else {
      // Join the queue
      Alert.alert(
        "Join the Queue",
        "Are you sure you want to join the queue?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Join",
            onPress: async () => {
              try {
                let { error } = await supabase.from("queue_entries").insert([
                  {
                    queue: queueID,
                    student: route.params.userId,
                    location: route.params.location,
                    question: question,
                    tag: tag,
                  },
                ]);

                if (error) {
                  console.error("Error joining the queue:", error);
                  Alert.alert("Error", error.message);
                  setModalVisible(false);
                  return;
                }

                console.log("Successfully joined the queue");
                setInQueue(true);
                setQueueLength(queueLength + 1);
                setModalVisible(false);
              } catch (error) {
                console.error("Error in handleOnPress:", error);
                Alert.alert("Error", error.message);
                setModalVisible(false);
              }
            },
          },
        ]
      );
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors.Background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    );
  }

  // Fallback if theres no TA queue available at the moment
  if (queueID == null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { padding: 10 }]}>
          <Text style={styles.header}>No Queue Available</Text>
          <Text style={styles.description}>
            There is currently no queue available for this location.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (inQueue && queueLength === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { padding: 10 }]}>
          <Text style={styles.header}>You are in the queue</Text>
          <Text style={styles.description}>
            You are currently the first person in the queue.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.header}>{`There ${
            queueLength == 1 ? "is" : "are"
          } ${queueLength} ${
            queueLength == 1 ? "person" : "people"
          } in the queue`}</Text>
          <Text style={styles.description}>{`Estimated wait time: ${
            15 * queueLength
          } minutes`}</Text>
        </View>
        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: inQueue ? "red" : Colors.Blue,
            },
          ]}
          onPress={() => {
            if (!inQueue) {
              setModalVisible(true);
            } else {
              handleOnPress();
            }
          }}
        >
          <MaterialIcons
            name="exit-to-app"
            size={24}
            color={inQueue ? "white" : Colors.Background}
          />
          <Text
            style={{
              fontWeight: "600",
              fontSize: 15,
              color: inQueue ? "white" : Colors.Background,
            }}
          >
            {inQueue ? "Leave the Queue" : "Join the Queue"}
          </Text>
        </Pressable>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                padding: 10,
              }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <MaterialIcons name="close" size={24} color={Colors.Red} />
            </Pressable>
            <TextInput
              value={tag}
              placeholder="Tag"
              placeholderTextColor={Colors.Secondary}
              style={styles.input}
              onChangeText={setTag}
            />
            <TextInput
              value={question}
              placeholderTextColor={Colors.Secondary}
              placeholder="Question"
              style={styles.input}
              onChangeText={setQuestion}
            />
            <Pressable
              onPress={() => {
                if (question.length === 0 || tag.length === 0) {
                  Alert.alert("Error", "Please fill out all fields");
                  return;
                }

                handleOnPress();
              }}
              style={{
                backgroundColor: Colors.Tertiary,
                borderWidth: 1,
                borderColor: Colors.Green,
                padding: 15,
                borderRadius: 10,
                width: "80%",
                margin: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default StudentAdd;

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
    gap: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    gap: 10,
    backgroundColor: Colors.Background,
    borderWidth: 1,
    borderColor: Colors.Secondary,
    borderRadius: 25,
    borderRadius: 20,
    width: "90%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    backgroundColor: Colors.Primary,
    padding: 15,
    borderRadius: 10,
    width: "80%",
    margin: 10,
  },
});
