import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {strings, themes} from 'resources';
import {AppText, BottomButton, WrongInputError} from 'screens/Shared';
import {isValidEmail} from 'utilities';
import {useNavigation} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/auth';
import RouteNames from 'navigations/RouteNames';
import {StackActions} from '@react-navigation/native';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flex: 1,
    paddingHorizontal: 16,
  },
  buttonStyle: {
    backgroundColor: themes.AppSecondaryColor,
    borderRadius: 30,
    marginBottom: 44,
  },
  fillInEmailStyle: {
    marginTop: 40,
  },
  emailHeader: {
    marginTop: 57,
  },
  input: {
    ...themes.TextStyle.callout,
    flex: 1,
  },
  inputContainer: {
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    marginVertical: 5,
  },
});

const resetPassword = async (email: string) => {
  try {
    await firebase.auth().sendPasswordResetEmail(email);
  } catch (error) {
    console.log(error);
  }
};

export const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const navigation = useNavigation();

  const onPressHandler = (email: string): void => {
    if (isValidEmail(email)) {
      setError(false);
      resetPassword(email);
      navigation.dispatch(
        StackActions.replace(RouteNames.Auth.ForgotPasswordEmailSent, {email}),
      );
    } else {
      setError(true);
    }
  };

  return (
    <View style={styles.root}>
      <AppText.Body style={styles.fillInEmailStyle}>
        {strings.FillInEmail}
      </AppText.Body>
      <AppText.Body style={styles.emailHeader}>
        {strings.EmailHeader}
      </AppText.Body>
      <View style={styles.inputContainer}>
        <TextInput
          testID={'EmailSignUpInput'}
          autoFocus={true}
          style={styles.input}
          placeholderTextColor={themes.AppDisabledColor}
          placeholder={strings.Email}
          value={email}
          onChangeText={(email) => setEmail(email)}
          selectionColor={themes.AppSecondaryColor}
          autoCapitalize={'none'}
        />
      </View>
      {error && <WrongInputError errorDescription={strings.NotEmailType} />}
      <BottomButton
        style={styles.buttonStyle}
        title={strings.Confirm}
        onPress={() => onPressHandler(email)}
      />
    </View>
  );
};
