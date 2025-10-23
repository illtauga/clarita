import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationFinish?: () => void;
  animationSource?: any; // El archivo JSON de Lottie
}

export default function SplashScreen({ onAnimationFinish, animationSource }: SplashScreenProps) {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // Opcional: reproducir la animación automáticamente
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  const handleAnimationFinish = () => {
    if (onAnimationFinish) {
      onAnimationFinish();
    }
  };

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={animationSource}
        style={styles.animation}
        autoPlay
        loop={false}
        resizeMode="cover"
        onAnimationFinish={handleAnimationFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: width, // Ancho completo de la pantalla
    height: height, // Altura completa de la pantalla
  },
});

