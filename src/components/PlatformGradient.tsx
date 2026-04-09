import React from 'react';
import { View, ViewStyle } from 'react-native';

interface PlatformGradientProps {
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  [key: string]: any;
}

const PlatformGradient: React.FC<PlatformGradientProps> = ({
  colors,
  start,
  end,
  style,
  children,
  ...otherProps
}) => {
  // Globally enforcing the solid Orange (#E87F24) primary theme instead of gradients
  return (
    <View style={[{ backgroundColor: '#E87F24' }, style]} {...otherProps}>
      {children}
    </View>
  );
};

export default PlatformGradient;
