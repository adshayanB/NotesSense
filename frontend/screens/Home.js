import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import FloatingButton from "../components/floatingButton";
import PdfList from "../components/pdfList.js";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import CustomPopupAlert from "../components/custom-popup-alert";
import Toast from "react-native-toast-message";

const Home = ({ navigation }) => {
  const [updateList, setUpdateList] = useState(false);
  const [recording, setRecording] = useState();
  const [openRecorder, setOpenRecorder] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);
  const [email, setEmail] = useState("");
  const [filename, setFilename] = useState("");
  const [showFetchLoading, setShowFetchLoading] = useState(false);

  const sendAudio = async () => {
    setShowFetchLoading(true);
    let response;
    let json;
    const base64Audio = await FileSystem.readAsStringAsync(recording.getURI(), {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("BASE64");
    console.log(base64Audio);
    response = await fetch("https://localhost:5000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        toEmail: email,
        fileName: filename,
        audioBlob: base64Audio,
      }),
    });

    json = await response.json();

    if (json.message !== "Please Record again") {
      let pdfLocation =
        FileSystem.documentDirectory + `${encodeURI(filename)}.pdf`;
      await FileSystem.writeAsStringAsync(pdfLocation, json.message, {
        encoding: FileSystem.EncodingType.Base64,
      });
      Toast.show({
        text1: "Converted notes!",
        text2: "Successfully converted audio to a PDF",
        type: "success",
      });
    } else {
      Toast.show({
        text1: "Error!",
        text2: "Please record again :(",
        type: "error",
      });
    }
    setSubmitForm(false);
    setShowFetchLoading(false);
    setUpdateList(!updateList);
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
    setOpenRecorder(false);
    setSubmitForm(true);
  };

  const inputForm = () => {
    return (
      <View style={styles.inputContainer}>
        <View style={{ marginVertical: 8 }}>
          <CustomInputBox
            field="Email"
            placeholder="Enter your email"
            onChange={setEmail}
            value={email}
          />
        </View>
        <View style={{ marginVertical: 8 }}>
          <CustomInputBox
            field="Filename"
            placeholder="Enter a filename"
            onChange={setFilename}
            value={filename}
          />
        </View>
      </View>
    );
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
      <PdfList updateList={updateList} navigation={navigation} />
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
          onPress={() =>
            navigation.navigate("CameraScreen", { updateList, setUpdateList })
          }
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

      <CustomPopupAlert
        open={submitForm}
        title="Document Details"
        renderComponent={inputForm()}
        buttons={[
          {
            text: "Cancel",
            type: "outlined",
            onPress: () => {
              setSubmitForm(false);
            },
          },
          {
            text: "Convert",
            type: "emphasized",
            onPress: () => {
              sendAudio();
            },
          },
        ]}
      />
      {showFetchLoading && (
        <View style={styles.backDrop}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#5b86e5", "#36d1dc"]}
            style={styles.loadingPDF}
          >
            <Image source={Loading} style={styles.loading} />
          </LinearGradient>
          {/* <ActivityIndicator size={70} color="#36d1dc" /> */}
        </View>
      )}
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
  backDrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000cc",
    zIndex: 2,
  },
  loading: {
    position: "relative",
    transform: [{ translateX: 20 }],
  },
  loadingPDF: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
