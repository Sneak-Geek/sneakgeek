import {TrackingStatus, Order} from 'business';
import {themes} from 'resources';

export const statusToVietString = new Map<TrackingStatus, string>([
  [TrackingStatus.WAITING_FOR_BANK_TRANSFER, 'Đang chờ chuyển khoản '],
  [TrackingStatus.RECEIVED_BANK_TRANSFER, 'Chờ nhận đơn'],
  [TrackingStatus.NOT_RECEIVED_BANK_TRANSFER, 'Không nhận được chuyển khoản'],
  [TrackingStatus.SELLER_REJECTED_ORDER, 'Đơn hàng bị huỷ'],
  [TrackingStatus.SELLER_APPROVED_ORDER, 'Đang xác thực'],
  [TrackingStatus.REFUND_TO_BUYER, 'Hoàn tiền cho người mua'],
  [
    TrackingStatus.ORDER_BEING_SENT_TO_SNKGK_FOR_AUTHENTICATION,
    'Đang Xác thực',
  ],
  [TrackingStatus.SHOE_VERIFIED, 'Giày được xác thực'],
  [TrackingStatus.SHOE_UNQUALIFIED, 'Giày không đủ tiêu chuẩn'],
  [TrackingStatus.DELIVERING_TO_BUYER, 'Đang vận chuyển'],
  [TrackingStatus.BUYER_RECEIVED, 'Người mua nhận hàng'],
]);

export const statusToColor = new Map<TrackingStatus, string>([
  [TrackingStatus.WAITING_FOR_BANK_TRANSFER, 'rgba(30, 35, 48, 0.6)'],
  [TrackingStatus.RECEIVED_BANK_TRANSFER, 'rgba(255, 149, 0, 1)'],
  [TrackingStatus.NOT_RECEIVED_BANK_TRANSFER, themes.AppErrorColor],
  [TrackingStatus.SELLER_REJECTED_ORDER, themes.AppErrorColor],
  [TrackingStatus.SELLER_APPROVED_ORDER, 'rgba(30, 35, 48, 0.6)'],
  [TrackingStatus.REFUND_TO_BUYER, 'rgba(255, 149, 0, 1)'],
  [
    TrackingStatus.ORDER_BEING_SENT_TO_SNKGK_FOR_AUTHENTICATION,
    'rgba(255, 149, 0, 1)',
  ],
  [TrackingStatus.SHOE_VERIFIED, 'rgba(26, 188, 156, 1)'],
  [TrackingStatus.SHOE_UNQUALIFIED, themes.AppErrorColor],
  [TrackingStatus.DELIVERING_TO_BUYER, 'rgba(30, 35, 48, 0.6)'],
  [TrackingStatus.BUYER_RECEIVED, 'rgba(26, 188, 156, 1)'],
]);

export function getLastestStatus(order: Order) {
  return order.trackingStatus[order.trackingStatus.length - 1].status;
}
