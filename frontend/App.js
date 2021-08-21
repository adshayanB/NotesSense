import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import Home from './screens/Home';
import CameraScreen from './screens/CameraScreen';

const Stack = createStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Oxygen-Regular': require('./assets/fonts/Oxygen-Regular.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Oxygen-Bold': require('./assets/fonts/Oxygen-Bold.ttf'),
    'Inter-Light': require('./assets/fonts/Inter-Light.ttf'),
    'Oxygen-Light': require('./assets/fonts/Oxygen-Light.ttf'),
  });
  return (
    loaded && (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{
              // headerTransparent: false,
              headerBackground: () => (
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={['#5b86e5', '#36d1dc']}
                  style={styles.header}
                />
              ),
              headerTintColor: '#ffffff',
              headerTitleStyle: { fontFamily: 'Oxygen-Bold', fontSize: 18 },
              title: 'My Notes',
              headerLeft: null,
            }}
            name="Home"
            component={Home}
          ></Stack.Screen>
          <Stack.Screen
            options={{ headerShown: false }}
            name="CameraScreen"
            component={CameraScreen}
          ></Stack.Screen>
        </Stack.Navigator>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200,
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 2,
  },
});
