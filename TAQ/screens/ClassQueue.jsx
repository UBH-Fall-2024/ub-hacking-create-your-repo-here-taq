import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  StatusBar,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import QueueEntry from "../components/QueueEntry";
import { Colors } from "../config/Colors";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../supabase";
import CustomAlert from "../components/CustomAlert";

const ClassQueue = ({ route }) => {
  const location = route.params.location;
  const classID = route.params.classID;
  const [entries, setEntries] = useState([]);
  const [queueID, setQueueID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Add code to fetch queueID
    const fetchQueueID = async () => {
      let { data: queueID, error } = await supabase
        .from("queues")
        .select("id")
        .eq("class", classID)
        .eq("location", location);

      if (error) {
        console.error("Error fetching queue ID:", error);
        Alert.alert("Error", error.message);
        return;
      }

      if (queueID.length === 0) {
        console.log("No queue available for this class");
        return;
      }

      setQueueID(queueID[0].id);
    };
    fetchQueueID().finally(() => {
      if (!queueID) {
        setLoading(false);
        return;
      }

      // Code to fetch queue entries
      const fetchQueueEntries = async () => {
        let { data: queueEntries, error } = await supabase
          .from("queue_entries")
          .select("*, student:users(*)")
          .eq("queue", queueID)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching queue entries:", error);
          Alert.alert("Error", error.message);
          return;
        }

        console.log("Fetched queue entries:", queueEntries);
        setEntries(queueEntries);
      };

      fetchQueueEntries().finally(() => setLoading(false));

      const sub = supabase
        .channel("queue_entries")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "queue_entries",
          },
          async (payload) => {
            console.log("Queue entry added:", payload);

            switch (payload.eventType) {
              case "INSERT":
                const { data: newEntry, error } = await supabase
                  .from("queue_entries")
                  .select("*, student:users(*)")
                  .eq("id", payload.new.id)
                  .single();

                if (error) {
                  console.error(
                    "Error fetching new entry with student data:",
                    error
                  );
                  Alert.alert("Error", error.message);
                  return;
                }

                setEntries((prevEntries) => [...prevEntries, newEntry]);
                break;
              case "UPDATE":
                setEntries((prevEntries) =>
                  prevEntries.map((entry) =>
                    entry.id === payload.new.id
                      ? { ...entry, ...payload.new }
                      : entry
                  )
                );
                break;
              case "DELETE":
                setEntries((prevEntries) =>
                  prevEntries.filter((entry) => entry.id !== payload.old.id)
                );
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
    });
  }, [classID, location]);

  // useEffect(() => {
  //   return () => {
  //     supabase.removeChannel(sub);
  //   };
  // }, [queueID]);

  const removeQueue = async () => {
    // Add functionality to remove the queue
    const { error } = await supabase.from("queues").delete().eq("id", queueID);

    if (error) {
      console.error("Error removing queue:", error);
      Alert.alert("Error", error.message);
      return;
    }

    setQueueID(null);
    setEntries([]);
    // Alert.alert("Success", "Queue has been removed successfully!");
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
        <ActivityIndicator size={"large"} color={Colors.Primary} />
      </View>
    );
  }

  // Handle case for the TA where they need to start the queue
  if (!queueID) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.header}>No Queue Available</Text>
          <Text
            style={{
              color: Colors.Primary,
              textAlign: "center",
              fontSize: 14,
              marginBottom: 20,
            }}
          >
            It looks like there is no queue available for this class yet. Please
            create one to get started!
          </Text>
          <Pressable
            style={styles.addButton}
            onPress={async () => {
              // Add functionality to create a new queue
              const { data, error } = await supabase
                .from("queues")
                .insert([
                  {
                    class: classID,
                    location: location,
                    active: true,
                    owner: (await supabase.auth.getUser()).data.user.id,
                  },
                ])
                .select();

              if (error) {
                console.error("Error creating queue:", error);
                Alert.alert("Error", error.message);
                return;
              }

              setQueueID(data[0].id);
              // Alert.alert("Success", "Queue has been created successfully!");
            }}
          >
            <MaterialIcons
              name="add-circle-outline"
              size={24}
              color={Colors.Background}
            />
            <Text style={styles.addButtonText}>Create Queue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.safeArea}>
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={"transparent"}
          translucent
        />
        <View style={styles.container}>
          <Text style={styles.header}>Class Queue</Text>
          <View style={styles.queueContainer}>
            {entries.length !== 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={entries}
                contentContainerStyle={{ gap: 20 }}
                renderItem={({ item, index }) => (
                  <QueueEntry
                    key={index}
                    UBIT={item.student.name}
                    Topic={item.tag}
                    Question={item.question}
                    onRemove={async () => {
                      /* Add functionality to remove a person from the queue */
                      const { error } = await supabase
                        .from("queue_entries")
                        .delete()
                        .eq("student", item.student.id)
                        .eq("queue", queueID);

                      if (error) {
                        console.error("Error removing queue entry:", error);
                        Alert.alert("Error", error.message);
                        return;
                      }

                      // Update the state to remove the entry
                      setEntries((prevEntries) =>
                        prevEntries.filter((entry) => entry.id !== item.id)
                      );
                    }}
                  />
                )}
              />
            ) : (
              <Text
                style={{
                  color: Colors.Primary,
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                No entries yet! Looks like everyone is too busy coding or maybe
                the TAs are on a coffee break. ☕️
              </Text>
            )}
            <View style={styles.bottomSpacer} />
          </View>
        </View>
        <Pressable
          style={styles.removeButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="remove-circle-outline" size={26} color={"white"} />
          <Text style={{ fontWeight: "600", fontSize: 18, color: "white" }}>
            End the Queue
          </Text>
        </Pressable>
      </View>
      <CustomAlert
        visible={modalVisible}
        message="Are you sure you want to end this queue?"
        onClose={() => setModalVisible(false)}
        onConfirm={() => removeQueue()}
      />
    </SafeAreaView>
  );
};

export default ClassQueue;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.Background,
    paddingTop: 10,
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
  },
  addButtonText: {
    color: Colors.Background,
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  removeButton: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 5,
    borderRadius: 100,
    backgroundColor: Colors.Red,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    width: "80%",
    alignSelf: "center",
  },
  bottomSpacer: {
    height: 200,
  },
});
