import React, { useState, useEffect } from 'react';
import PropTypes, { string } from 'prop-types';
import { useTranslation } from 'react-i18next';

import HintTextComponent from '../../helpers/formatters/ParsedHtml';

function makeHintId(identifier) {
  return `${identifier}-hint`;
}

declare global {
  interface Window {
    openregisterLocationPicker: any;
  }
}
interface optionList {
  key: string;
  value: string;
}

export default function AutoComplete(props) {
  const { optionList, label, instructionText, name } = props;
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '../assets/css/location-autocomplete.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      sessionStorage.setItem('isAutocompleteRendered', 'false');
    };
  }, []);

  useEffect(() => {
    if (
      typeof window.openregisterLocationPicker === 'function' &&
      sessionStorage.getItem('isAutocompleteRendered') !== 'true' &&
      optionList.length
    ) {
      sessionStorage.setItem('isAutocompleteRendered', 'true');
      window.openregisterLocationPicker({
        selectElement: document.getElementById('default'),
        defaultValue: ''
      });
    }
  }, [optionList]);
  const arrOptions = optionList.map(option => (
    <option key={option.key} value={option.value}>
      {option.value}
    </option>
  ));
  console.log('instruction', instructionText);
  return (
    <div className='govuk-form-group autocomplete-wrapper'>
      <label className='govuk-heading-xl' htmlFor='default'>
        {label}
      </label>
      {instructionText && (
        <div id={makeHintId(name)} className='govuk-body'>
          <HintTextComponent htmlString={instructionText} />
        </div>
      )}
      {arrOptions && arrOptions.length > 0 ? (
        <select className='govuk-select' id='default' name='default'>
          <option value='' disabled selected>
            Pick an option
          </option>
          {arrOptions}
        </select>
      ) : (
        <></>
      )}
    </div>
  );
}

AutoComplete.propTypes = {
  optionList: { key: string, value: string },
  label: string,
  instructionText: string
};
