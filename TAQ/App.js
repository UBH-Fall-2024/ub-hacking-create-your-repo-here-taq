import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "./config/Colors";

export default function App() {
  return (
    <View style={styles.container}>
      {/* User Greeting Header */}
      <View>
        <Text>Welcome back, Amit</Text>
        <Text>
          Please choose from the list of available office hours below:
        </Text>
      </View>
      {/* <FlatList data={} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    alignItems: "center",
    justifyContent: "center",
  },
});
