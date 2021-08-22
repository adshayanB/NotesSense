import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import * as FileSystem from "expo-file-system";

const PdfList = (props) => {
  const { updateList } = props;
  const [docList, setDocList] = useState([]);

  const getAllFilesInDirectory = async () => {
    let tempList = [];
    //get expo document directory
    let dir = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory,
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    );
    // console.log(dir);
    //for each item in the dir, append it to the docList state
    dir.forEach((file) => {
      tempList.push({
        path: FileSystem.documentDirectory + file,
        name: file,
      });
    });

    setDocList(tempList);
    // console.log(tempList);
  };

  // on screen  load all the pdf files saved on device
  useEffect(() => {
    getAllFilesInDirectory();
  }, [updateList]);

  const renderFiles = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => openPDFViewer(item)}
      >
        <View style={styles.fileImage} />
        <View style={styles.textContainer}>
          <Text style={styles.fileText} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const openPDFViewer = (item) => {
    console.log("pdf clicked: " + item.name);
  };

  if (docList.length > 0) {
    return (
      <FlatList
        numColumns={2}
        columnWrapperStyle={styles.row}
        keyExtractor={(item) => item.name}
        data={docList}
        renderItem={renderFiles}
        style={styles.container}
      />
    );
  } else {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No Notes So Far :(</Text>
      </View>
    );
  }
};

export default PdfList;

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 25,
    color: "#9e9e9e",
  },
  itemContainer: {
    flex: 0.5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 8,
    backgroundColor: "#eee",
    height: 200,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0.5,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  row: {
    justifyContent: "space-evenly",
  },
  fileImage: {
    width: "100%",
    flex: 5,
    resizeMode: "stretch",
  },
  fileText: {
    fontSize: 15,
    overflow: "hidden",
    paddingHorizontal: 12,
  },
  textContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  emptyNotes: {
    flex: 1,
    display: "flex",
  },
});
