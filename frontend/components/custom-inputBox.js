import React from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';

const CustomInputBox = (props) => {
  const {
    field,
    placeholder,
    value,
    onChange,
    secureTextEntry,
    additionalStyling,
  } = props;

  const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const theme = 'light';
  const textClass = 'text' + theme;
  const containerClass = 'container' + theme;
  const fieldClass = 'field' + theme;

  return (
    <View style={[styles.container, styles[containerClass]]}>
      {field != null ? (
        <Text style={[styles[fieldClass], styles.fieldText]}>
          {capitalize(field)}
        </Text>
      ) : (
        <></>
      )}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        placeholderTextColor={'#404040'}
        style={[styles.inputText, styles[textClass], additionalStyling]}
        underlineColorAndroid="transparent"
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    width: '100%',
  },
  containerDark: {
    borderBottomColor: '#ffffff',
  },
  containerLight: {
    borderBottomColor: '#212121',
  },
  inputText: {
    fontFamily: 'Oxygen-Light',
    fontSize: 18,
    paddingBottom: 5,
  },
  textDark: {
    color: '#ffffff',
  },
  textLight: {
    color: '#212121',
  },
  fieldText: {
    fontFamily: 'Oxygen-Light',
    fontSize: 12,
  },
  fieldDark: {
    color: '#D1D1D1',
  },
  fieldLight: {
    color: '#404040',
  },
});
export default CustomInputBox;
