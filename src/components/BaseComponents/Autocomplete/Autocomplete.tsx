import React, { useEffect } from 'react';
import { func, string } from 'prop-types';

import HintTextComponent from '../../helpers/formatters/ParsedHtml';
import FormGroup from '../FormGroup/FormGroup';

function makeHintId(identifier) {
  return `${identifier}-hint`;
}

declare global {
  interface Window {
    openregisterLocationPicker: any;
  }
}

export default function AutoComplete(props) {
  const { optionList, instructionText, name, selectedValue, testId, helperText, errorText, id } =
    props;
  const inputClasses = `govuk-input ${errorText ? 'govuk-input--error' : ''}`.trim();

  useEffect(() => {
    if (
      typeof window.openregisterLocationPicker === 'function' &&
      sessionStorage.getItem('isAutocompleteRendered') !== 'true' &&
      optionList.length
    ) {
      sessionStorage.setItem('isAutocompleteRendered', 'true');
      window.openregisterLocationPicker({
        selectElement: document.getElementById(id),
        defaultValue: ''
      });
    }
  }, [optionList]);
  const arrOptions =
    optionList.length &&
    optionList.map(option => {
      let selected = { selected: false };
      if (selectedValue === option.key) selected = { selected: true };
      return (
        <option key={option.key} value={option.value} {...selected}>
          {option.value}
        </option>
      );
    });

  const getDefaultValue = () => {
    return optionList.forEach(item => {
      if (item.key === selectedValue) {
        return item.value;
      }
      return '';
    });
  };

  return (
    <FormGroup {...props}>
      {helperText && (
        <div id={makeHintId(name)} className='govuk-hint'>
          <HintTextComponent htmlString={helperText} />
        </div>
      )}
      {instructionText && (
        <div id={makeHintId(name)} className='govuk-body'>
          <HintTextComponent htmlString={helperText} />
        </div>
      )}
      {arrOptions && arrOptions.length > 0 ? (
        <select
          className={inputClasses}
          id={id}
          name={id}
          value={getDefaultValue()}
          data-test-id={testId}
        >
          <option value='' disabled selected>
            {' '}
          </option>
          {arrOptions}
        </select>
      ) : (
        <></>
      )}
    </FormGroup>
  );
}

AutoComplete.propTypes = {
  ...FormGroup.propTypes,
  optionList: { key: string, value: string },
  label: string,
  instructionText: string,
  helperText: string,
  onChange: func,
  selectedValue: string,
  testId: string,
  name: string
};
