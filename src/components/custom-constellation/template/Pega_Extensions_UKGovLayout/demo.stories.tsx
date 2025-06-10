
/* eslint-disable react/jsx-no-useless-fragment */
// @ts-nocheck
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import PegaExtensionsUkGovLayout from './index';
import { DateInput, Input, FieldValueList, Text, EmptyState } from '@pega/cosmos-react-core';
import { PhoneInput as CosmosPhone } from '@pega/cosmos-react-core';
import { pyReviewRaw, regionChildrenResolved } from './mock';

const meta: Meta<typeof PegaExtensionsUkGovLayout> = {
  title: 'PegaExtensionsUkGovLayout',
  component: PegaExtensionsUkGovLayout,
  excludeStories: /.*Data$/,
  parameters: {
    type: 'Form'
  }
};

export default meta;
type Story = StoryObj<typeof PegaExtensionsUkGovLayout>;

const renderField = resolvedProps => {
  const { displayMode, value = '', label = '', key, readOnly } = resolvedProps;

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
        }} />
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
  if (readOnly) {
    return (
      <EmptyState
        key={Math.random()}
        getPConnect={() => {
          return {
            getChildren: () => {
              return [
                {
                  getPConnect: () => {
                    return {
                      getRawMetadata: () => {
                        return {};
                      },
                      resolveConfigProps: props => {
                        return props;
                      },
                      getConfigProps: () => {
                        return {
                          value: '',
                          label,
                          displayMode: 'LABELS_LEFT'
                        };
                      },
                      getComponent: () => {
                        return val;
                      }
                    };
                  }
                }
              ];
            }
          };
        }}
      />
    );
  }
  return (
    <FieldValueList
      variant={variant}
      fields={[{ name: label, value: val }]}
      key={key}
    />
  );
};

export const BasePegaExtensionsUkGovLayout: Story = args => {
  const { readOnly } = args;

  const props = {
    readOnly,
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
              return renderField({
                ...regionChildrenResolved[0],
                displayMode: readOnly ? 'LABELS_LEFT' : '',
                readOnly
              });
            case '@P .MiddleName':
              return renderField({
                ...regionChildrenResolved[1],
                displayMode: readOnly ? 'LABELS_LEFT' : '',
                readOnly
              });
            case '@P .LastName':
              return renderField({
                ...regionChildrenResolved[2],
                displayMode: readOnly ? 'LABELS_LEFT' : '',
                readOnly
              });
            case '@P .Email':
              return renderField({
                ...regionChildrenResolved[3],
                displayMode: readOnly ? 'LABELS_LEFT' : '',
                readOnly
              });
            case '@P .PhoneNumber':
              return renderField({
                ...regionChildrenResolved[4],
                displayMode: readOnly ? 'LABELS_LEFT' : '',
                readOnly
              });
            case '@P .ServiceDate':
              return renderField({
                ...regionChildrenResolved[5],
                displayMode: readOnly ? 'LABELS_LEFT' : '',
                readOnly
              });
          }
        }
      };
    }
  };

  const regionAChildren = pyReviewRaw.children[0].children.map(child => {
    return props.getPConnect().createComponent(child);
  });

  return (
    <>
      <PegaExtensionsUkGovLayout {...props} {...args}>{regionAChildren}</PegaExtensionsUkGovLayout>
    </>
  );
};

BasePegaExtensionsUkGovLayout.args = {
  readOnly: false,
  showLabel: true,
  label: 'Form template',
  NumCols: 1,
};
