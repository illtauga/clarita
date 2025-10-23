import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, Button, List, Switch, Divider, IconButton } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showEmail, setShowEmail] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/welcome');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={user?.user_metadata?.full_name?.charAt(0) || 'U'} 
          style={styles.avatar}
        />
        <Text variant="headlineMedium" style={styles.username}>
          {user?.user_metadata?.full_name || 'Usuario'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Información Personal
        </Text>
        <List.Item
          title="Email"
          description={user?.email}
          left={props => <List.Icon {...props} icon="email" />}
        />
        <Divider />
        <List.Item
          title="Nombre de usuario"
          description={user?.user_metadata?.full_name}
          left={props => <List.Icon {...props} icon="account" />}
          right={props => (
            <IconButton
              icon="pencil"
              onPress={() => router.push('/(app)/edit-profile')}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Preferencias
        </Text>
        <List.Item
          title="Notificaciones"
          description="Recibir notificaciones de eventos y actualizaciones"
          left={props => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          )}
        />
        <Divider />
        <List.Item
          title="Mostrar email"
          description="Permitir que otros usuarios vean tu email"
          left={props => <List.Icon {...props} icon="eye" />}
          right={() => (
            <Switch
              value={showEmail}
              onValueChange={setShowEmail}
            />
          )}
        />
      </View>

      <View style={styles.section}>
        <Button
          mode="outlined"
          onPress={handleSignOut}
          style={styles.signOutButton}
        >
          Cerrar Sesión
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  avatar: {
    marginBottom: 10,
  },
  username: {
    marginBottom: 5,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    color: '#666',
  },
  signOutButton: {
    marginTop: 20,
    marginBottom: 40,
  },
}); 