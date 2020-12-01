import React from 'react';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import Strings from '../../../Common/Strings';
import {useNavigation} from '@react-navigation/native';
import RouteNames from '../../../Navigation/RouteNames';
import {Image, StyleSheet} from 'react-native';
import Media from '../../../Common/Media';
import {Button} from 'react-native-elements';
import ThemeContext from '../../../Context/ThemeContext';

const AppleAuthButton: React.FC<{}> = () => {
  const navigation = useNavigation();
  const onAppleButtonPress = async () => {
    const response = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    if (!response.identityToken) {
      // throw
    }

    const {identityToken, nonce} = response;
    const appleCred = auth.AppleAuthProvider.credential(identityToken, nonce);

    return auth().signInWithCredential(appleCred);
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Button
          type={'outline'}
          buttonStyle={styles.button}
          title={Strings.ContinueApple}
          icon={
            <Image
              source={Media.Apple}
              style={[
                styles.iconStyle,
                {width: theme.icon.size * 0.75, height: theme.icon.size * 0.75},
              ]}
            />
          }
          titleStyle={[styles.titleStyle, theme.text.callout]}
          onPress={() => {
            onAppleButtonPress().then(() =>
              navigation.navigate(RouteNames.Tab),
            );
          }}
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

export default AppleAuthButton;
