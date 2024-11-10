import {
  ActivityIndicator,
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../config/Colors";
// import courses from "../assets/data/courses";
import Course from "../components/Course";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { supabase } from "../supabase";

const Home = ({ navigation }) => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    });

    return unsub;
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("user_courses")
        .select(
          `
          *,
          class (*)
        `
        )
        .eq("user", (await supabase.auth.getUser()).data.user.id);

      if (error) {
        console.error("Error fetching courses:", error);
      } else {
        console.log("Fetched courses:", data);
        setCourses(data);
      }
    };

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", (await supabase.auth.getUser()).data.user.id);

      if (error) {
        console.error("Error fetching user:", error);
        Alert.alert("Error", error.message);
      } else {
        console.log("Fetched user:", data);
        setUser(data[0]);
      }
    };

    Promise.all([fetchCourses(), fetchUser()]).then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.Background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    );
  }

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
            <Text style={styles.welcomeText}>
              Welcome back, {user.email.split("@")[0]}!
            </Text>
            <MaterialIcons
              name="logout"
              onPress={() => {
                supabase.auth.signOut();
                navigation.goBack();
              }}
              size={30}
              color={Colors.Red}
            />
          </View>
          <Text style={styles.sub}>
            Please choose from the list of available office hours below:
          </Text>
        </View>

        {/* Flatlist of courses */}
        <View
          style={{ height: 2, backgroundColor: "#fff9", marginVertical: 15 }}
        ></View>
        {courses.length === 0 ? (
          <View>
            <Text style={styles.fallbackText}>
              You have no courses yet :( please check back later
            </Text>
          </View>
        ) : (
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
        )}
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
  fallbackText: {
    color: Colors.Secondary,
    fontSize: 16,
    textAlign: "center",
  },
});
