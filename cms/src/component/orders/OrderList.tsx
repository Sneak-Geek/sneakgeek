import React from 'react';
import {
  Datagrid,
  EditButton,
  FunctionField,
  ImageField,
  List,
  TextField,
} from 'react-admin';
import Order, {TrackingStatus} from '../../models/Order';
import {
  getLastestStatus,
  normalizedTrackingStatusMap,
  toVietnamCurrency,
} from '../../util';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

const OrderList: React.FC = (props) => {
  const _isMoneyTransferred = function (order: Order) {
    const trackingStatus = (order as Order).trackingStatus || [];
    return (
      trackingStatus.length > 0 &&
      trackingStatus.find(
        (t) => t.status === TrackingStatus.RECEIVED_BANK_TRANSFER,
      )
    );
  };
  return (
    <List {...props} title={'Danh sách đơn hàng'} bulkActionButtons={<></>}>
      <Datagrid>
        <ImageField source={'shoe.media.thumbUrl'} label={'Ảnh'} />
        <TextField source={'id'} />
        <TextField source={'shoe.title'} label={'Giày'} />
        <FunctionField
          label={'Trạng thái chuyển khoản'}
          render={(order: any) => {
            return !_isMoneyTransferred(order) ? (
              <ClearIcon color={'inherit'} />
            ) : (
              <DoneIcon color={'inherit'} />
            );
          }}
        />
        <FunctionField
          label={'Status'}
          render={(order: any) => {
            const status = getLastestStatus(order);
            return normalizedTrackingStatusMap.get(status);
          }}
        />
        <FunctionField
          label={'Giá'}
          render={(order: any) => toVietnamCurrency(order.inventory.sellPrice)}
        />
        <TextField source={'inventory.shoeSize'} label={'Cỡ giày'} />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export default OrderList;
