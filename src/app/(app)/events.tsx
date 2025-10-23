import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, IconButton, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import FriendsEating from '../../assets/images/friends-eating.svg';
import Logo from '../../assets/images/logo.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '../../theme/typography';
import SwipeableEventCard from '../../components/SwipeableEventCard';
import { supabase } from '../../lib/supabase';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
}

export default function EventsScreen() {
  const { signOut, user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('id, title, description, date, total_cost')
        .order('date', { ascending: true });
      if (error) throw error;
      setEvents((data || []).map(e => ({ 
        id: e.id as unknown as string, 
        title: e.title, 
        description: e.description || '', 
        date: e.date 
      })));
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    const subscription = supabase
      .channel('public:events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchEvents)
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchEvents]);

  const handleCreateEvent = () => {
    if (!user) {
      router.push('/(auth)/welcome');
      return;
    }
    router.push('/(app)/events/create');
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      await fetchEvents();
    } catch (error) {
      console.error('Error al eliminar evento:', error);
    }
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <SwipeableEventCard event={item} onDelete={handleDeleteEvent} />
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/welcome');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.illustrationContainer}>
        <FriendsEating height={150} />
      </View>
      <View style={styles.titleContainer}>
        <Text variant="headlineLarge" style={styles.title} numberOfLines={1}>
          {user ? 'Todo listo para empezar' : '¡Bienvenido a Clarita!'}
        </Text>
      </View>
      <Text variant="bodyLarge" style={styles.subtitle}>
        {user 
          ? 'Creá tu primer evento desde el botón de abajo y dejá que Clarita se encargue de las cuentas.'
          : 'Regístrate para crear eventos y disfrutar de todas las funcionalidades de Clarita.'}
      </Text>
      {!user && (
        <Button
          mode="contained"
          onPress={() => router.push('/(auth)/welcome')}
          style={styles.registerButton}
        >
          Registrarse
        </Button>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Logo width={120} height={48} />
        </View>
        <View style={styles.headerActions}>
          {!user && (
            <Button
              mode="text"
              onPress={() => router.push('/(auth)/welcome')}
              style={styles.loginButton}
            >
              Iniciar Sesión
            </Button>
          )}
          {user && (
            <IconButton
              icon="account-circle-outline"
              size={28}
              onPress={() => router.push('/(app)/profile')}
            />
          )}
        </View>
      </View>

      {events.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={events}
          renderItem={renderEvent}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={fetchEvents}
        />
      )}

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
          {
            icon: 'calendar-plus',
            label: 'Crear evento',
            labelStyle: { fontSize: 14 },
            onPress: handleCreateEvent,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButton: {
    marginRight: 8,
  },
  list: {
    padding: 20,
  },
  card: {
    marginBottom: 16,
  },
  date: {
    ...typography.labelMedium,
    marginTop: 8,
    opacity: 0.7,
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
  titleContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    ...typography.headlineMedium,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    ...typography.bodyLarge,
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: '4%',
  },
  fabGroup: {
    position: 'absolute',
    bottom: 56,
    alignSelf: 'center',
  },
  registerButton: {
    marginTop: 24,
    width: '80%',
  },
}); 