import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Locations from "./screens/Locations";
import Auth from "./screens/Auth";
import StudentAdd from "./screens/StudentAdd";
import ClassQueue from "./screens/ClassQueue";
import { Colors } from "./config/Colors";
import { Text, View } from "react-native";
import * as linking from "expo-linking";

const Stack = createNativeStackNavigator();

const prefix = linking.createURL("/");

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
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="SQueue"
        component={StudentAdd}
        options={{
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="Queue"
        component={ClassQueue}
        options={{
          animation: "fade",
        }}
      />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  const linking = {
    prefixes: [prefix],
    // config: {
    //   screens: {
    //     Auth: "auth",
    //   },
    // },
  };

  return (
    <View style={{ backgroundColor: Colors.Background, flex: 1 }}>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <RootStack />
      </NavigationContainer>
    </View>
  );
}
