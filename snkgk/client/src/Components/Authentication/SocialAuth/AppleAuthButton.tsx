import React from 'react';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';

const AppleAuthButton: React.FC<{}> = () => {
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
    <AppleButton
      buttonStyle={AppleButton.Style.WHITE}
      buttonType={AppleButton.Type.CONTINUE}
      style={{width: 160, height: 45}}
      onPress={() => onAppleButtonPress().then(() => {})}
    />
  );
};

export default AppleAuthButton;
