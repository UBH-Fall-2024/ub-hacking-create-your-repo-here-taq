import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "./config/Colors";
import User from "./screens/User";

export default function App() {
  return (
    <View style={styles.container}>
      <User queueLength={3} estimatedTime={20} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
