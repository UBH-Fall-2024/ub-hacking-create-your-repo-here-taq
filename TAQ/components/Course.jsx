import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Colors } from "../config/Colors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const Course = ({ course, navigation, disabled }) => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    if (disabled) return;
    navigation.navigate("Location"); // Navigate after animation
  };

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayLongPress={150}
      onLongPress={() => {}}
    >
      <Text
        ellipsizeMode="tail"
        numberOfLines={2}
        style={[styles.name, { fontSize: Platform.OS === "android" ? 14 : 18 }]}
      >
        {course.courses.name}
      </Text>
      <Text
        style={[styles.code, { fontSize: Platform.OS === "android" ? 13 : 15 }]}
      >
        {course.courses.code}
      </Text>
    </AnimatedPressable>
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
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  code: {
    color: "black",
  },
});
