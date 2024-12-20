import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../config/Colors";
import Course from "../components/Course";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { supabase, removeSupabaseClient } from "../supabase";
import { removeFromSecureStore } from "../helpers/secureStore";
import { isTokenValid } from "../helpers/token";

const Home = ({ navigation, route }) => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userId, token } = route.params;

  const signoutButtonTriggerRef = useRef(false);

  useEffect(() => {
    const unsub = navigation.addListener("beforeRemove", (e) => {
      if (!signoutButtonTriggerRef.current) {
        e.preventDefault();
      }
    });

    return unsub;
  }, [navigation]);

  useEffect(() => {
    const fetchCourses = async () => {
      const valid = await isTokenValid();
      if (!valid) {
        console.log(
          "Token invalid, cannot fetch user info, redirecting user to auth screen..."
        );
        navigation.popTo("Auth");
      }

      const { data: supabaseCourses, error } = await supabase
        .from("classes")
        .select("*");

      if (error) {
        console.log(error);
        return;
      }

      try {
        console.log("Fetching user courses...");

        const coursesResponse = await fetch(
          `https://autolab.cse.buffalo.edu/api/v1/courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const coursesData = await coursesResponse.json();
        console.log("Courses Data:", JSON.stringify(coursesData, null, 2));

        const filteredCourses = coursesData
          .map((autolabCourse) => {
            const matchingCourse = supabaseCourses.find(
              (sCourse) =>
                sCourse.code.toLowerCase().trim() ===
                autolabCourse.name.split("-")[0].toLowerCase()
            );
            return {
              ...autolabCourse,
              supabaseCourseId: matchingCourse ? matchingCourse.id : null,
            };
          })
          .filter(
            (course) =>
              course.supabaseCourseId !== null &&
              String(course.name)
                .split("-")[1]
                .includes(new Date().getFullYear().toString().slice(2))
          );
        console.log("Filtered Courses:", filteredCourses);

        setCourses(filteredCourses);
      } catch (e) {
        console.error("Courses Fetch Error:", e);
      }
    };

    const fetchUser = async () => {
      const valid = await isTokenValid();
      if (!valid) {
        console.log(
          "Token invalid, cannot fetch user info, redirecting user to auth screen..."
        );
        navigation.popTo("Auth");
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId);

      if (error) {
        console.log(error);
        return;
      }

      setUser(data[0]);
    };

    fetchCourses()
      .finally(() => fetchUser())
      .finally(() => setLoading(false))
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [userId, token]);

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
              onPress={async () => {
                signoutButtonTriggerRef.current = true;
                await removeFromSecureStore("autolab_token");
                await removeFromSecureStore("autolab_token_expiry");
                await removeFromSecureStore("supabase_jwt");
                await removeFromSecureStore("supabase_jwt_expiry");
                removeSupabaseClient();
                console.log(
                  "User signed out and token cleared, supabase client and jwt token removed"
                );
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
            renderItem={({ item, index }) => (
              <Course
                key={index}
                course={item}
                navigation={navigation}
                userId={userId}
              />
            )}
          />
        )}
      </View>
      {/* Not Working! */}
      {/* <CustomAlert
        visible={modalVisible}
        message="Are you sure you want to sign out?"
        onClose={() => setModalVisible(false)}
        onConfirm={async () => {
          await supabase.auth.signOut();
          signoutButtonTriggerRef.current = true;
          navigation.goBack();
        }}
      /> */}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    padding: 10,
  },
  welcomeText: {
    fontSize: 28,
    // fontWeight: "bold",
    color: Colors.Primary,
    width: "70%",
    fontFamily: "Poppins-Bold"
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
