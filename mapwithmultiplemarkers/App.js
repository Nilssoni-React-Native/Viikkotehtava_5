import { StatusBar } from 'expo-status-bar';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';
import Map from './screens/Map';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import MainAppBar from './components/MainAppBar';
import * as Location from 'expo-location';

const settings = {
  backgroundColor: '#00a484'
}

const icons = {
  location_not_known: 'crosshairs',
  location_searching: 'crosshairs-question',
  location_found: 'crosshairs-gps'
}

export default function App() {
  const [icon, setIcon] = useState(icons.location_not_known);
  const [location, setLocation] = useState({
    latitude: 65.0800,
    longitude: 25.4800,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  });

  const getUserPosition = async (currentLocation) => {
      setIcon(icons.location_searching);

      let {status} = await Location.requestForegroundPermissionsAsync();
      
      try {
          if (status !== 'granted') {
              console.log('Permission to access location was denied');
              return;
          }

          const position = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High})
          
          setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: currentLocation.latitudeDelta || 0.01,
              longitudeDelta: currentLocation.longitudeDelta || 0.01
          });

          setIcon(icons.location_found);
      } catch (error) {
          console.log("Error getting location:", error);
      }
  };

  useEffect(() => {
    const requestPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      getUserPosition(location);
    }
    requestPermission();
  }, []);  

  return (
    <PaperProvider>
      <MainAppBar 
        title="Map"
        backgroundColor={settings.backgroundColor}
        icon={icon}
        getUserPosition={() => getUserPosition(location)}
      />
      <SafeAreaView style={styles.container}>
        <Map location={location} />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0
  },
});
