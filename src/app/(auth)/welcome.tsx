import React from 'react';
import { View, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { typography } from '../../theme/typography';
import { buttonStyles } from '../../theme/buttons';
import Logo from '../../assets/images/logo.svg';
const patternImage = require('../../assets/images/pattern.png');

export default function WelcomeScreen() {
  const router = useRouter();
  const { width, height } = Dimensions.get('window');

  return (
    <ImageBackground 
      source={patternImage} 
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Logo width={400} height={80} />
        </View>
        <Text style={[typography.headlineMedium, styles.title]}>
          {"Disfrutá de la juntada,\nClarita hace las cuentas."}
        </Text>
      </View>

      {/* Fixed Footer CTA */}
      <View style={styles.fixedFooter}>
        <Button
          mode="contained"
          onPress={() => router.push('/(app)/quick-split')}
          style={[buttonStyles.button, buttonStyles.primary, buttonStyles.contained]}
          contentStyle={buttonStyles.content}
          labelStyle={buttonStyles.primaryText}
        >
          ¡Comenzar!
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 140, // Espacio para el botón fijo
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  fixedFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
}); 