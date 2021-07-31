import Order, {TrackingStatus} from '../models/Order';

export function toVietnamCurrency(value: number) {
  return Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
}

export const normalizedTrackingStatusMap = new Map<TrackingStatus, string>([
  [
    TrackingStatus.WAITING_FOR_BANK_TRANSFER,
    'Đang chờ chuyển khoản từ người mua',
  ],
  [TrackingStatus.RECEIVED_BANK_TRANSFER, 'Đã nhận được chuyển khoản'],
  [TrackingStatus.NOT_RECEIVED_BANK_TRANSFER, 'Chưa nhận được chuyển khoản'],
  [TrackingStatus.SELLER_APPROVED_ORDER, 'Người bán chấp nhận đơn hàng'],
  [
    TrackingStatus.ORDER_BEING_SENT_TO_SNKGK_FOR_AUTHENTICATION,
    'Đang kiểm định hàng (authenticate)',
  ],
  [TrackingStatus.SHOE_VERIFIED, 'Sản phẩm đã qua kiểm định!'],
  [TrackingStatus.SHOE_UNQUALIFIED, 'Sản phẩm không đảm bảo chất lượng'],
  [TrackingStatus.DELIVERING_TO_BUYER, 'Đang chuyển hàng đến người mua'],
  [TrackingStatus.REFUND_TO_BUYER, 'Hoàn tiền cho người mua'],
  [TrackingStatus.DELIVERING_TO_BUYER, 'Đang giao hàng đến người mua'],
  [TrackingStatus.BUYER_RECEIVED, 'Hoàn tất giao hàng cho người mua'],
]);

export function normalizeTrackingStatusString(status: TrackingStatus) {
  return normalizedTrackingStatusMap.get(status);
}

export function getLastestStatus(order: Order) {
  return order.trackingStatus[order.trackingStatus.length - 1].status;
}