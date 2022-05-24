import defaultBrands from './brands.json';

/* eslint-disable  @typescript-eslint/no-explicit-any */

export const convertIntToFloat = (num: number, decPlaces: number): number => {
  return num.toFixed(decPlaces) as any;
};

export const getRandomDiscountPercent = () => {
  const percentages = [0, 2, 5, 7, 10];
  const randIdx = Math.floor(Math.random() * percentages.length);
  return percentages[randIdx];
};

export const getRandomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const mapBrandToBrandId = (inputBrand: string) => {
  const result = defaultBrands.filter((brand) => brand.name === inputBrand);
  if (result.length === 0) console.log('brand not found');
  return result[0].id;
};

export const assignPropToObj = (
  obj: any,
  props: Array<any>,
  values: Array<any>
) => {
  if (props.length !== values.length) {
    return;
  }
  props.forEach((prop, idx) => {
    obj[prop] = values[idx];
  });
};

export function numberWithCommas(x: number) {
  const regex = new RegExp(/\B(?=(\d{3})+(?!\d))/g);
  return x.toString().replace(regex, ',');
}

export const convertToUSD = (money: string) => {
  if (money === 'Đang cập nhật') return money;
  const [moneyString, type] = money.split(' ');
  let result = money;
  if (type === 'VND') {
    const moneyNumber = parseInt(moneyString.split(',').join(''));

    result = numberWithCommas(moneyNumber / 25000) + ' USD';
  }

  return result;
};

export const convertToVND = (money: string) => {
  if (money === 'Đang cập nhật') return money;
  const [moneyString, type] = money.split(' ');
  let result = money;
  if (type === 'USD') {
    const moneyNumber = parseInt(moneyString.split(',').join(''));

    result = numberWithCommas(moneyNumber * 25000) + ' VND';
  }

  return result;
};

export const convertMoneyStringToNumber = (money: string) => {
  const removeComma = money.replaceAll(',', '');
  const removeUSD = removeComma.replaceAll('USD', '');
  return Number(removeUSD);
};

export const convertPriceStringToFilterType = (price: string) => {
  let priceFromMinToMax = [];
  if (price.includes('Under')) {
    const underPrice = price.replace('Under ', '');
    priceFromMinToMax.push('0 USD');
    priceFromMinToMax.push(underPrice);
    return priceFromMinToMax;
  }
  if (price.includes('Over')) {
    const overPrice = price.replace('Over ', '');
    priceFromMinToMax.push(overPrice);
    priceFromMinToMax.push('10,000,000 USD');
    return priceFromMinToMax;
  }
  return (priceFromMinToMax = price.split(' to '));
};
