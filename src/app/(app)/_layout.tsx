import React from 'react';
import { Stack } from 'expo-router';

export default function AppLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Stack.Screen
        name="events"
        options={{
          title: 'Eventos',
        }}
      />
      <Stack.Screen
        name="events/create"
        options={{
          title: 'Crear Evento',
        }}
      />
      <Stack.Screen
        name="events/[id]"
        options={{
          title: 'Detalles del Evento',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Perfil',
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: 'Editar Perfil',
        }}
      />
    </Stack>
  );
} 