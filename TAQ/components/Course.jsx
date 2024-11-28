import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { memo } from "react";
import { Colors } from "../config/Colors";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const Course = memo(({ course, navigation }) => {
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
  };

  const handleOnPress = () => {
    Haptics.impactAsync(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
    navigation.navigate("Location", {
      courseID: course.class.id,
      role: course.role,
    });
  };

  return (
    <AnimatedPressable
      style={[styles.container, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handleOnPress}
    >
      {course.role === "TA" ? (
        <View style={styles.labelContainer}>
          <Animated.Text
            entering={FadeIn.delay(100).damping(0.5).stiffness(100)}
            exiting={FadeIn.delay(100).damping(0.5).stiffness(100)}
            style={styles.roleLabel}
          >
            {course.role}
          </Animated.Text>
        </View>
      ) : null}
      <Text
        ellipsizeMode="tail"
        numberOfLines={2}
        style={[styles.name, { fontSize: Platform.OS === "android" ? 14 : 18 }]}
      >
        {course.class.name}
      </Text>
      <Text
        style={[styles.code, { fontSize: Platform.OS === "android" ? 13 : 15 }]}
      >
        {course.class.code}
      </Text>
    </AnimatedPressable>
  );
});

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
  labelContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    padding: 5,
    backgroundColor: "#6c7086",
    borderRadius: 5,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fcc6a4",
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
