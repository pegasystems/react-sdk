import React from 'react';
import TextInput from '../TextInput';

export default function Phone(props) {
  const {
    onChange,
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
