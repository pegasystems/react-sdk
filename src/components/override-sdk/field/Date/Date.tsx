import { useEffect, useState } from 'react';
import { FormGroup, ErrorText, DateField } from 'govuk-react';
import dayjs from 'dayjs';

import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import { format } from '@pega/react-sdk-components/lib/components/helpers/formatters';
import { dateFormatInfoDefault, getDateFormatInfo } from '@pega/react-sdk-components/lib/components/helpers/date-format-utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

function getFormattedDate(date) {
  return `${date.$y.toString()}-${(date.$M + 1).toString().padStart(2, '0')}-${date.$D.toString().padStart(2, '0')}`;
}

interface DateProps extends PConnFieldProps {}

export default function Date(props: DateProps) {
  const TextInput = getComponentFromMap('TextInput');
  const FieldValueList = getComponentFromMap('FieldValueList');

  const { getPConnect, label, required, disabled, value, validatemessage, status, readOnly, testId, helperText, displayMode, hideLabel } = props;

  const [dateValue, setDateValue] = useState(value ? dayjs(value) : null);

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;
  const helperTextToDisplay = validatemessage || helperText;

  const dateFormatInfo = dateFormatInfoDefault;
  const theDateFormat = getDateFormatInfo();
  dateFormatInfo.dateFormatString = theDateFormat.dateFormatString;
  dateFormatInfo.dateFormatStringLC = theDateFormat.dateFormatStringLC;
  dateFormatInfo.dateFormatMask = theDateFormat.dateFormatMask;

  useEffect(() => {
    setDateValue(dayjs(value));
  }, [value]);

  if (displayMode === 'DISPLAY_ONLY') {
    const formattedDate = format(props.value, 'date', {
      format: dateFormatInfo.dateFormatString
    });
    return <span>{formattedDate}</span>;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    const formattedDate = format(props.value, 'date', {
      format: dateFormatInfo.dateFormatString
    });
    return <span>{formattedDate}</span>;
  }

  if (readOnly) {
    return <span>{dateValue ? dateValue.format(dateFormatInfo.dateFormatString) : ''}</span>;
  }

  const testProps: any = { 'data-test-id': testId };

  const handleChange = date => {
    if (date && date.isValid()) {
      setDateValue(date);
      handleEvent(actions, 'changeNblur', propName, getFormattedDate(date));
    }
  };

  return (
    <FormGroup>
      <DateField
        input={{
          onChange: handleChange
        }}
        inputNames={{
          day: 'dayInputName'
        }}
        inputs={{
          day: {
            autoComplete: 'bday-day'
          },
          month: {
            autoComplete: 'bday-month'
          },
          year: {
            autoComplete: 'bday-year'
          }
        }}
      >
        {label}
      </DateField>
      {helperTextToDisplay && <ErrorText>{helperTextToDisplay}</ErrorText>}
    </FormGroup>
  );
}
