import React from 'react';
// import PropTypes from 'prop-types';

export default function TextInput() {
  // const { name, errorText, hintText, inputProps = {}, maxLength, id, onBlur, disabled } = props;

  return (
    <div className='govuk-form-group'>
      <h1 className='govuk-label-wrapper'>
        <label className='govuk-label govuk-label--l' htmlFor='cost-per-item'>
          What is the cost per item, in pounds?
        </label>
      </h1>
      <div className='govuk-input__wrapper'>
        <div className='govuk-input__prefix' aria-hidden='true'>
          £
        </div>
        <input
          className='govuk-input govuk-input--width-5'
          id='cost-per-item'
          name='costPerItem'
          type='text'
          spellCheck='false'
        />
        <div className='govuk-input__suffix' aria-hidden='true'>
          per item
        </div>
      </div>
    </div>
  );
}

// TextInput.propTypes = {
//   name: PropTypes.string,
//   maxLength: PropTypes.number,
//   inputProps: PropTypes.object,
//   id: PropTypes.string,
//   disabled: PropTypes.bool,
//   onBlur: PropTypes.func
// };
