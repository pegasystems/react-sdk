import { getLocale } from "./common";
import CurrencyMap from "./CurrencyMap";

function NumberFormatter(value, { locale, decPlaces = 2 } = {}) {
  const currentLocale = getLocale(locale);
  if (value !== null && value !== undefined) {
    return Number(value).toLocaleString(currentLocale, {
      minimumFractionDigits: decPlaces,
      maximumFractionDigits: decPlaces
    });
  }
  return value;
}

function CurrencyFormatter(
  value,
  { symbol = true, position, locale, decPlaces = 2 } = {}
) {
  const currentLocale = getLocale(locale);
  let formattedValue = value;
  if (value !== null && value !== undefined) {
    formattedValue = NumberFormatter(value, {
      locale: currentLocale,
      decPlaces
    });
    const countryCode = currentLocale.split("-")[1];

    let code;
    if (symbol) {
      code = CurrencyMap[countryCode]?.symbolFormat;
    } else {
      code = CurrencyMap[countryCode]?.currencyCode;
    }

    // if position is provided, change placeholder accordingly.
    if (position) {
      if (position.toLowerCase() === "before" && code.indexOf("{#}") === 0) {
        code = code.slice(3) + code.slice(0, 3);
      } else if (
        position.toLowerCase() === "after" &&
        code.indexOf("{#}") === code.length - 3
      ) {
        code = code.slice(-3) + code.slice(0, -3);
      }
    }
    return code?.replace("{#}", formattedValue) || formattedValue;
  }
  return formattedValue;
}

function SymbolFormatter(value, { symbol, suffix = true, locale } = {}) {
  let formattedValue = value;
  if (value !== null && value !== undefined) {
    formattedValue = NumberFormatter(value, { locale });
    return suffix ? `${formattedValue}${symbol}` : `${symbol}${formattedValue}`;
  }
  return formattedValue;
}

export default {
  Currency: (value, options) => CurrencyFormatter(value, options),
  "Currency-Code": (value, options) =>
    CurrencyFormatter(value, { ...options, symbol: false }),
  Decimal: (value, options) => NumberFormatter(value, options),
  "Decimal-Auto": (value, options) =>
    NumberFormatter(value, {
      ...options,
      decPlaces: Number.isInteger(value) ? 0 : 2
    }),
  Integer: (value, options) =>
    NumberFormatter(value, { ...options, decPlaces: 0 }),
  Percentage: (value, options) =>
    SymbolFormatter(value, { ...options, symbol: "%" })
};
