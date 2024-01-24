import React, { useState, useEffect } from 'react';
import PropTypes, { string } from 'prop-types';
import { useTranslation } from 'react-i18next';

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
  const { optionList, label } = props;
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
      sessionStorage.getItem('isAutocompleteRendered') !== 'true'
    ) {
      sessionStorage.setItem('isAutocompleteRendered', 'true');
      window.openregisterLocationPicker({
        selectElement: document.getElementById('default')
      });
    }
  });
  const arrOptions = optionList.map(option => (
    <option key={option.key} value={option.value}>
      {option.value}
    </option>
  ));
  return (
    <div className='govuk-form-group autocomplete-wrapper'>
      <label className='govuk-heading-xl' htmlFor='default'>
        {label}
      </label>
      <select className='govuk-select' id='default' name='default'>
        {/* {arrOptions} */}
        <option value='' disabled selected>
          Pick an option
        </option>
        <option value='territory:AE-AZ'>Abu Dhabi</option>
        <option value='country:AF'>Afghanistan</option>
        <option value='territory:AE-AJ'>Ajman</option>
        <option value='territory:XQZ'>Akrotiri</option>
        <option value='country:AL'>Albania</option>
        <option value='country:DZ'>Algeria</option>
      </select>
    </div>
  );
}

AutoComplete.propTypes = {
  optionList: { key: string, value: string },
  label: string
};
