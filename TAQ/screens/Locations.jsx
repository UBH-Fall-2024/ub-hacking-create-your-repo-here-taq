import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { memo, useEffect, useRef, useState } from "react";
import { Colors } from "../config/Colors";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Constants from "expo-constants";
import { supabase } from "../supabase";
import * as Haptics from "expo-haptics";
import LocationItem from "../components/LocationItem";

const Locations = ({ navigation, route }) => {
  const courseID = route.params.courseID;
  const role = route.params.role;
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [classID, setClassID] = useState(null);

  useEffect(() => {
    const fetchClass = async () => {
      let { data, error } = await supabase
        .from("classes")
        .select("*")
        .eq("id", courseID);

      if (error) {
        console.error("Error fetching class:", error);
        Alert.alert("Error", error.message);
        return;
      }

      console.log("Fetched class:", data);
      setLocations(data[0].locations);
      setClassID(data[0]?.id);
      setLoading(false);
    };

    fetchClass();
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.Primary} />
      </View>
    );
  }

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
      {locations.length === 0 ? (
        <View>
          <Text style={{ color: Colors.Secondary }}>
            No locations available for this class at the moment.
          </Text>
        </View>
      ) : (
        <FlatList
          data={locations}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item, index }) => (
            <LocationItem
              key={index}
              location={item}
              navigation={navigation}
              role={role}
              classID={classID}
            />
          )}
        />
      )}
    </View>
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
