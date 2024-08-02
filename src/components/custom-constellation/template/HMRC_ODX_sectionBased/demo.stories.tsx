/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import { useState } from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import HmrcOdxSectionBased from './index';
import { DateInput, Input, FieldValueList, Text } from '@pega/cosmos-react-core';
import { PhoneInput as CosmosPhone } from '@pega/cosmos-react-core';
import { pyReviewRaw, regionChildrenResolved } from './mock';

export default {
  title: 'HmrcOdxSectionBased-CONSTELLATION',
  decorators: [withKnobs],
  component: HmrcOdxSectionBased
};

const renderField = resolvedProps => {
  const { displayMode, value = '', label = '', key } = resolvedProps;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [inputValue, setInputValue] = useState(value);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [phoneValue, setPhoneValue] = useState('+16397975093');

  const variant = displayMode === 'LABELS_LEFT' ? 'inline' : 'stacked';

  let val =
    value !== '' ? (
      <Text
        variant='h1'
        as='span'
        key={key}
        onChange={e => {
          setInputValue(e.target.value);
        }}
      >
        {inputValue}
      </Text>
    ) : (
      ''
    );

  if (label === 'Service Date') {
    val = (
      <DateInput
        value={inputValue}
        style={{ fontSize: '14px' }}
        key={key}
        onChange={dateValue => {
          const { valueAsISOString: date } = dateValue;
          const trimmedDate = date ? date.substring(0, date.indexOf('T')) : date;
          setInputValue(trimmedDate);
        }}
      />
    );
  }

  if (label === 'Email') {
    val = (
      <Input
        type='email'
        value={inputValue}
        style={{ fontSize: '14px' }}
        key={key}
        onChange={e => {
          setInputValue(e.target.value);
        }}
      />
    );
  }

  if (label === 'First Name' || label === 'Last Name' || label === 'Middle Name') {
    val = (
      <Input
        value={inputValue}
        style={{ fontSize: '14px' }}
        key={key}
        onChange={e => {
          setInputValue(e.target.value);
        }}
      />
    );
  }

  if (label === 'Phone Number') {
    val = (
      <CosmosPhone
        value={phoneValue}
        style={{ fontSize: '14px' }}
        key={key}
        onChange={phoneVal => {
          setPhoneValue(phoneVal);
        }}
      />
    );
  }

  if (variant === 'inline') {
    val = value || (
      <span
        aria-hidden='true'
        onChange={e => {
          setInputValue(e.target.value);
        }}
      >
        &ndash;&ndash;
      </span>
    );
  } else {
    val = (
      <Text
        variant='h1'
        as='span'
        key={key}
        onChange={e => {
          setInputValue(e.target.value);
        }}
      >
        {val}
      </Text>
    );
  }
  return <FieldValueList variant={variant} fields={[{ name: label, value: val }]} key={key} />;
};

export const BaseHmrcOdxSectionBased = () => {
  const props = {
    NumCols: 1,
    template: 'DefaultForm',
    getPConnect: () => {
      return {
        getChildren: () => {
          return pyReviewRaw.children;
        },
        getInheritedProps: () => {
          return pyReviewRaw.config.inheritedProps;
        },
        createComponent: config => {
          // eslint-disable-next-line default-case
          switch (config.config.value) {
            case '@P .FirstName':
              return renderField(regionChildrenResolved[0]);
            case '@P .MiddleName':
              return renderField(regionChildrenResolved[1]);
            case '@P .LastName':
              return renderField(regionChildrenResolved[2]);
            case '@P .Email':
              return renderField(regionChildrenResolved[3]);
            case '@P .PhoneNumber':
              return renderField(regionChildrenResolved[4]);
            case '@P .ServiceDate':
              return renderField(regionChildrenResolved[5]);
          }
        }
      };
    }
  };

  const regionAChildren = pyReviewRaw.children[0].children.map(child => {
    return props.getPConnect().createComponent(child);
  });

  const regionBChildren = pyReviewRaw.children[1].children.map(child => {
    return props.getPConnect().createComponent(child);
  });

  return (
    <>
      <HmrcOdxSectionBased {...props}>
        <div className='region'>{regionAChildren}</div>
        <div className='region'>{regionBChildren}</div>
      </HmrcOdxSectionBased>
    </>
  );
};
