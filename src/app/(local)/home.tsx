import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, FAB } from 'react-native-paper';
import { useLocalMode } from '../../contexts/LocalModeContext';
import { router } from 'expo-router';
import { typography } from '../../theme/typography';
import FriendsEating from '../../assets/images/friends-eating.svg';
import Logo from '../../assets/images/logo.svg';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LocalHome() {
  const { disableLocalMode } = useLocalMode();
  const [fabOpen, setFabOpen] = useState(false);

  const handleSignOut = () => {
    disableLocalMode();
    router.replace('/(auth)/welcome');
  };

  const handleCreateEvent = () => {
    // TODO: Implementar la creación de eventos en modo local
    console.log('Crear evento en modo local');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo width={120} height={48} />
        </View>
        <IconButton
          icon="exit-to-app"
          size={28}
          onPress={handleSignOut}
        />
      </View>

      <View style={styles.emptyState}>
        <View style={styles.illustrationContainer}>
          <FriendsEating height={150} />
        </View>
        <Text variant="headlineLarge" style={styles.title}>
          ¡Bienvenido a Clarita!
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Estás usando Clarita en modo local. Tus datos se guardarán solo en este dispositivo.
        </Text>
      </View>

      <FAB.Group
        open={fabOpen}
        onStateChange={({ open }) => setFabOpen(open)}
        icon={fabOpen ? 'close' : 'plus'}
        visible={true}
        style={styles.fabGroup}
        backdropColor="transparent"
        actions={[
          {
            icon: 'calculator-variant',
            label: 'Cuentas rápidas',
            labelStyle: { fontSize: 14 },
            onPress: () => router.push('/(app)/quick-split'),
          },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -100,
  },
  illustrationContainer: {
    marginBottom: 24,
  },
  title: {
    ...typography.headlineMedium,
    textAlign: 'center',
    paddingHorizontal: '10%',
    marginBottom: 24,
  },
  subtitle: {
    ...typography.bodyLarge,
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: '15%',
  },
  fabGroup: {
    position: 'absolute',
    bottom: 56,
    alignSelf: 'center',
  },
}); 