import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "../config/Colors";

const Course = ({ course, isLocation }) => {
  return (
    <View style={styles.container}>
      <Text ellipsizeMode="tail" numberOfLines={2} style={styles.name}>{course.name}</Text>
      <Text style={styles.code}>{course.code}</Text>
    </View>
  );
};

export default Course;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.Secondary,
    padding: 20,
    margin: 10,
    borderRadius: 10,
    height: Dimensions.get("window").height / 6,
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  code: {
    fontSize: 12,
    color: "black",
  },
});
