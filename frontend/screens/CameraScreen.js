import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import IconBadge from "../components/custom-iconBadge";
import FloatingButton from "../components/floatingButton";
import CustomPopupAlert from "../components/custom-popup-alert";
import Toast from "react-native-toast-message";
import CustomInputBox from "../components/custom-inputBox";
import * as FileSystem from "expo-file-system";
import { GestureHandlerRefContext } from "@react-navigation/stack";

const CameraScreen = ({ navigation, route }) => {
  //  camera permissions
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  // Screen Ratio and image padding
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState("4:3"); // default is 4:3
  const { height, width } = Dimensions.get("window");
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);
  const [picture, setPicture] = useState(null);
  const [showPicture, setShowPicture] = useState(false);
  const [allPictures, setAllPictures] = useState([]);

  const [confirmRetake, setConfirmRetake] = useState(false);
  const [moreNotes, setMoreNotes] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);

  const [showFetchLoading, setShowFetchLoading] = useState(false);
  const [captureLoading, setCaptureLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [filename, setFilename] = useState("");

  // on screen  load, ask for permission to use the camera
  useEffect(() => {
    async function getCameraStatus() {
      const { status } = await Camera.requestPermissionsAsync();
      setHasCameraPermission(status == "granted");
    }
    getCameraStatus();
  }, []);

  // set the camera ratio and padding.
  // this code assumes a portrait mode screen
  const prepareRatio = async () => {
    let desiredRatio = "4:3"; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === "android") {
      const ratios = await camera.getSupportedRatiosAsync();

      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(":");
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
      setCaptureLoading(true);
      let photo = await camera.takePictureAsync({ base64: true });
      setPicture(photo);
      setShowPicture(true);
      setCaptureLoading(false);
    }
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

  const handleRepeat = () => {
    setConfirmRetake(true);
  };

  const handleNext = () => {
    setAllPictures([...allPictures, picture]);
    setMoreNotes(true);
  };

  const handleSubmit = async () => {
    setShowFetchLoading(true);
    // POST allPictures to the API
    let response;
    let json;

    response = await fetch("http://192.168.2.191:5000" + "/sendNotes/OCR", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        toEmail: email,
        fileName: filename,
        imageArray: allPictures.map((picture) => picture.base64),
      }),
    });

    json = await response.json();

    if (json.output) {
      let pdfLocation =
        FileSystem.documentDirectory + `${encodeURI(filename)}.pdf`;
      await FileSystem.writeAsStringAsync(pdfLocation, json.output, {
        encoding: FileSystem.EncodingType.Base64,
      });
      Toast.show({
        text1: "Converted notes!",
        text2: "Successfully converted notes to a PDF",
        type: "success",
      });
      navigation.navigate("Home");
    } else {
      Toast.show({
        text1: "Error!",
        text2: "Something went wrong :(",
        type: "error",
      });
    }
    route.params.setUpdateList(!route.params.updateList);
    setShowFetchLoading(false);
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
            <View
              style={{
                width,
                height:
                  (width * parseInt(ratio.split(":")[0])) /
                  parseInt(ratio.split(":")[1]),
              }}
            >
              <Camera
                style={[styles.cameraPreview]}
                onCameraReady={setCameraReady}
                ratio={ratio}
                zoom={0}
                ref={(ref) => {
                  setCamera(ref);
                }}
              ></Camera>
            </View>
            <View style={styles.pictureIcon}>
              {!captureLoading && (
                <IconBadge
                  icon="circle"
                  library="FontAwesome"
                  color="#ffffff"
                  size={90}
                  onPress={takePicture}
                />
              )}
              {captureLoading && (
                <View style={{ position: "relative" }}>
                  <ActivityIndicator size={90} color="#ffffff" />
                </View>
              )}
            </View>
          </>
        )}
        {showPicture && (
          <>
            <Image
              style={{
                width,
                height:
                  (width * parseInt(ratio.split(":")[0])) /
                  parseInt(ratio.split(":")[1]),
              }}
              source={{ uri: picture.uri }}
            />
            <View style={styles.actionsContainer}>
              <FloatingButton
                icon="repeat"
                library="FontAwesome"
                size={70}
                onPress={() => handleRepeat()}
                style={styles.action}
              />
              <FloatingButton
                icon="arrowright"
                library="AntDesign"
                size={70}
                onPress={() => handleNext()}
                style={styles.action}
              />
            </View>
            <CustomPopupAlert
              open={confirmRetake}
              title="Confirm Retake"
              description="Are you sure you want to retake this picture?"
              buttons={[
                {
                  text: "No",
                  type: "outlined",
                  onPress: () => {
                    setConfirmRetake(false);
                  },
                },
                {
                  text: "Yes",
                  type: "emphasized",
                  onPress: () => {
                    setShowPicture(false);
                    setConfirmRetake(false);
                  },
                },
              ]}
            />
            <CustomPopupAlert
              open={moreNotes}
              title="More Notes?"
              description="Would you like to add another page of notes to this document?"
              buttons={[
                {
                  text: "No",
                  type: "outlined",
                  onPress: () => {
                    setMoreNotes(false);
                    setSubmitForm(true);
                  },
                },
                {
                  text: "Yes",
                  type: "emphasized",
                  onPress: () => {
                    setShowPicture(false);
                    setMoreNotes(false);
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
                    setSubmitForm(false);
                    handleSubmit();
                  },
                },
              ]}
            />
          </>
        )}
        {showFetchLoading && (
          <View style={styles.backDrop}>
            <ActivityIndicator size={70} color="#36d1dc" />
          </View>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    paddingHorizontal: 8,
  },
  information: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  cameraPreview: {
    flex: 1,
  },
  pictureIcon: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: [{ translateX: -35 }],
    zIndex: 10,
  },
  actionsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 20,
    bottom: 15,
    zIndex: 1,
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
});

export default CameraScreen;
