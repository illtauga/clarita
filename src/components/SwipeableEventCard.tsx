import React, { useRef, useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Text, IconButton, MD3LightTheme } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { typography } from '../theme/typography';
import { router } from 'expo-router';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
}

interface SwipeableEventCardProps {
  event: Event;
  onDelete: (id: string) => void;
}

const SwipeableEventCard = ({ event, onDelete }: SwipeableEventCardProps) => {
  const swipeableRef = useRef<Swipeable>(null);
  const [isCardClosed, setIsCardClosed] = useState(true);

  const handleDelete = () => {
    Alert.alert(
      "Eliminar evento",
      "¿Estás seguro de que deseas eliminar este evento?",
      [
        {
          text: "Cancelar",
          onPress: () => swipeableRef.current?.close(),
          style: "cancel"
        },
        { 
          text: "Eliminar", 
          onPress: () => {
            onDelete(event.id);
            swipeableRef.current?.close();
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleCardPress = () => {
    if (isCardClosed) {
      router.push({
        pathname: "/(app)/events/[id]",
        params: { id: event.id }
      });
    }
  };

  const renderRightActions = () => {
    return (
      <View style={styles.rightAction}>
        <IconButton
          icon="delete"
          iconColor="#fff"
          size={24}
          onPress={handleDelete}
          style={styles.deleteButton}
        />
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      onSwipeableOpen={() => {
        setIsCardClosed(false);
      }}
      onSwipeableClose={() => {
        setIsCardClosed(true);
      }}
      onSwipeableWillOpen={() => {
        setIsCardClosed(false);
      }}
    >
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={handleCardPress}
      >
        <Card style={styles.card} pointerEvents="box-only">
          <Card.Content>
            <Title style={styles.title}>{event.title}</Title>
            <Paragraph style={styles.description}>{event.description}</Paragraph>
            <Text style={styles.date}>{new Date(event.date).toLocaleDateString()}</Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#ECE6F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 16,
  },
  title: {
    color: '#000000',
    ...typography.titleLarge,
  },
  description: {
    color: '#000000',
    opacity: 0.7,
    ...typography.bodyMedium,
  },
  date: {
    ...typography.labelMedium,
    marginTop: 8,
    opacity: 0.6,
    color: '#000000',
  },
  rightAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100%',
    borderRadius: 8,
    marginBottom: 16,
    maxWidth: 100,
  },
  deleteButton: {
    alignSelf: 'center',
    marginRight: 16,
  },
});

export default SwipeableEventCard; 