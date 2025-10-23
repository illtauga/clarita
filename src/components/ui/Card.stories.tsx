import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card } from './Card';

export default {
  title: 'UI/Card',
  component: Card,
  decorators: [
    (Story: any) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

const SampleContent = () => (
  <View>
    <Text style={styles.title}>Card Title</Text>
    <Text style={styles.description}>
      This is a sample card with some content inside it. Cards are useful for grouping related information.
    </Text>
  </View>
);

export const Elevated = () => (
  <Card variant="elevated">
    <SampleContent />
  </Card>
);

export const Outlined = () => (
  <Card variant="outlined">
    <SampleContent />
  </Card>
);

export const Filled = () => (
  <Card variant="filled">
    <SampleContent />
  </Card>
);

export const SmallPadding = () => (
  <Card padding="small">
    <SampleContent />
  </Card>
);

export const LargePadding = () => (
  <Card padding="large">
    <SampleContent />
  </Card>
);

export const NoPadding = () => (
  <Card padding="none">
    <View style={{ padding: 16 }}>
      <SampleContent />
    </View>
  </Card>
);

export const Pressable = () => (
  <Card onPress={() => console.log('Card pressed')}>
    <SampleContent />
    <Text style={styles.hint}>Tap me!</Text>
  </Card>
);

export const AllVariants = () => (
  <View style={styles.column}>
    <Card variant="elevated">
      <Text style={styles.variantTitle}>Elevated Card</Text>
      <Text style={styles.description}>Has shadow elevation</Text>
    </Card>
    
    <View style={styles.spacer} />
    
    <Card variant="outlined">
      <Text style={styles.variantTitle}>Outlined Card</Text>
      <Text style={styles.description}>Has border outline</Text>
    </Card>
    
    <View style={styles.spacer} />
    
    <Card variant="filled">
      <Text style={styles.variantTitle}>Filled Card</Text>
      <Text style={styles.description}>Has background fill</Text>
    </Card>
    
    <View style={styles.spacer} />
    
    <Card variant="elevated" onPress={() => console.log('Pressed')}>
      <Text style={styles.variantTitle}>Pressable Card</Text>
      <Text style={styles.description}>Tap to interact</Text>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  column: {
    width: '100%',
    maxWidth: 400,
  },
  spacer: {
    height: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  variantTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1A1A1A',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

