import {ImageBackground, View, Text} from 'react-native';
import {ProgressBar} from 'react-native-paper';

import BgImage from '../assets/app_background.png';

const PaymentSplash = props => {
  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: '#FFFFFF',
      }}>
      <ImageBackground
        source={BgImage}
        resizeMode="cover"
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Redirecting to Payment Gatway
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            marginVertical: 16,
            color: 'red',
          }}>
          Don't press the back button
        </Text>
        <ProgressBar
          progress={props.progress}
          style={{width: 200, zIndex: 10000}}
        />
      </ImageBackground>
    </View>
  );
};

export default PaymentSplash;
