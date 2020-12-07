import {SellOrder, OrderStatus, OrderType} from 'business';
import {strings, themes} from 'resources';
import {BuyOrder} from 'business/src';

export function getOrderStatusStringAndColor(
  order: SellOrder | BuyOrder,
  orderType: OrderType,
): {status: string; color: string} {
  let status: string;
  let color: string;

  switch (order.status) {
    case OrderStatus.PENDING:
      status = strings.Pending;
      color = themes.AppPendingColor;
      break;
    case OrderStatus.APPROVED:
      status = orderType === 'SellOrder' ? strings.Selling : strings.Buying;
      color = themes.AppDisabledColor;
      break;
    case OrderStatus.DENIED:
      status = strings.Denied;
      color = themes.AppErrorColor;
      break;
    default:
      status = orderType === 'SellOrder' ? strings.Sold : strings.Bought;
      color = themes.AppPrimaryColor;
      break;
  }

  return {status, color};
}
