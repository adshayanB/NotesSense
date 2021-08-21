import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import FloatingButton from "../components/floatingButton";
import PdfList from "../components/pdfList.js";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import CustomPopupAlert from "../components/custom-popup-alert";

const Home = ({ navigation }) => {
  const [updateList, setUpdateList] = useState(false);
  const [recording, setRecording] = useState();
  const [openRecorder, setOpenRecorder] = useState(false);
  const [sound, setSound] = useState();

  const sendAudio = async (fileName) => {
    const base64Audio = await FileSystem.readAsStringAsync(recording.getURI(), {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("BASE64");
    console.log(base64Audio);

    // let response;
    // let json;
    // const formData = FormData();
    // formData.append(blob, "audio");

    // response = await fetch("https://localhost:5000", {
    //   method: "POST",
    //   body: formData,
    // });

    // json = await response.json();
    // console.log(json);
  };

  const startRecording = async () => {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      //Initalize Recorder To Begin Recording
      const options = {
        android: {
          extension: ".wav",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".wav",
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };
      const { recording: recorder } = await Audio.Recording.createAsync(
        options
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
    sendAudio();
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
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
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
