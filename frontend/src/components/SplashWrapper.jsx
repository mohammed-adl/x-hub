import { useState, useEffect } from "react";
import { SplashScreen } from "./ui/index.js";

const duration = 1000;

export default function SplashWrapper({ children }) {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (showLoading) {
    return <SplashScreen />;
  }

  return children;
}
