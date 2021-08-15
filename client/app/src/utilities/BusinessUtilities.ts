import {
  ObjectFactory,
  ISettingsProvider,
  FactoryKeys,
  SettingsKey,
} from 'business';

import { firebase } from '@react-native-firebase/auth';

export async function getToken(shouldReload?: boolean) {
  if (shouldReload) {
    await firebase.auth().currentUser.reload();
  }
  const token = await firebase.auth().currentUser.getIdToken(shouldReload);
  return token;
}

export function getDependency<T>(key: symbol): T {
  return ObjectFactory.getObjectInstance<T>(key);
}
