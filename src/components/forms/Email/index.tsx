import React from 'react';
import TextInput from '../TextInput';

export default function Email(props) {

  /*
  let testProp = {};
  testProp = {
    'data-test-id': testId
  };
  */

  return (
    <TextInput
      {...props}
      inputProps={{
        type:'email',
        spellCheck:"false",
        /*
            TODO enable if always relevant
            autocomplete="email"
        */
      }}
    />
  );
}
