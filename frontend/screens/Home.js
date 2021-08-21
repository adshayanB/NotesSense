import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FloatingButton from '../components/floatingButton';
import PdfList from '../components/pdfList.js';

const Home = ({ navigation }) => {
  const [updateList, setUpdateList] = useState(false);
  return (
    <View style={styles.mainContainer}>
      <PdfList updateList={updateList} />
      <View style={styles.actionsContainer}>
        <FloatingButton
          icon="mic"
          library="Feather"
          size={70}
          style={styles.action}
        />
        <FloatingButton
          icon="camera"
          library="Feather"
          size={70}
          onPress={() =>
            navigation.navigate('CameraScreen', { updateList, setUpdateList })
          }
          style={styles.action}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    bottom: 15,
    zIndex: 2,
  },
  action: {
    marginVertical: 5,
  },
});

export default Home;
