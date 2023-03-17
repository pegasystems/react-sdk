import { getLocale } from './formatters/common';


export const dateFormatInfoDefault = {
  dateFormatString: "MM/DD/YYYY",
  dateFormatStringLong: "MMM DD, YYYY",
  dateFormatStringLC: "mm/dd/yyyy",
  dateFormatMask: "__/__/____"
}

export const getDateFormatInfo = () => {
  const theDateFormatInfo = dateFormatInfoDefault;
  const theLocale = getLocale(); // PCore.getEnvironmentInfo().getUseLocale() || "US-en";

  // NOTE: this date was chosen since it has a day larger than 12. If you change it,
  //  you'll need to change the indexOf values below!
  const theTestDate = new Date(Date.parse('30 November 2023 12:00:00 GMT'));
  const theTestDateLocaleString = new Intl.DateTimeFormat(theLocale).format(theTestDate);

  // console.log(`theLocale: ${theLocale} theTestDateLocaleString: ${theTestDateLocaleString}`);

  // Build the format string based on where '11' (mm), '30' (dd), and '2023' (yyyy) are
  //  Example: US locations are 0, 3, 6 but for NL locations are 3, 0, 6
  const locMM = theTestDateLocaleString.indexOf('11');
  const locDD = theTestDateLocaleString.indexOf('30');
  const locYYYY = theTestDateLocaleString.indexOf('2023');

  const arrPieces = [
    {
      loc: locMM,
      format: 'MM',
      longFormat: 'MMM',
      placeholder: 'mm',
      mask: '__'
    },
    {
      loc: locDD,
      format: 'DD',
      longFormat: 'DD',
      placeholder: 'dd',
      mask: '__'
    },
    {
      loc: locYYYY,
      format: 'YYYY',
      longFormat: 'YYYY',
      placeholder: 'yyyy',
      mask: '____'
    }
   ];

  // Sort the associative array by order of appearance (loc) of each piece
  arrPieces.sort((a, b) => {
    if (a.loc < b.loc) return -1;
    if (a.loc > b.loc) return 1;
    return 0;
  });

  // Construct the structure to return...
  theDateFormatInfo.dateFormatString = `${arrPieces[0].format}/${arrPieces[1].format}/${arrPieces[2].format}`;
  theDateFormatInfo.dateFormatStringLong = `${arrPieces[0].longFormat} ${arrPieces[1].longFormat}, ${arrPieces[2].longFormat}`;
  theDateFormatInfo.dateFormatStringLC = `${arrPieces[0].placeholder}/${arrPieces[1].placeholder}/${arrPieces[2].placeholder}`;
  theDateFormatInfo.dateFormatMask = `${arrPieces[0].mask}/${arrPieces[1].mask}/${arrPieces[2].mask}`;

  return theDateFormatInfo;
}
