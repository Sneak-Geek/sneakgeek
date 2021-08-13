import axios, {AxiosResponse} from 'axios';
import Profile from '../../models/Profile';
import firebase from 'firebase';

const {REACT_APP_SERVER_ENDPOINT} = process.env;

export type IdentityPayload = {
  profile: Profile;
};

type AuthPayload = IdentityPayload & {token: string};

const login = async (
  email: string,
  password: string,
): Promise<AxiosResponse<AuthPayload> | undefined> => {
  const userCred = await firebase.auth().signInWithEmailAndPassword(email, password);
  if (userCred) {
    const token = await getUserToken();
    return axios.get(`${REACT_APP_SERVER_ENDPOINT}/profile/auth/continue`, {
      headers: {
        authorization: token 
      }
    });
  }
  return undefined;
};

const logout = (): Promise<void> => {
  return firebase.auth().signOut();
};

const getIdentity = (
  token: string,
): Promise<AxiosResponse<IdentityPayload>> => {
  return axios.get(`${REACT_APP_SERVER_ENDPOINT}/profile/auth/continue`, {
    headers: {
      authorization: token,
    },
  });
};

const getUserToken = () => {
  return firebase.auth().currentUser?.getIdToken(true);
}

const authService = {
  login,
  logout,
  getIdentity,
  getUserToken
};

export default authService;
