import {
  Alert,
  AppState,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../config/Colors";
import { supabase } from "../supabase";
import Animated, {
  BounceIn,
  BounceInUp,
  FadeIn,
} from "react-native-reanimated";

const Auth = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleAppStateChange = (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
        checkSession();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    };

    // Initial session check
    checkSession();

    // Add the AppState change listener
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Clean up the listener on component unmount
    return () => {
      subscription.remove();
      supabase.auth.stopAutoRefresh();
    };
  }, [navigation]);

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      navigation.navigate("Courses");
    }
  };

  async function signInWithEmail() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        navigation.navigate("Courses");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function signUpWithEmail() {
    setLoading(true);
    try {
      // First, sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: "Amit",
          },
        },
      });

      if (error) {
        Alert.alert("Error", error.message);
        return; // Exit early if there's an error
      }

      // If signup successful, insert into public.users
      if (data.user) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id, // Use the auth user's ID
            name: "Amit",
            email: data.user.email,
            role: "Student",
          },
        ]);

        if (insertError) {
          console.error("Error inserting user:", insertError);
          Alert.alert("Error", "Failed to create user profile");
          return;
        }

        // If everything successful, navigate
        if (data.session) {
          navigation.navigate("Courses");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/data/logo.png")}
        style={styles.logo}
        entering={BounceIn.springify().damping(80).stiffness(200).delay(100)}
      />
      <StatusBar
        barStyle={"light-content"}
        backgroundColor="transparent"
        translucent
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Pressable onPress={signInWithEmail} style={styles.login}>
        <Text style={{ color: Colors.Background, fontWeight: "bold" }}>
          Login
        </Text>
      </Pressable>
      <Text style={styles.forgotText}>Forgot password?</Text>
    </View>
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.Background,
  },
  logo: {
    width: "80%",
    height: Dimensions.get("window").height / 3,
    resizeMode: "cover",
    marginTop: Platform.OS === "ios" ? -400 : 0,
  },
  input: {
    backgroundColor: Colors.Secondary,
    padding: 15,
    borderRadius: 10,
    width: "80%",
    margin: 10,
  },
  login: {
    backgroundColor: Colors.Blue,
    padding: 15,
    borderRadius: 10,
    width: "80%",
    margin: 10,
    alignItems: "center",
  },
  forgotText: {
    color: Colors.Secondary,
    fontSize: 12,
    textDecorationLine: "underline",
    margin: 10,
    marginTop: 15,
  },
});
