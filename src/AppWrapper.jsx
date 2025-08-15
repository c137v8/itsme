// AppWrapper.jsx
import React, { useState } from "react";
import App from "./App";
import SplashScreen from "./components/SplashScreen.jsx";

export default function AppWrapper() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <App />;
}
