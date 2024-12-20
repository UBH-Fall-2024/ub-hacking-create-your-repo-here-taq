import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import * as Font from "expo-font";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // MESS WITH IT LATER..
  // const isReady = useSplashScreen(async () => {
  //   // Simulate loading assets or initialization
  //   await new Promise((resolve) => setTimeout(resolve, 2000));

  //   // Load fonts here
  // });

  // if (!isReady) {
  //   return null; // Render nothing while the app is preparing
  // }

  useEffect(() => {
    // Load fonts here for now(later in splashScreen)
    const loadFonts = async () => {
      await Font.loadAsync({
        // Poppins
        "Poppins-Regular": require("./assets/fonts/Poppins/Poppins-Regular.ttf"),
        "Poppins-Medium": require("./assets/fonts/Poppins/Poppins-Medium.ttf"),
        "Poppins-Bold": require("./assets/fonts/Poppins/Poppins-Bold.ttf"),

        // Montserrat
        "Montserrat-Regular": require("./assets/fonts/Montserrat/Montserrat-Regular.ttf"),
        "Montserrat-Medium": require("./assets/fonts/Montserrat/Montserrat-Medium.ttf"),
        "Montserrat-Bold": require("./assets/fonts/Montserrat/Montserrat-Bold.ttf"),
      });
    };

    loadFonts()
      .then(() => {
        setFontsLoaded(true);
        console.log("Fonts loaded");
      })
      .catch((err) => console.warn(err));
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return <Navigation />;
}
