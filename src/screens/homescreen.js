import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  BackHandler,
  View,
  SafeAreaView,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import WebView from 'react-native-webview';
import RNFetchBlob from 'react-native-fetch-blob';
import {
  DownloadDirectoryPath,
  DocumentDirectoryPath,
  writeFile,
} from 'react-native-fs';

import {getCameranGalleryPermissions} from '../components/permissionsDX';

import Splash from './splash';

const HomeScreen = () => {
  const webviewRef = useRef();
  const navigation = useNavigation();

  const [viewLoaded, setViewLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    DeviceEventEmitter.addListener('event.image.captured', eventData =>
      sendDataToWebView(eventData),
    );

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  const handleBackButton = async () => {
    const req = {key: 'GoBack'};
    sendDataToWebView(JSON.stringify(req));
    return true;
  };

  const sendDataToWebView = data => {
    console.log('sending message to web view:', data);
    console.log({webviewRef});

    webviewRef?.current?.postMessage(data);
  };

  const _messageFromSiteHandler = async event => {
    const {
      nativeEvent: {data},
    } = event;

    console.log('Data received from website: ', data);

    const eventData = JSON.parse(data);

    if (eventData.messageType === 'downloadblob') downloadFile(eventData.data);
    else if (eventData.messageType === 'call') makeCall(eventData.data);
    else if (eventData.messageType === 'email') openEmail(eventData.data);
    else if (eventData.messageType === 'camera')
      getCameranGalleryPermissions().then(() =>
        navigation.navigate('Camera', {
          cameraDirection: eventData.data,
        }),
      );
    else if (eventData.messageType === 'payment')
      navigation.navigate('Payment', {
        paymentCode: eventData.data,
        gotoDashboardFunc: sendDataToWebView,
      });
    else if (eventData.messageType === 'webpage')
      navigation.navigate('WebPageView', {
        url: eventData.data,
      });
  };

  const makeCall = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const openEmail = email => {
    Linking.openURL(`mailto:${email}`);
  };

  const downloadFile = async fileData => {
    var filePath = `/${fileData.filename}`;

    if (Platform.OS === 'ios') {
      const dirs = RNFetchBlob.fs.dirs;
      filePath = dirs.DocumentDir + filePath;
    } else filePath = DownloadDirectoryPath + filePath;

    //console.log({filePath});

    try {
      await writeFile(filePath, fileData.fileData, 'base64');
      Alert.alert(
        `${fileData.filename} downloaded successfully in downloads directory`,
      );
    } catch (e) {
      console.log(e);
      Alert.alert('Error downloading file. ' + e);
    }
  };

  const downloadFileOniOS = ({nativeEvent: {downloadUrl}}) => {
    console.log({downloadUrl});

    const dirs = RNFetchBlob.fs.dirs;
    const fileName = downloadUrl.split('/').pop();

    RNFetchBlob.config({path: dirs.DocumentDir + '/' + fileName})
      .fetch('GET', downloadUrl)
      .then(res => {
        const fileName = res.path().split('/').pop();

        console.log('The file saved to ', res.path());
        Alert.alert('File Saved', `The file ${fileName} has been downloaded`, [
          {text: 'OK'},
        ]);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#007A48'}}>
      {!viewLoaded && <Splash progress={loadProgress} />}
      <View style={{flex: viewLoaded ? 1 : 0}}>
        <WebView
          ref={webviewRef}
          source={{
            uri: 'https://amc.pakqatar.com.pk/',
            //uri: 'https://pqamc.ob.compass-dx.com/',
          }}
          javaScriptEnabled={true}
          cacheEnabled={false}
          setBuiltInZoomControls={false}
          onLoadProgress={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            setViewLoaded(nativeEvent.progress > 0.999);
            setLoadProgress(nativeEvent.progress);
          }}
          onMessage={_messageFromSiteHandler}
          onFileDownload={downloadFileOniOS}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
