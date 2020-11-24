export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSED = "PROCESSED",
  CANCELED = "CANCELED",
}

export const PaymentCallbackResponse = {
  Failure:
    '\
  <script>\
    window.ReactNativeWebView.postMessage("failed");\
  </script>\
  ',
  Success:
    '\
  <script>\
    window.ReactNativeWebView.postMessage("success");\
  </script>\
  ',
};
