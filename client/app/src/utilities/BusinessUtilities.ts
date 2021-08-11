import {
  ObjectFactory,
  ISettingsProvider,
  FactoryKeys,
  SettingsKey,
} from 'business';

import { firebase } from '@react-native-firebase/auth';

export async function getToken() {
  const token = await firebase.auth().currentUser.getIdToken();
  return token;
}

export function getDependency<T>(key: symbol): T {
  return ObjectFactory.getObjectInstance<T>(key);
}
