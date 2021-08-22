import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import PDFReader from "rn-pdf-reader-js";

const PDFReaderScreen = ({ navigation, route }) => {
  useEffect(() => {
    if (route.params.name) {
      navigation.setOptions({
        title: route.params.name,
      });
    }
  }, [route.params.name]);

  return (
    <PDFReader
      source={{
        uri: route.params.path,
      }}
    />
  );
};

const styles = StyleSheet.create({});

export default PDFReaderScreen;
