import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export function isProfileVerified(fbUser: FirebaseAuthTypes.User) {
  console.log("Provider data", fbUser.providerId);
  return fbUser.email && fbUser.emailVerified;
}