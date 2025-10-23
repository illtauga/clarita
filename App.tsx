import { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { ExpoRoot } from 'expo-router';
import SplashScreen from './src/components/SplashScreen';

// Importa tu archivo JSON de Lottie aquí
import splashAnimation from './src/assets/animations/splash.json';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    LogBox.ignoreLogs(['Sending']);
  }, []);

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
    <ExpoRoot context={require.context('./src/app')} />
  );
} 