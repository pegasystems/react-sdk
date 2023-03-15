import React from 'react';
import TextInput from '../TextInput';

export default function Phone(props) {
  const {
    onChange,
    // onBlur,
  } = props;

  /*
  let testProp = {};
  testProp = {
    'data-test-id': testId
  };
  */

  const handleChange = inputVal => {
    let phoneValue = inputVal && inputVal.replace(/\D+/g, '');
    phoneValue = `+${phoneValue}`;
    onChange({ value: phoneValue });
  };

  // const handleBlur = event => {
  //   const phoneValue = event?.target?.value;
  //   event.target.value = `+${phoneValue && phoneValue.replace(/\D+/g, '')}`;
  //   onBlur(event);
  // };

  return (

    <TextInput
      {...props}
      inputProps={{
          type:'tel',
          onChange:handleChange,
          /*
            TODO enable if always relevant
            autocomplete="tel"
          */
        }
      }
    />
  );
}
