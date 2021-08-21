import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";

const PdfList = ({ list }) => {
  const [people, setPeople] = useState([
    { name: "shaun", id: "1" },
    { name: "yoshi", id: "2" },
    { name: "mario", id: "3" },
    { name: "luigi", id: "4" },
    { name: "peach", id: "5" },
    { name: "toad", id: "6" },
    { name: "bowser", id: "7" },
    { name: "shaun", id: "8" },
    { name: "yoshi", id: "9" },
    { name: "mario", id: "10" },
    { name: "luigi", id: "11" },
    { name: "peach", id: "12" },
    { name: "toad", id: "13" },
    { name: "bowser", id: "14" },
  ]);

  const renderFiles = ({ item }) => {
    return (
      <View style={styles.item}>
        <Image
          style={styles.fileImage}
          source={require("../assets/favicon.png")}
        />
        <View style={styles.textContainer}>
          <Text style={styles.fileText}>{item.name}</Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      numColumns={2}
      keyExtractor={(item) => item.id}
      data={people}
      renderItem={renderFiles}
      style={styles.container}
    />
  );
};

export default PdfList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 8,
    backgroundColor: "#b2ebf2",
    height: 200,
    borderRadius: 12,
  },
  fileImage: {
    width: "100%",
    flex: 5,
    resizeMode: "stretch",
  },
  fileText: {
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#eee",
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
});
