import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import IconBadge from './custom-iconBadge';

const FloatingButton = (props) => {
  const { size, icon, library, color, style, onPress } = props;
  return (
    <TouchableOpacity style={style} onPress={onPress} activeOpacity={0.5}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#5b86e5', '#36d1dc']}
        style={[
          styles.buttonContainer,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <IconBadge
          size={size / 2.2}
          icon={icon}
          library={library}
          color={color ?? '#ffffff'}
          pointerEvents={'none'}
          noTouchOpacity
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0.5,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});

export default FloatingButton;
