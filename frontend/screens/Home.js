import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FloatingButton from '../components/floatingButton';

const Home = () => {
  return (
    <View style={styles.actionsContainer}>
      <View>
        <FloatingButton
          icon="mic"
          library="Feather"
          size={70}
          onPress={() => console.log('button pressed')}
          style={styles.action}
        />
        <FloatingButton
          icon="scan1"
          library="AntDesign"
          size={70}
          onPress={() => console.log('button pressed')}
          style={styles.action}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    bottom: 15,
  },
  action: {
    marginVertical: 5,
  },
});

export default Home;
