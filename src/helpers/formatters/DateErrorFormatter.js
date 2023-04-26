
const _DateErrorFormatter = (message, propertyName) => {

  const dateRegExp = /(\d*-\d*-\d*)/;
  const matchedDates = message.match(dateRegExp);
  const originalDate = (matchedDates?.length > 0) ? matchedDates[0] : null;
  const targets = []

  if(originalDate){
     const [year, month, day] = originalDate.split('-');

    // When some 'parts' are missing
    let missingPartMessage = ''
    if(day === ''){
      missingPartMessage += 'a day';
      targets.push('day');
    }
    if(month === ''){
      if(missingPartMessage.length > 0)  missingPartMessage+=' and a month';
      else missingPartMessage+='a month';
      targets.push('month');
    }
    if(year === ''){
      if(missingPartMessage.length > 0) missingPartMessage+=' and a year'
      else missingPartMessage+='a year';
      targets.push('year');
    }
    if(missingPartMessage.length > 0){
      return {message: `${propertyName} must include ${missingPartMessage}`, targets};
    }

    if(message.search('is not a valid date')){
      return {message: `${propertyName} must be a real date`, targets};
    }

  }
  return {message, targets};
}

export const DateErrorFormatter = (message, propertyName) => {
  return _DateErrorFormatter(message, propertyName).message;
}

export const DateErrorTargetFields = (message) => {
  return _DateErrorFormatter(message, null).targets;
}
