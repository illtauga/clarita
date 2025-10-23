import { getStorybookUI } from '@storybook/react-native';
import { View } from 'react-native';

import './storybook.requires';

const StorybookUIRoot = getStorybookUI({
  enableWebsockets: true,
  host: 'localhost',
  port: 7007,
});

export default StorybookUIRoot;

