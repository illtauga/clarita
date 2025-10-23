import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Input } from './Input';

export default {
  title: 'UI/Input',
  component: Input,
  decorators: [
    (Story: any) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
};

export const Default = () => (
  <Input
    placeholder="Enter text here..."
    onChangeText={(text) => console.log(text)}
  />
);

export const WithLabel = () => (
  <Input
    label="Email"
    placeholder="Enter your email"
    keyboardType="email-address"
    onChangeText={(text) => console.log(text)}
  />
);

export const WithHelperText = () => (
  <Input
    label="Password"
    placeholder="Enter your password"
    secureTextEntry
    helperText="Must be at least 8 characters"
    onChangeText={(text) => console.log(text)}
  />
);

export const WithError = () => (
  <Input
    label="Email"
    placeholder="Enter your email"
    error="Please enter a valid email address"
    onChangeText={(text) => console.log(text)}
  />
);

export const FilledVariant = () => (
  <Input
    label="Name"
    placeholder="Enter your name"
    variant="filled"
    onChangeText={(text) => console.log(text)}
  />
);

export const OutlineVariant = () => (
  <Input
    label="Phone"
    placeholder="Enter your phone"
    variant="outline"
    keyboardType="phone-pad"
    onChangeText={(text) => console.log(text)}
  />
);

export const SmallSize = () => (
  <Input
    label="Small Input"
    placeholder="Small size"
    size="small"
    onChangeText={(text) => console.log(text)}
  />
);

export const LargeSize = () => (
  <Input
    label="Large Input"
    placeholder="Large size"
    size="large"
    onChangeText={(text) => console.log(text)}
  />
);

export const WithIcons = () => (
  <View style={styles.column}>
    <Input
      label="Search"
      placeholder="Search..."
      leftIcon={<Text>🔍</Text>}
      onChangeText={(text) => console.log(text)}
    />
    <Input
      label="Password"
      placeholder="Enter password"
      secureTextEntry
      rightIcon={<Text>👁️</Text>}
      onChangeText={(text) => console.log(text)}
    />
  </View>
);

export const AllVariants = () => (
  <View style={styles.column}>
    <Input
      label="Default Input"
      placeholder="Default variant"
      helperText="This is a helper text"
    />
    <Input
      label="Filled Input"
      placeholder="Filled variant"
      variant="filled"
      helperText="This is a helper text"
    />
    <Input
      label="Outline Input"
      placeholder="Outline variant"
      variant="outline"
      helperText="This is a helper text"
    />
    <Input
      label="Input with Error"
      placeholder="With error"
      error="This field is required"
    />
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
});

