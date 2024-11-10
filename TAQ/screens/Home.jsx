import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../config/Colors";
import courses from "../assets/data/courses";
import Course from "../components/Course";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Home = ({ navigation }) => {
  const [isScrolling, setIsScrolling] = React.useState(false);

  useEffect(() => {
    const unsub = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    });

    return unsub;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingTop: 10, flex: 1 }}>
        {/* User Greeting Header */}
        <StatusBar
          barStyle={"light-content"}
          translucent
          backgroundColor={"transparent"}
        />
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.welcomeText}>Welcome back, Amit!</Text>
            <MaterialIcons name="logout" size={30} color={Colors.Red} />
          </View>
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
          onScrollBeginDrag={() => {
            // Disable touch events while scrolling
            setIsScrolling(true);
          }}
          onScrollEndDrag={() => {
            // Enable touch events after scrolling
            setIsScrolling(false, 150);
          }}
          renderItem={({ item, index }) => (
            <Course
              key={index}
              course={item}
              navigation={navigation}
              disabled={isScrolling}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d031b",
    padding: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.Primary,
    width: "70%",
  },
  sub: {
    fontSize: 16,
    color: Colors.Secondary,
    marginVertical: 10,
  },
});
