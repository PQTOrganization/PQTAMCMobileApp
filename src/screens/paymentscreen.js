import {useState} from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import WebView from 'react-native-webview';
import {ActivityIndicator, useTheme} from 'react-native-paper';

const PaymentScreen = ({route}) => {
  //const url = 'staging-ipg.blinq.pk/Home/PayInvoice';
  const url = 'ipg.blinq.pk/Home/PayInvoice';

  const navigation = useNavigation();
  const theme = useTheme();

  const [paymentCode] = useState(route.params.paymentCode); //'02560000203';

  const _messageFromSiteHandler = async event => {
    const {
      nativeEvent: {data},
    } = event;

    console.log('Data received from website: ', data);

    const eventData = JSON.parse(data);

    if (eventData.messageType === 'gotodashboard') {
      route.params.gotoDashboardFunc('{}');
      navigation.goBack();
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      {paymentCode && (
        <WebView
          source={{
            uri: `https://${url}?pcode=${paymentCode}`,
            headers: {
              Referer: 'https://amc.pakqatar.com.pk/',
            },
          }}
          javaScriptEnabled={true}
          cacheEnabled={false}
          setBuiltInZoomControls={false}
          onMessage={_messageFromSiteHandler}
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
      )}
    </View>
  );
};

export default PaymentScreen;
