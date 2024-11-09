import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";

import { Colors } from "../config/Colors";
import courses from "../assets/data/courses";
import Course from "../components/Course";

const Home = () => {
  return (
    <View style={styles.container}>
      {/* User Greeting Header */}
      <StatusBar
        barStyle={"light-content"}
        translucent
        backgroundColor={"transparent"}
      />
      <View>
        <Text style={styles.welcomeText}>Welcome back, Amit</Text>
        <Text style={styles.sub}>
          Please choose from the list of available office hours below:
        </Text>
      </View>

      {/* Flatlist of courses */}
      <View
        style={{ height: 2, backgroundColor: "#fff9", marginVertical: 15 }}
      ></View>
      <FlatList
        data={courses}
        numColumns={2}
        renderItem={({ item, index }) => <Course key={index} course={item} />}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 0,
    padding: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.Primary,
  },
  sub: {
    fontSize: 16,
    color: Colors.Secondary,
    marginVertical: 10,
  },
});
