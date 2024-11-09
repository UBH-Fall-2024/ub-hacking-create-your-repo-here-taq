import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import courses from "../assets/data/courses";
import { Colors } from "../config/Colors";

const Locations = () => {
  const course = courses[1];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor="transparent"
        translucent
      />
      <Text style={styles.heading}>Locations</Text>
      <Text style={styles.sub}>Please choose one of the following: </Text>
      <View
        style={{ height: 2, backgroundColor: "#fff9", marginVertical: 15 }}
      />
      <FlatList
        data={course.location}
        // numColumns={2}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item, index }) => (
          <LocationItem key={index} location={item} />
        )}
      />
    </View>
  );
};

const LocationItem = ({ location }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.Secondary,
        padding: 30,
        borderRadius: 15,
        margin: 10,
        alignItems: "center",
      }}
    >
      <Text
        style={{ color: Colors.Background, fontWeight: "bold", fontSize: 14 }}
      >
        {location}
      </Text>
    </View>
  );
};

export default Locations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 0,
    padding: 10,
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.Primary,
    textAlign: "left",
  },
  sub: {
    fontSize: 16,
    color: Colors.Secondary,
    marginVertical: 5,
  },
});
