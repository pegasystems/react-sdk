import React, { useEffect, useState } from 'react';

import Utils from '../../../helpers/utils';
import handleEvent from '../../../helpers/event-utils';
import Select from '../../BaseComponents/Select/Select';
import useIsOnlyField from '../../../helpers/hooks/QuestionDisplayHooks';
import useAddErrorToPageTitle from '../../../helpers/hooks/useAddErrorToPageTitle';

interface IOption {
  key: string;
  value: string;
}

export default function Dropdown(props) {
  const {
    getPConnect,
    placeholder,
    value = '',
    datasource = [],
    validatemessage,
    helperText,
    label
  } = props;

  const [options, setOptions] = useState<Array<IOption>>([]);
  const isOnlyField = useIsOnlyField();

  const thePConn = getPConnect();
  const actionsApi = thePConn.getActionsApi();


  // TODO Investigate whether or not this can be refactored out, or if a name can be injected as a prop higher up
  const propName = thePConn.getStateProps().value;
  const formattedPropName = propName.indexOf('.') === 0 ? propName.substring(1) : propName;

  // TODO consider moving this functionality 'up' especially when we add Error summary,
  // as it may be tidier to call this only once, rather than on every input
  useAddErrorToPageTitle(validatemessage);

  useEffect(() => {
    const optionsList = [...Utils.getOptionList(props, getPConnect().getDataObject())];
    if(value === '') {optionsList.unshift({key:placeholder, value:placeholder})};
    setOptions(optionsList);
  }, [datasource, value]);

  /* let testProp = {};

  testProp = {
    'data-test-id': testId
  }; */

  const handleChange = evt => {
    const selectedValue = evt.target.value === placeholder ? '' : evt.target.value;
    handleEvent(actionsApi, 'changeNblur', propName, selectedValue);
  };

  return (
    <>
      <Select label={label}
       hintText={helperText}
       errorText={validatemessage}
       labelIsHeading={isOnlyField}
       onChange={handleChange}
       value={value}
       name={formattedPropName}
      >
        {options.map((option) => {
          return (<option key={option.key} value={option.key}>{option.value}</option>)
        })}
      </Select>
    </>
  );
}
