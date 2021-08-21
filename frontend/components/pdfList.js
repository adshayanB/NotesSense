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
  ]);

  const renderFiles = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
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

  if(people.length > 0 ) {
    return (
      <FlatList
        numColumns={2}
        columnWrapperStyle={styles.row}
        keyExtractor={(item) => item.id}
        data={people}
        renderItem={renderFiles}
        style={styles.container}
      />
    );
  } else {
    return(
      <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Notes So Far :(</Text>
      </View>
    )
  }
    
};

export default PdfList;

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: "#e0e0e0",
    height: 200,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0.5,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  row: {
      justifyContent: "space-evenly"
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
    backgroundColor: "#fff",
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  emptyNotes: {
    flex: 1,
    display: "flex",
  }
});
