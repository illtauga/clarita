import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationFinish?: () => void;
  animationSource?: any; // El archivo JSON de Lottie
}

export default function SplashScreen({ onAnimationFinish, animationSource }: SplashScreenProps) {
  const animationRef = useRef<LottieView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Opcional: reproducir la animación automáticamente
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  const handleAnimationFinish = () => {
    // Iniciar fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      if (onAnimationFinish) {
        onAnimationFinish();
      }
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LottieView
        ref={animationRef}
        source={animationSource}
        style={styles.animation}
        autoPlay
        loop={false}
        resizeMode="cover"
        onAnimationFinish={handleAnimationFinish}
      />
    </Animated.View>
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

