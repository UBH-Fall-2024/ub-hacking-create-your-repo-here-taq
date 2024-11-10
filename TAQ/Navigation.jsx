import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Locations from "./screens/Locations";
import Auth from "./screens/Auth";
import User from "./screens/User";
import ClassQueue from "./screens/ClassQueue";

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    // <ClassQueue />
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen
        name="Courses"
        component={Home}
        options={{
          animation: "slide_from_bottom",
          headerBackButtonMenuEnabled: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Location"
        component={Locations}
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
