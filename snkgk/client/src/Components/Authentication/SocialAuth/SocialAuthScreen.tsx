import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Media from '../../../Common/Media';
import {Icon} from 'react-native-elements';
import ThemeContext from '../../../Context/ThemeContext';
import FacebookAuthButton from './FacebookAuthButton';
import GoogleAuthButton from './GoogleAuthButton';
import AppleAuthButton from './AppleAuthButton';
import RouteNames from '../../../Navigation/RouteNames';
import {AppText} from '../../Shared/AppText';
import Strings from '../../../Common/Strings';

const GoToEmailButton = () => {
  const navigation = useNavigation();
  return (
    <AppText.Subhead
      style={styles.emailLoginStyle}
      onPress={(): void => {
        navigation.navigate(RouteNames.EmailLogin);
      }}>
      {Strings.MemberAlready}{' '}
      <AppText.Callout>{Strings.EmailLogin}</AppText.Callout>
    </AppText.Subhead>
  );
};

const SocialAuthScreen: React.FC<{}> = () => {
  const navigation = useNavigation();
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <ImageBackground
          source={Media.LoginBackground}
          style={styles.imageContainer}>
          <SafeAreaView style={styles.mainContainer}>
            <View style={styles.contentContainer}>
              <TouchableOpacity style={styles.closeButton}>
                <Icon
                  name={'close'}
                  size={theme.icon.size}
                  color={'white'}
                  onPress={() => navigation.goBack()}
                />
              </TouchableOpacity>
              <View style={styles.socialButtonContainer}>
                <FacebookAuthButton />
                <GoogleAuthButton />
                <AppleAuthButton />
                <GoToEmailButton />
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      )}
    </ThemeContext.Consumer>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 15,
  },
  socialButtonContainer: {
    paddingHorizontal: 20,
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  emailLoginStyle: {
    marginTop: 10,
    textAlign: 'center',
    color: 'black',
  },
});

export default SocialAuthScreen;
