import {GoogleSignin} from '@react-native-community/google-signin';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Button} from 'react-native-elements';
import Media from '../../../Common/Media';
import Strings from '../../../Common/Strings';
import ThemeContext from '../../../Context/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import RouteNames from '../../../Navigation/RouteNames';

GoogleSignin.configure({
  webClientId:
    '9883205350-j5eett20f96qclub73slptc7rc1th3g3.apps.googleusercontent.com',
  offlineAccess: true,
});

const GoogleAuthButton: React.FC<{}> = () => {
  const navigation = useNavigation();

  const googleLogin = async () => {
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    return auth().signInWithCredential(googleCredential);
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Button
          type={'outline'}
          buttonStyle={{...styles.button}}
          title={Strings.ContinueGoogle}
          icon={<Image source={Media.Google} style={styles.iconStyle} />}
          titleStyle={[styles.titleStyle, theme.text.callout]}
          onPress={() =>
            googleLogin().then(() => navigation.navigate(RouteNames.Tab))
          }
        />
      )}
    </ThemeContext.Consumer>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  iconStyle: {
    aspectRatio: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  titleStyle: {
    color: 'black',
  },
});

export default GoogleAuthButton;
