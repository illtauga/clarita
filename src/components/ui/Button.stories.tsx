import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from './Button';

export default {
  title: 'UI/Button',
  component: Button,
  decorators: [
    (Story: any) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Primary = () => (
  <Button title="Primary Button" onPress={() => console.log('Primary pressed')} />
);

export const Secondary = () => (
  <Button
    title="Secondary Button"
    variant="secondary"
    onPress={() => console.log('Secondary pressed')}
  />
);

export const Outline = () => (
  <Button
    title="Outline Button"
    variant="outline"
    onPress={() => console.log('Outline pressed')}
  />
);

export const Ghost = () => (
  <Button
    title="Ghost Button"
    variant="ghost"
    onPress={() => console.log('Ghost pressed')}
  />
);

export const Small = () => (
  <Button
    title="Small Button"
    size="small"
    onPress={() => console.log('Small pressed')}
  />
);

export const Medium = () => (
  <Button
    title="Medium Button"
    size="medium"
    onPress={() => console.log('Medium pressed')}
  />
);

export const Large = () => (
  <Button
    title="Large Button"
    size="large"
    onPress={() => console.log('Large pressed')}
  />
);

export const Disabled = () => (
  <Button
    title="Disabled Button"
    disabled
    onPress={() => console.log('This should not print')}
  />
);

export const Loading = () => (
  <Button
    title="Loading Button"
    loading
    onPress={() => console.log('Loading')}
  />
);

export const FullWidth = () => (
  <Button
    title="Full Width Button"
    fullWidth
    onPress={() => console.log('Full width pressed')}
  />
);

export const AllVariants = () => (
  <View style={styles.column}>
    <Button title="Primary" onPress={() => {}} />
    <View style={styles.spacer} />
    <Button title="Secondary" variant="secondary" onPress={() => {}} />
    <View style={styles.spacer} />
    <Button title="Outline" variant="outline" onPress={() => {}} />
    <View style={styles.spacer} />
    <Button title="Ghost" variant="ghost" onPress={() => {}} />
    <View style={styles.spacer} />
    <Button title="Disabled" disabled onPress={() => {}} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  column: {
    width: '100%',
    maxWidth: 400,
  },
  spacer: {
    height: 12,
  },
});

