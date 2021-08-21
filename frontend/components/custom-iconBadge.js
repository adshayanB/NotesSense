import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Icons from '@expo/vector-icons';

const IconBadge = ({
  color,
  badgeColor,
  badgeCount,
  onPress,
  icon,
  size,
  noTouchOpacity,
  library,
  style,
  pointerEvents,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={noTouchOpacity ? 1 : 0.2}
      style={[styles.container, style]}
      onPress={onPress}
      pointerEvents={pointerEvents}
    >
      {(!library || library === 'MaterialCommunityIcons') && (
        <Icons.MaterialCommunityIcons name={icon} size={size} color={color} />
      )}
      {library === 'AntDesign' && (
        <Icons.AntDesign name={icon} size={size} color={color} />
      )}
      {library === 'Entypo' && (
        <Icons.Entypo name={icon} size={size} color={color} />
      )}
      {library === 'EvilIcons' && (
        <Icons.EvilIcons name={icon} size={size} color={color} />
      )}
      {library === 'FontAwesome' && (
        <Icons.FontAwesome name={icon} size={size} color={color} />
      )}
      {library === 'FontAwesome5' && (
        <Icons.FontAwesome5 name={icon} size={size} color={color} />
      )}
      {library === 'Octicons' && (
        <Icons.Octicons name={icon} size={size} color={color} />
      )}
      {library === 'SimpleLineIcons' && (
        <Icons.SimpleLineIcons name={icon} size={size} color={color} />
      )}
      {library === 'Feather' && (
        <Icons.Feather name={icon} size={size} color={color} />
      )}
      {library === 'Fontisto' && (
        <Icons.Fontisto name={icon} size={size} color={color} />
      )}
      {badgeCount > 0 ? (
        <View style={[styles.badgeContainer, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeContent}>{badgeCount}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'transparent',
  },
  badgeContainer: {
    position: 'absolute',
    display: 'flex',
    right: 0,
    top: 0,
    borderRadius: 100,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: 9 }, { translateY: -5 }],
    //borderColor: '#212121',
    //borderWidth: 2
  },
  badgeContent: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Oxygen-Bold',
  },
});

export default IconBadge;
