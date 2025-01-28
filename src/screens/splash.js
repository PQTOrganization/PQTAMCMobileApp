import React from 'react';
import {Image, ImageBackground, View} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import FadeInViewDX from '../components/fadeinviewdx';
import BgImage from '../assets/app_background.png';

const Splash = props => {
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
        }}>
        <FadeInViewDX
          style={{
            width: '100%',
            alignItems: 'center',
            margin: 16,
          }}>
          <Image
            source={require('../assets/pqamc_trans_logo.png')}
            resizeMode="contain"
            style={{height: 200}}
          />
        </FadeInViewDX>
        <ProgressBar
          progress={props.progress}
          style={{width: 200, zIndex: 10000}}
        />
      </ImageBackground>
    </View>
  );
};

export default Splash;
