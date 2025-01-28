import {useEffect, useRef, useState} from 'react';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
  Dimensions,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/core';
import RNFS from 'react-native-fs';
import {Button, useTheme} from 'react-native-paper';

//import {BackHandler, View} from 'react-native';

const CAPTURE_BUTTON_SIZE = 78;
const BORDER_WIDTH = CAPTURE_BUTTON_SIZE * 0.1;

const CameraScreen = ({route}) => {
  const camera = useRef();
  const theme = useTheme();
  const devices = useCameraDevices();
  const isFocussed = useIsFocused();
  const navigation = useNavigation();

  const [device, setDevice] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const requiredCamera = route.params?.cameraDirection ?? 'back';

    if (devices[requiredCamera]) setDevice(devices[requiredCamera]);
    else {
      // select the first device available
      setDevice(Object.keys(devices)[0]);
    }
  }, [devices]);

  const takePhoto = async () => {
    camera.current.takePhoto().then(newPhoto => {
      const path =
        RNFS.DocumentDirectoryPath +
        '/documentphoto-' +
        new Date().getTime() +
        '.jpg';

      RNFS.moveFile(newPhoto.path, path).then(() => setPhoto(path));
    });
  };

  const acceptPhoto = () => {
    RNFS.readFile(photo, 'base64')
      .then(res => {
        DeviceEventEmitter.emit('event.image.captured', res);

        navigation.goBack();
      })
      .catch(err => console.log('Error reading photo file: ', err));
  };

  let {width, height} = Dimensions.get('window');

  return (
    <View style={{flex: 1}}>
      {device != null && !photo && (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isFocussed}
          photo={true}
          orientation="portrait"
        />
      )}

      <View
        style={{
          position: 'absolute',
          alignSelf: 'center',
          width: width * 2.8,
          height: width * 2.75,
          left: -(width * 0.9),
          top: -((width * width) / height),
          borderWidth: width,
          borderRadius: width * 1.02,
          borderColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />

      {device != null && !photo && (
        <TouchableOpacity
          onPress={takePhoto}
          style={{position: 'absolute', bottom: 20, alignSelf: 'center'}}>
          <View style={styles.button} />
        </TouchableOpacity>
      )}

      {device != null && photo && (
        <View style={StyleSheet.absoluteFill}>
          <Image
            style={{height: '100%', width: '100%'}}
            source={{uri: 'file://' + photo}}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Button
              onPress={() => setPhoto(null)}
              color={theme.colors.error}
              mode="contained"
              style={{flex: 1, borderRadius: 0}}>
              Reject
            </Button>
            <Button
              onPress={acceptPhoto}
              color={'green'}
              mode="contained"
              style={{flex: 1, borderRadius: 0}}>
              Accept
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  shadow: {
    position: 'absolute',
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    backgroundColor: '#e34077',
  },
  button: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: 'white',
  },
});
