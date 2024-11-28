import { memo } from "react";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Colors } from "../config/Colors";
import { Platform, Pressable, View, Text } from "react-native";

const LocationItem = memo(({ location, navigation, role, classID }) => {
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

  const onPressHandler = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    if (role === "Student") {
      navigation.navigate("SQueue", { location: location, classID: classID });
    } else {
      navigation.navigate("Queue", { location: location, classID: classID });
    }
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPressHandler}
      entering={FadeIn.delay(100).damping(0.5).stiffness(100)}
      exiting={FadeIn.delay(100).damping(0.5).stiffness(100)}
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
});

export default LocationItem;
