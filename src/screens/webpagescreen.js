import React, {useState} from 'react';
import {View, SafeAreaView, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import WebView from 'react-native-webview';
import {ActivityIndicator, IconButton, useTheme} from 'react-native-paper';
import RNFetchBlob from 'react-native-fetch-blob';

const WebPageScreen = ({route}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [url] = useState(route.params.url);

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
      <View style={{flex: 1}}>
        <View
          style={{justifyContent: 'space-between', backgroundColor: 'white'}}>
          <IconButton icon="close" onPress={() => navigation.goBack()} />
        </View>
        <WebView
          source={{uri: url}}
          javaScriptEnabled={true}
          cacheEnabled={false}
          setBuiltInZoomControls={false}
          onFileDownload={downloadFileOniOS}
          startInLoadingState={true}
          renderLoading={() => (
            <ActivityIndicator
              style={{
                position: 'absolute',
                alignSelf: 'center',
                top: 200,
              }}
              color={theme.colors.primary}
              size="large"
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default WebPageScreen;
