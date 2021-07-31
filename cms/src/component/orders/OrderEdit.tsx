import React from 'react';
import {
  Edit,
  SelectInput,
  SimpleForm,
  TextInput,
  SaveButton,
  Toolbar,
  FunctionField,
  TextField,
} from 'react-admin';
import {normalizedTrackingStatusMap, toVietnamCurrency} from '../../util';

const OrderEditToolbar: React.FC = (props) => (
  <Toolbar {...props}>
    <SaveButton />
  </Toolbar>
);

const OrderEdit: React.FC = (props) => {
  const orderChoices = new Array<{id: string; name: string}>();
  normalizedTrackingStatusMap.forEach((value, key) =>
    orderChoices.push({
      id: key,
      name: value,
    }),
  );

  return (
    <Edit {...props} title={'Chi tiết đơn hàng'}>
      <SimpleForm toolbar={<OrderEditToolbar />}>
        <TextField label={'Mã đơn hàng'} source={'id'} />
        <TextField label={'Tên sản phẩm'} source={'shoe.title'} />
        <SelectInput source={'lastTrackingStatus'} choices={orderChoices} />
        <TextInput
          source={'refundInfo'}
          label={'Chi tiết hoàn tiền (nếu có)'}
        />
        <TextField label={'Cỡ giày'} source={'inventory.shoeSize'} />
        <FunctionField
          label={'Giá bán'}
          render={(order: any) => toVietnamCurrency(order.soldPrice)}
        />
        <FunctionField
          label={'Địa chỉ giao hàng'}
          render={(order: any) =>
            `${order.shippingAddress.addressLine1} - ${order.shippingAddress.addressLine2}`
          }
        />
      </SimpleForm>
    </Edit>
  );
};

export default OrderEdit;
