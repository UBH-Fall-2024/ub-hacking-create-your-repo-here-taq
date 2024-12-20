import React, { useEffect } from "react";
import { Text } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const GradientText = (props) => {
  const [colors, setColors] = React.useState(["#4c669f", "#3b5998", "#192f6a"]);

  const AnimatedLinearGradient =
    Animated.createAnimatedComponent(LinearGradient);

  const progress = useSharedValue(0);

  // Update colors using state
  const updateColors = (progressValue) => {
    const color1 = interpolateColor(
      progressValue,
      [0, 1],
      ["#4c669f", "#ff9e6c"]
    );
    const color2 = interpolateColor(
      progressValue,
      [0, 1],
      ["#3b5998", "#feb47b"]
    );
    const color3 = interpolateColor(
      progressValue,
      [0, 1],
      ["#192f6a", "#ff6f91"]
    );
    setColors([color1, color2, color3]);
  };

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, {
        duration: 2000,
      }),
      -1,
      true
    );
  }, []);

  useAnimatedReaction(
    () => progress.value,
    (currentValue) => {
      runOnJS(updateColors)(currentValue);
    }
  );

  return (
    <MaskedView maskElement={<Text {...props} />}>
      <AnimatedLinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </AnimatedLinearGradient>
    </MaskedView>
  );
};

export default GradientText;
