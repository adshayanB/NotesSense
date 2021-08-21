import React from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import IconBadge from '../iconBadge/custom-iconBadge';
import CustomButton from '../button/custom-button';

const CustomPopupAlert = ({
  open,
  buttons,
  icon,
  iconSize,
  iconLibrary,
  color,
  title,
  description,
  renderComponent,
}) => {
  const windowHeight = Dimensions.get('window').height;

  const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const modalContainerClass = 'modalContainer' + capitalize('light');
  const textClass = 'text' + capitalize('light');

  return (
    <>
      <Modal animationType={'fade'} transparent={true} visible={open}>
        <View style={styles.modalOverlay}></View>
      </Modal>
      <Modal animationType={'slide'} transparent={true} visible={open}>
        <View
          style={[
            styles.modalContainer,
            styles[modalContainerClass],
            icon ? { paddingTop: 45 } : { paddingTop: 8 },
          ]}
        >
          {icon && (
            <>
              <View
                style={[
                  styles.iconWrapper,
                  { transform: [{ translateY: -(iconSize ?? 80) / 2 }] },
                ]}
              >
                <IconBadge
                  noTouchOpacity={true}
                  color={color}
                  size={iconSize ?? 80}
                  icon={icon}
                  library={iconLibrary}
                />
              </View>
              <View style={styles.backIconWrapper}>
                <IconBadge
                  noTouchOpacity={true}
                  color='#ffffff'
                  size={100}
                  icon={'circle'}
                />
              </View>
            </>
          )}
          {title && <Text style={[styles.textTitle, { color }]}>{title}</Text>}
          <Text style={[styles.text, styles[textClass]]}>{description}</Text>
          {renderComponent}
          <View style={styles.buttonWrapper}>
            {buttons.map((button) => {
              return (
                <View style={styles.button}>
                  <CustomButton
                    {...{
                      additionalStyling: [
                        button.additionalStyling,
                        { height: '100%' },
                      ],
                      ...button,
                    }}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  textTitle: {
    fontFamily: 'Oxygen-Bold',
    fontSize: 25,
    margin: 8,
    height: 30,
  },
  text: {
    fontFamily: 'Oxygen-Regular',
    fontSize: 16,
    margin: 8,
    flex: 1,
    textAlign: 'justify',
  },
  textDark: {
    color: '#ffffff',
  },
  textLight: {
    color: '#212121',
  },
  button: {
    margin: 8,
    flex: 1,
  },
  iconWrapper: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  backIconWrapper: {
    position: 'absolute',
    top: 0,
    transform: [{ translateY: -50 }],
    zIndex: 1,
  },
  buttonWrapper: {
    height: 65,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
    backgroundColor: '#000',
  },
  modalContainer: {
    width: '100%',
    left: 0,
    bottom: 0,
    position: 'absolute',
    flex: 1,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  modalContainerDark: {
    backgroundColor: '#212121',
  },
  modalContainerLight: {
    backgroundColor: '#ffffff',
  },
});

export default CustomPopupAlert;
