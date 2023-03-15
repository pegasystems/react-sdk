// eslint-disable-next-line import/no-named-default
import { default as CurrencyAlias} from '../../../helpers/formatters/Currency';
// eslint-disable-next-line import/no-named-default
import { default as CurrencyMapAlias } from '../../../helpers/formatters/CurrencyMap';

declare const PCore: any;

export const getCurrencyOptions = (inISOCode: string) => {

  const operatorLocale = PCore.getEnvironmentInfo().getUseLocale() || 'en-US';

  let currMapToUse = CurrencyMapAlias.US;
  let localeToUse = operatorLocale;

  // Determine CurrencyMap lookup based on ISO code (if specified).
  //  If no ISO code, use locale
  //  If no locale, default to US
  if (inISOCode) {
    if (inISOCode === "EUR") {
      currMapToUse = CurrencyMapAlias.NL;
      localeToUse = "nl-NL";
    } else {
      // For all other ISO codes, use first 2 characters as the lookup from CurrencyMap
      const countryCode = inISOCode.substring(0,2);
      currMapToUse = CurrencyMapAlias[countryCode];
    }
  } else if (operatorLocale) {
    // No ISO Code so check for operator locale
    const countryCode = operatorLocale.substring(3);
    currMapToUse = CurrencyMapAlias[countryCode];
  } else {
    // no ISO code and no operator locale, default to US
    currMapToUse = CurrencyMapAlias.US;
  }

  // eslint-disable-next-line no-console
  console.log(`currMapToUse: ${JSON.stringify(currMapToUse)}`);

  // let currencyOptions = {};
  //
  // // Prefer the control's specified ISO Code but use locale if that's not defined
  // if (currMapToUse) {
  //   // eslint-disable-next-line no-debugger
  //   debugger;
  //   const theCode = currMapToUse.currencyCode.substring(0, 3);
  //   currencyOptions = { locale: localeToUse, style: "currency", currency: theCode }
  // } else if (operatorLocale) {
  //   // eslint-disable-next-line no-debugger
  //   debugger;
  //   currencyOptions = { locale: operatorLocale };
  // }

  const theCode = currMapToUse.currencyCode.substring(0, 3);
  const currencyOptions = { locale: localeToUse, style: "currency", currency: theCode }

  return currencyOptions;

}


export const getCurrencyCharacters = (inISOCode: string) => {
  const theCurrencyChars = {
    theCurrencySymbol: '$',
    theDecimalIndicator: '.',
    theDigitGroupSeparator: ','
  }

  const theCurrencyOptions = getCurrencyOptions(inISOCode);

  const testValue = 1234.56;
  const formattedString = CurrencyAlias.Currency(testValue, theCurrencyOptions);

  // eslint-disable-next-line no-console
  console.log(`formattedString: ${formattedString}`);

  // Here, we have the formatted string (ex: $1,234.56) where:
  //  Currency symbol = formattedString[0]
  //  Separator = formattedString[2]
  //  DecimalIndicator = formattedString[6];

  theCurrencyChars.theCurrencySymbol = formattedString[0];
  theCurrencyChars.theDigitGroupSeparator = formattedString[2];
  theCurrencyChars.theDecimalIndicator = formattedString[6];

  // eslint-disable-next-line no-console
  console.log(`theCurrencyChars: symbol: ${theCurrencyChars.theCurrencySymbol} | theDigitGroupSeparator: ${theCurrencyChars.theDigitGroupSeparator} | theDecimalIndicator: ${theCurrencyChars.theDecimalIndicator}`);

  return theCurrencyChars;

}
