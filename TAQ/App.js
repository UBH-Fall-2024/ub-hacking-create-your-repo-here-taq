import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "./config/Colors";
import User from "./screens/User";
import ClassQueue from "./screens/ClassQueue";
import Navigation from "./Navigation";

export default function App() {
  // return <User queueLength={5} estimatedTime={40}/>;
  // return <ClassQueue/>
  return <Navigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
