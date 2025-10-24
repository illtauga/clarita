import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CalculatingScreenProps {
  onComplete?: () => void;
}

const messages = [
  'Haciendo cuentas',
  'Conservando amistades',
  'Dividiendo justamente',
];

export default function CalculatingScreen({ onComplete }: CalculatingScreenProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación del loader (rotación continua)
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  useEffect(() => {
    // Cambiar mensaje cada 2 segundos
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        
        // Si llegamos al final, llamar onComplete y detener
        if (nextIndex >= messages.length) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete?.();
          }, 2000); // Esperar 2 segundos antes de mostrar resultados
          return prevIndex;
        }
        
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    // Animación push up cuando cambia el mensaje
    translateY.setValue(30);
    opacity.setValue(0);
    
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentMessageIndex]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Loader circular */}
        <View style={styles.loaderContainer}>
          <Animated.View style={[styles.loaderRing, { transform: [{ rotate: spin }] }]} />
        </View>

        {/* Texto animado */}
        <Animated.View 
          style={[
            styles.textContainer, 
            { 
              transform: [{ translateY }],
              opacity,
            }
          ]}
        >
          <Text style={styles.message}>{messages[currentMessageIndex]}</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5A4A8A',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loaderContainer: {
    marginBottom: 40,
  },
  loaderRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: '#443770',
    borderTopColor: '#FFFFFF',
  },
  textContainer: {
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

