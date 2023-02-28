import React, { useEffect, useState } from 'react';

import Utils from '../../../helpers/utils';
import handleEvent from '../../../helpers/event-utils';
import Select from '../../BaseComponents/Select/Select';
import {useIsOnlyField, useStepName} from '../../../helpers/hooks/QuestionDisplayHooks';

interface IOption {
  key: string;
  value: string;
}

export default function Dropdown(props) {
  const {
    getPConnect,
    required,
    disabled,
    placeholder,
    value = '',
    datasource = [],
    validatemessage,
    status,
    readOnly,
    testId,
    helperText,
    label
  } = props;

  const [options, setOptions] = useState<Array<IOption>>([]);
  const isOnlyField = useIsOnlyField();
  const stepName = useStepName(isOnlyField, getPConnect);

  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();
  const propName = thePConn.getStateProps().value;

  useEffect(() => {
    const optionsList = [...Utils.getOptionList(props, getPConnect().getDataObject())];
    if(value === '') {optionsList.unshift({key:placeholder, value:placeholder})};
    setOptions(optionsList);
  }, [datasource, value]);


  let readOnlyProp = {};

  if (readOnly) {
    readOnlyProp = { readOnly: true };
  }

  let testProp = {};

  testProp = {
    'data-test-id': testId
  };

  const handleChange = evt => {
    const selectedValue = evt.target.value === placeholder ? '' : evt.target.value;
    handleEvent(actionsApi, 'changeNblur', propName, selectedValue);
  };

  return (
    <>
      <Select label={isOnlyField ? stepName: label}
       hintText={helperText}
       errorText={validatemessage}
       labelIsHeading={isOnlyField}
       onChange={handleChange}
       value={value}
      >
        {options.map((option) => {
          return (<option key={option.key} value={option.value}>{option.value}</option>)
        })}
      </Select>
    </>
  );
}
