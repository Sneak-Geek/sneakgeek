import React from 'react';
import './App.css';
import {Admin, Resource} from 'react-admin';
import PostIcon from '@material-ui/icons/Book';
import authProvider from './lib/admin/authProvider';
import getDataProvider from './lib/admin/dataProvider';
import OrderList from './component/orders/OrderList';
import OrderEdit from './component/orders/OrderEdit';

const App: React.FC = () => {
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
