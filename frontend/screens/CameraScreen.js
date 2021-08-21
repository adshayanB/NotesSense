import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { Camera } from 'expo-camera';
import IconBadge from '../components/custom-iconBadge';

const CameraScreen = ({ navigation }) => {
  //  camera permissions
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  // Screen Ratio and image padding
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState('4:3'); // default is 4:3
  const { height, width } = Dimensions.get('window');
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);
  const [picture, setPicture] = useState(null);
  const [showPicture, setShowPicture] = useState(false);
  const [allPictures, setAllPictures] = useState([]);

  // on screen  load, ask for permission to use the camera
  useEffect(() => {
    async function getCameraStatus() {
      const { status } = await Camera.requestPermissionsAsync();
      setHasCameraPermission(status == 'granted');
    }
    getCameraStatus();
  }, []);

  // set the camera ratio and padding.
  // this code assumes a portrait mode screen
  const prepareRatio = async () => {
    let desiredRatio = '4:3'; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === 'android') {
      const ratios = await camera.getSupportedRatiosAsync();

      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(':');
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        // ratio can't be taller than screen, so we don't want an abs()
        const distance = screenRatio - realRatio;
        distances[ratio] = realRatio;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }
      // set the best match
      desiredRatio = minDistance;
      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      );
      // set the preview padding and preview ratio
      setImagePadding(remainder / 2);
      setRatio(desiredRatio);
      // Set a flag so we don't do this
      // calculation each time the screen refreshes
      setIsRatioSet(true);
    }
  };

  // the camera must be loaded in order to access the supported ratios
  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  const takePicture = async () => {
    if (camera) {
      let photo = await camera.takePictureAsync({ base64: true });
      setPicture(photo);
      setShowPicture(true);
    }
  };

  if (hasCameraPermission === null) {
    return (
      <View style={styles.information}>
        <Text>Waiting for camera permissions</Text>
      </View>
    );
  } else if (hasCameraPermission === false) {
    return (
      <View style={styles.information}>
        <Text>No access to camera</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {!showPicture && (
          <>
            <Camera
              style={[
                styles.cameraPreview,
                { marginTop: imagePadding, marginBottom: imagePadding },
              ]}
              onCameraReady={setCameraReady}
              ratio={ratio}
              zoom={0}
              ref={(ref) => {
                setCamera(ref);
              }}
            ></Camera>
            <View style={styles.pictureIcon}>
              <IconBadge
                icon="circle"
                library="FontAwesome"
                color="#ffffff"
                size={90}
                onPress={takePicture}
              />
            </View>
          </>
        )}
        {showPicture && (
          <Image
            style={{ width: picture.width, height: picture.height }}
            source={{ uri: picture.uri }}
          />
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  information: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  cameraPreview: {
    flex: 1,
  },
  pictureIcon: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{ translateX: -35 }],
    zIndex: 10,
  },
});

export default CameraScreen;
