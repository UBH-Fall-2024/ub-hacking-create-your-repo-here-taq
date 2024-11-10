import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../config/Colors";

const Auth = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor="transparent"
        translucent
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <Pressable
        onPress={() => navigation.navigate("Courses")}
        style={styles.login}
      >
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
