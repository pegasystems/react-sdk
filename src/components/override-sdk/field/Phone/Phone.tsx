import React from 'react';
import TextInput from '../TextInput';

interface InputProps {
  type: string;
  onChange: Function;
  autoComplete?: string; // Make autocomplete optional
}

export default function Phone(props) {
  const {
    onChange,
    autocomplete
  } = props;

  const handleChange = inputVal => {
    let phoneValue = inputVal && inputVal.replace(/\D+/g, '');
    phoneValue = `+${phoneValue}`;
    onChange({ value: phoneValue });
  };

  const inputProps: InputProps = {
    type: 'tel',
    onChange: handleChange,
  };

  // Conditionally add the autocomplete prop if it's not blank
  if (autocomplete !== '') {
    inputProps.autoComplete = autocomplete;
  }

  return (

    <TextInput
      {...props}
      inputProps={inputProps}
    />
  );
}
