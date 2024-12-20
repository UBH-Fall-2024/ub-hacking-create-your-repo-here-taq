import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  PixelRatio,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../config/Colors";
import Animated, { BounceIn, FadeInLeft } from "react-native-reanimated";
import CustomStatusBar from "../components/CustomStatusBar";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from "expo-auth-session";
import { supabase, initialize } from "../supabase";
import {
  getFromSecureStore,
  removeFromSecureStore,
  saveToSecureStore,
} from "../helpers/secureStore";
import { isTokenValid } from "../helpers/token";
import GradientText from "../components/GradientText";

// ESSENTIAL for Expo Go
WebBrowser.maybeCompleteAuthSession();

const AUTOLAB_DOMAIN = "https://autolab.cse.buffalo.edu";

const autolabTokenUrl = "https://b400-106-51-174-158.ngrok-free.app/secret";

// Configuration for oauth
const discovery = {
  authorizationEndpoint: `${AUTOLAB_DOMAIN}/oauth/authorize`,
  tokenEndpoint: `${AUTOLAB_DOMAIN}/oauth/token`,
};

const Auth = ({ navigation }) => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  // Generate the correct redirect URI for Expo Go
  // Change it as "nextup" in prebuild
  const redirectUri = makeRedirectUri({
    scheme: "exp://",
    preferLocalhost: true,
    isTripleSlashed: true,
  });
  console.log("Redirect URI:", redirectUri);

  const [authRequest, authResponse, promptAsync] = useAuthRequest(
    {
      clientId: "JXK8EkzV-fRzuM59b_f-EAPiF99QTJdyL3v9G1NlayY",
      scopes: ["user_info", "user_courses"],
      redirectUri,
      responseType: ResponseType.Code,
    },
    discovery
  );

  useEffect(() => {
    // Restore session if token is still valid
    const restoreSession = async () => {
      const storedToken = await getFromSecureStore("autolab_token");

      if (storedToken) {
        const valid = isTokenValid();
        if (valid) {
          setToken(storedToken);
          console.log("Token restored from secure store");
        } else {
          console.log("Token invalid, prompt re-authentication");
          console.log("Clearing secure store");
          await removeFromSecureStore("autolab_token");
          await removeFromSecureStore("autolab_token_expiry");
          await removeFromSecureStore("supabase_jwt");
          await removeFromSecureStore("supabase_jwt_expiry");
          setToken(null);
        }
      } else {
        console.log("No token found, prompt re-authentication");
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    console.log("Response received:", authResponse);

    if (authResponse?.type === "success") {
      const { code } = authResponse.params;
      console.log("Authorization Code:", code);
      exchangeCodeForToken(code);
    } else if (authResponse?.type === "error") {
      console.error("Auth Error:", authResponse.error);
      setError(authResponse.error || "Authentication failed");

      // Show an alert with more details
      Alert.alert(
        "Authentication Error",
        JSON.stringify(authResponse.error, null, 2),
        [{ text: "OK" }]
      );
    }
  }, [authResponse]);

  const exchangeCodeForToken = async (code) => {
    try {
      console.log("Attempting to exchange code for token...");

      // Get the client secret from the server
      const getClientSecret = async () => {
        const res = await fetch(autolabTokenUrl);
        if (!res.ok) {
          // Check for potential api abuse
          if (res.status === 429) {
            throw new Error("API rate limit exceeded");
          } else {
            throw new Error("Failed to fetch client secret from server");
          }
        } else {
          resJson = await res.json();
          console.log("Client Secret Response:", resJson.autolab_secret);
          return resJson.autolab_secret;
        }
      };

      const tokenResponse = await fetch(`${AUTOLAB_DOMAIN}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: "JXK8EkzV-fRzuM59b_f-EAPiF99QTJdyL3v9G1NlayY",
          client_secret: await getClientSecret(),
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }).toString(),
      });

      const tokenData = await tokenResponse.json();
      console.log("Full Token Response:", JSON.stringify(tokenData, null, 2));

      if (tokenData.access_token) {
        // Save token and expiration to secure store
        await saveToSecureStore("autolab_token", tokenData.access_token);
        await saveToSecureStore(
          "autolab_token_expiry",
          (tokenData.created_at + tokenData.expires_in).toString()
        );

        // Initialize supabase client only when a new token is received
        await initialize();

        // Set the local token state after the async operation is done
        // As the useeffect listener will not be triggered
        // before the token is set in secure store
        setToken(tokenData.access_token);

        console.log("Autolab Token received and stored successfully");
      } else {
        setError("Failed to get access token");
        console.error("Token response:", tokenData);

        // Show an alert with token exchange failure details
        Alert.alert(
          "Token Exchange Failed",
          JSON.stringify(tokenData, null, 2),
          [{ text: "OK" }]
        );
      }
    } catch (e) {
      console.error("Full Token Exchange Error:", e);
      setError(e.message);

      // Check the error message for potential api abuse
      if (e.message === "API rate limit exceeded") {
        Alert.alert(
          "API Rate Limit Exceeded",
          "Dont spam the server dumbass..",
          [{ text: "Understood" }]
        );
        return;
      }

      // Show an alert with the full error
      Alert.alert(
        "Token Exchange Error",
        e.message + "\n" + JSON.stringify(e, null, 2),
        [{ text: "OK" }]
      );
    }
  };

  const fetchUserInfo = async () => {
    const valid = await isTokenValid();
    if (!valid) {
      console.log("Token invalid, cannot fetch user info");
      return;
    }

    try {
      console.log("Fetching user info...");

      const userResponse = await fetch(`${AUTOLAB_DOMAIN}/api/v1/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await userResponse.json();
      console.log("User Data:", JSON.stringify(userData, null, 2));

      return userData;
    } catch (e) {
      console.error("User Fetch Error:", e);
    }
  };

  const fetchUserCourses = async () => {
    const valid = await isTokenValid();
    if (!valid) {
      console.log("Token invalid, cannot fetch user info");
      return;
    }

    try {
      console.log("Fetching user courses...");

      const coursesResponse = await fetch(`${AUTOLAB_DOMAIN}/api/v1/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const coursesData = await coursesResponse.json();
      console.log("Courses Data:", JSON.stringify(coursesData, null, 2));
    } catch (e) {
      console.error("Courses Fetch Error:", e);
    }
  };

  useEffect(() => {
    // Check in supabase if the user already exists, if not create one using
    // the info from autolab
    if (token) {
      // Fetch user info from Autolab
      fetchUserInfo().then(async (userInfo) => {
        if (!userInfo) {
          console.log(
            "Cannot fetch user info, probably user is not authenticated"
          );
          return;
        }

        // Check if user exists in Supabase
        console.log(userInfo);
        let { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", userInfo.email);
        console.log("User: " + user, "Error: " + error);

        // User doesnt exist in Supabase, essentially a new user
        if (user.length === 0) {
          // Create user in Supabase
          let { data, error } = await supabase
            .from("users")
            .insert([
              {
                email: userInfo.email,
                name: userInfo.first_name + " " + userInfo.last_name,
              },
            ])
            .select("*");
          console.log("Data: " + data, "Error: " + error);
          navigation.navigate("Courses", {
            userId: data[0].id,
            token: token,
          });
        } else {
          console.log("User already exists in Supabase");
          navigation.navigate("Courses", {
            userId: user[0].id,
            token: token,
          });
        }
      });
    }
  }, [token]);

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/data/logo.png")}
        style={styles.logo}
        entering={BounceIn.springify().damping(80).stiffness(200).delay(100)}
        exiting={BounceIn.springify().damping(80).stiffness(200).delay(100)}
      />
      {/* <GradientText style={{ fontSize: 40, fontWeight: "bold" }}>
        Animated Gradient
      </GradientText> */}
      <CustomStatusBar />
      <AnimatedPressable
        onPress={() => {
          console.log("Initiating auth request...");
          promptAsync({}).catch((err) => {
            console.error("Prompt Async Error:", err);
            Alert.alert("Prompt Error", JSON.stringify(err, null, 2), [
              { text: "OK" },
            ]);
          });
        }}
        entering={FadeInLeft.damping(80).stiffness(200).delay(120)}
        exiting={FadeInLeft.damping(80).stiffness(200).delay(120)}
        style={styles.signinContainer}
      >
        <Text style={[styles.signinText, { fontSize: width / 23 }]}>
          Sign in with Autolab
        </Text>
      </AnimatedPressable>
      {/* <Button
        title="Get User Info"
        onPress={() => {
          fetchUserInfo().catch((err) => {
            console.error("Fetch User Info Error:", err);
            Alert.alert("Error", JSON.stringify(err, null, 2), [
              { text: "OK" },
            ]);
          });
        }}
      />
      <Button
        title="Get User courses"
        onPress={() => {
          fetchUserCourses().catch((err) => {
            console.error("Fetch User Courses Error:", err);
            Alert.alert("Error", JSON.stringify(err, null, 2), [
              { text: "OK" },
            ]);
          });
        }}
      /> */}
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
  signinContainer: {
    backgroundColor: Colors.Orange,
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
  },
  signinText: {
    color: Colors.Background,
    fontWeight: "bold",
    fontSize: 16,
  },
});
