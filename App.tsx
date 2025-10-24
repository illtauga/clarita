import { useEffect, useState, useRef } from 'react';
import { LogBox, Animated } from 'react-native';
import { ExpoRoot } from 'expo-router';
import SplashScreen from './src/components/SplashScreen';

// Importa tu archivo JSON de Lottie aquí
import splashAnimation from './src/assets/animations/splash.json';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    LogBox.ignoreLogs(['Sending']);
  }, []);

  useEffect(() => {
    if (!showSplash) {
      // Fade in cuando se muestra la app
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [showSplash, fadeAnim]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <SplashScreen 
        onAnimationFinish={handleSplashFinish}
        animationSource={splashAnimation}
      />
    );
  }

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ExpoRoot context={require.context('./src/app')} />
    </Animated.View>
  );
} 