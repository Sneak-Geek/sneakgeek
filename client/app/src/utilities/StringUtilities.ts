import { strings } from "resources";

const minVndThreshold = 50000;
const usdToVndConversionRate = 25000;

export function translateGenderToVnms(gender: string) {
  if (gender === "men") {
    return strings.Men;
  } else {
    return strings.Women;
  }
}

export function convertUsdToVnd(amount: string | number) {
  let parsedAmount = typeof amount === 'string' ? parseInt(amount, 10) : amount;
  return parsedAmount < minVndThreshold
    ? parsedAmount * usdToVndConversionRate
    : parsedAmount;
}

export function toCurrencyString(amount: string | number, maxDigit?: number) {
  let converted = typeof amount === 'string' ? parseInt(amount, 10) : amount;
  if (converted) {
    return converted.toLocaleString('vi', {
      style: 'currency',
      currency: 'VND',
      ...(maxDigit ? { maximumSignificantDigits: maxDigit } : {}),
    });
  }

  return '';
}

export function toMoneyString(amount: string | number, maxDigit?: number) {
  let converted = typeof amount === 'string' ? parseInt(amount, 10) : amount;
  var priceString = "";
  if (converted) {
    if (converted > 1000000000){
      priceString = (converted / 1000000000).toString();
      return priceString + ' tỉ VND';
    }
    else if (converted > 1000000){
      priceString = (converted / 1000000).toString();
      return priceString + ' triệu VND';
    }
    else if (converted > 1000){
      priceString = (converted / 1000).toString();
      return priceString + ' nghìn VND';
    }
    else
    {
      return converted.toString() + ' VND';
    }
  }

  return '';
}

export function isValidEmail(email: string) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email.toLowerCase());
}

export function isValidPassword(password: string, type: number) {
  let regex: RegExp;
  switch (type) {
    //Minimum eight characters, at least one letter and one number
    case 1:
      regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      break;
    //Minimum eight characters, at least one letter, one number and one special character
    case 2:
      regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      break;
    //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
    case 3:
      regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      break;
    //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
    case 4:
      regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      break;
    //Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character
    case 5:
      regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
      break;
    default:
      break;
  }
  return regex.test(password);
}
