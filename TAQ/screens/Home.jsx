import {
  ActivityIndicator,
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../config/Colors";
// import courses from "../assets/data/courses";
import Course from "../components/Course";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { supabase } from "../supabase";
import CustomAlert from "../components/CustomAlert";

const Home = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [modalVisible, setModalVisible] = useState(false);

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
              onPress={async () => {
                await supabase.auth.signOut();
                signoutButtonTriggerRef.current = true;
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
              <Course key={index} course={item} navigation={navigation} />
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
