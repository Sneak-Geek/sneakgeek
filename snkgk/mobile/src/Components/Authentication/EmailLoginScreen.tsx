import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RouteNames from '../../Navigation/RouteNames';
import ThemeContext from '../../Context/ThemeContext';
import Strings from '../../Common/Strings';
import {BottomButton} from '../Shared/BottomButton';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {updateUser, User} from '../../Redux/UserSlice';
import {AppText} from '../Shared/AppText';

const Input: React.FC<{
  value: string;
  contentType: 'emailAddress' | 'password';
  onChangeText: (text: string) => void;
  placeholder: string;
}> = ({value, contentType, onChangeText, placeholder}) => {
  const theme = useContext(ThemeContext);
  return (
    <View style={styles.inputContainer}>
      <TextInput
        autoFocus={true}
        style={[styles.input, theme.text.callout]}
        placeholder={placeholder}
        value={value}
        textContentType={contentType}
        onChangeText={onChangeText}
        selectionColor={theme.color.brandColorPrimary}
        autoCapitalize={'none'}
        secureTextEntry={contentType === 'password'}
      />
    </View>
  );
};

const EmailLogin: React.FC<{}> = () => {
  const theme = useContext(ThemeContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch();

  const login = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((value) => {
        const user = value.user.toJSON() as User;

        dispatch(updateUser(user));
        navigation.navigate(RouteNames.Tab);
      })
      .catch((e) => {
        console.log('Error', e);
      });
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: theme.color.backgroundColor},
      ]}>
      <KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
        <View style={styles.contentContainer}>
          <AppText.Body style={styles.welcomeText}>
            {Strings.EmailLoginWelcome}
          </AppText.Body>
          <Input
            placeholder={Strings.Email}
            value={email}
            contentType={'emailAddress'}
            onChangeText={setEmail}
          />
          <Input
            placeholder={Strings.Password}
            value={password}
            contentType={'password'}
            onChangeText={setPassword}
          />
          <BottomButton
            title={'Login'}
            onPress={login}
            style={{backgroundColor: theme.color.brandColorPrimary}}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  welcomeText: {
    marginHorizontal: 40,
    marginVertical: 10,
  },
  title: {
    lineHeight: 25,
    textAlign: 'left',
    paddingLeft: 42,
  },
  inputContainer: {
    marginHorizontal: 40,
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    marginVertical: 5,
  },
  input: {
    flex: 1,
  },
  forgotContainer: {
    marginTop: 25,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default EmailLogin;
