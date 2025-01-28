import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

export const getCameranGalleryPermissions = async () => {
  await requestCameraPermission();
  await requestGalleryPermission();
};

const requestCameraPermission = async () => {
  try {
    let granted = '';

    if (Platform.OS == 'ios')
      return request(PERMISSIONS.IOS.CAMERA).then(response => {
        if (response == RESULTS.GRANTED) {
          console.log('You can use the camera');
          return true;
        } else {
          console.log('Camera permission status: ', granted);
        }
      });
    else
      return request(PERMISSIONS.ANDROID.CAMERA).then(response => {
        if (response == RESULTS.GRANTED) {
          console.log('You can use the camera');
          return true;
        } else {
          console.log('Camera permission status: ', granted);
          return false;
        }
      });
  } catch (error) {
    console.warn(error);
  }
};

const requestGalleryPermission = async () => {
  try {
    let granted = '';

    if (Platform.OS == 'ios')
      return request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(response => {
        console.log('request gallery response: ', {response});
        if (response == RESULTS.GRANTED) {
          console.log('You can use the gallery');
          return true;
        } else {
          console.log('Gallery permission status: ', granted);
          return false;
        }
      });
    else
      return request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(
        response => {
          console.log('request gallery response: ', {response});
          if (response == RESULTS.GRANTED) {
            console.log('You can use the gallery');
            return true;
          } else {
            console.log('Gallery permission status: ', granted);
            return false;
          }
        },
      );
  } catch (error) {
    console.warn(error);
  }
};
