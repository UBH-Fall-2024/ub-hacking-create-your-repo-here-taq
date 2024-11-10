import {
  FlatList,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import courses from "../assets/data/courses";
import { Colors } from "../config/Colors";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Constants from "expo-constants";

const Locations = ({ navigation }) => {
  const course = courses[1];

  const [isScrolling, setIsScrolling] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor="transparent"
        translucent
      />
      <Animated.Text style={styles.heading}>Locations</Animated.Text>
      <Animated.Text style={styles.sub}>
        Please choose one of the following:
      </Animated.Text>
      <View
        style={{ height: 2, backgroundColor: "#fff9", marginVertical: 15 }}
      />
      <FlatList
        data={course.location}
        contentContainerStyle={{ gap: 10 }}
        onScrollBeginDrag={() => {
          // Disable touch events while scrolling
          setIsScrolling(true);
        }}
        onScrollEndDrag={() => {
          // Enable touch events after scrolling
          setIsScrolling(false, 150);
        }}
        renderItem={({ item, index }) => (
          <LocationItem
            key={index}
            location={item}
            navigation={navigation}
            disabled={isScrolling}
          />
        )}
      />
    </View>
  );
};

const LocationItem = ({ location, navigation, disabled }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 100 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    if (disabled) return;
    navigation.navigate("Queue"); // Navigate after animation
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <AnimatedPressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      entering={FadeIn.delay(300).damping(0.5).stiffness(100)}
      exiting={FadeIn.delay(300).damping(0.5).stiffness(100)}
      style={[{ flex: 1 }, animatedStyle]}
    >
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
          style={{
            color: Colors.Background,
            fontWeight: "bold",
            fontSize: Platform.OS === "android" ? 14 : 18,
          }}
        >
          {location}
        </Text>
      </View>
    </AnimatedPressable>
  );
};

export default Locations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    paddingTop: Constants.statusBarHeight + 20,
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
