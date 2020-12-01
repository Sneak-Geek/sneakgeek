import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import Media from '../../../Common/Media';
import Strings from '../../../Common/Strings';
import ThemeContext from '../../../Context/ThemeContext';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {useNavigation} from '@react-navigation/native';
import RouteNames from '../../../Navigation/RouteNames';

const FacebookAuthButton: React.FC<{}> = () => {
  const navigation = useNavigation();
  const facebookLogin = async () => {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    return auth().signInWithCredential(facebookCredential);
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Button
          type={'solid'}
          title={Strings.ContinueFacebook}
          icon={<Image source={Media.Facebook} style={styles.iconStyle} />}
          titleStyle={[styles.titleStyle, theme.text.callout]}
          buttonStyle={{
            backgroundColor: theme.color.FacebookThemeColor,
            ...styles.button,
          }}
          onPress={() =>
            facebookLogin().then(() => navigation.navigate(RouteNames.Tab))
          }
        />
      )}
    </ThemeContext.Consumer>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  titleStyle: {
    color: 'white',
  },
  iconStyle: {
    aspectRatio: 1,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default FacebookAuthButton;
