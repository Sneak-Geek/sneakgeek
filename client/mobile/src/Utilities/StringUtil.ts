// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

export function toCurrencyString(amount: string, maxDigit?: number) {
  const converted = parseInt(amount, 10);
  if (converted) {
    return converted.toLocaleString("vi", {
      style: "currency",
      currency: "VND",
      ...(maxDigit ? { maximumSignificantDigits: maxDigit } : {})
    });
  }

  return "";
}

export function isValidEmail(email: string) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email.toLowerCase());
}
