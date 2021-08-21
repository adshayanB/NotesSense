import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import FloatingButton from '../components/floatingButton';
import PdfList from '../components/pdfList.js';
import { Audio } from "expo-av";
import CustomPopupAlert from "../components/custom-popup-alert";

const Home = ({ navigation }) => {
  const [updateList, setUpdateList] = useState(false);
  const [recording, setRecording] = useState();
  const [openRecorder, setOpenRecorder] = useState(false);
  const [sound, setSound] = useState();

  const startRecording = async () => {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      //Initalize Recorder To Begin Recording
      const { recording: recorder } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      setRecording(recorder);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    //End Recording Session and Store
    //setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
  };

  const sendAudio = async (blob, fileName) => {
    let response;
    let json;
    const formData = FormData();
    formData.append(blob, "audio");

    response = await fetch("https://localhost:5000", {
      method: "POST",
      body: formData,
    });

    json = await response.json();
    console.log(json);
  };

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      { uri: recording.getURI() },
      {
        shouldPlay: true,
      }
    );
    //await sound.setPositionAsync(0);
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  return (
    <View style={styles.mainContainer}>
      <PdfList updateList={updateList} />
      <View style={styles.actionsContainer}>
        <FloatingButton
          icon="mic"
          library="Feather"
          size={70}
          onPress={() => setOpenRecorder(true)}
          style={styles.action}
        />
        <FloatingButton
          icon="camera"
          library="Feather"
          size={70}
          onPress={() => playSound()}
          style={styles.action}
        />
      </View>
      <CustomPopupAlert
        open={openRecorder}
        title="Record Audio"
        buttons={[
          {
            text: "Stop",
            type: "outlined",
            onPress: () => {
              stopRecording();
              setOpenRecorder(false);
            },
          },
          {
            text: "Start",
            type: "emphasized",
            onPress: () => {
              startRecording();
            },
          },
        ]}
      />
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 20,
    bottom: 15,
    zIndex: 2,
  },
  action: {
    marginVertical: 5,
  },
});

export default Home;
