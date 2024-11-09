import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "./config/Colors";
import User from "./screens/User";
import Home from "./screens/Home";
import Locations from "./screens/Locations";
import Auth from "./screens/Auth";

export default function App() {
  return <Auth />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
