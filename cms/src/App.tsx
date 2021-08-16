import React from 'react';
import './App.css';
import {Admin, Resource} from 'react-admin';
import firebase from 'firebase'
import PostIcon from '@material-ui/icons/Book';
import authProvider from './lib/admin/authProvider';
import getDataProvider from './lib/admin/dataProvider';
import OrderList from './component/orders/OrderList';
import OrderEdit from './component/orders/OrderEdit';
import 'firebase/auth';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = React.useState(false);
  React.useEffect(() => {
    if (!isInitialized) {
      firebase.initializeApp({
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY, 
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID, 
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
      });
      setIsInitialized(true);
    }
  }, [isInitialized, setIsInitialized]);
  console.log("Environment:", process.env.NODE_ENV);
  return (
    <Admin
      dataProvider={getDataProvider()}
      authProvider={authProvider}
      title={'Trang quản lý SneakGeek'}>
      <Resource
        data-testid={'orders-resource'}
        name={'orders'}
        icon={PostIcon}
        list={OrderList}
        edit={OrderEdit}
      />
    </Admin>
  );
};

export default App;
