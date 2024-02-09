import { useState } from 'react';
import HmrcOdxGdsTaskListTemplate from './index.tsx';
import { pyReviewRaw, caseData } from './mock.stories';
import { TextField } from '@material-ui/core';
import MuiPhoneNumber from 'material-ui-phone-number';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';

export default {
  title: 'HmrcOdxGdsTaskListTemplateCONSTELLATION',
  component: HmrcOdxGdsTaskListTemplate
};

const renderField = resolvedProps => {
  const { displayMode, value = '', label = '', onChange, readOnly } = resolvedProps;

  const variant = displayMode === 'LABELS_LEFT' ? 'inline' : 'stacked';
  let val = '';
  if (label === 'Service Date')
    val = (
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <KeyboardDatePicker
          variant='inline'
          inputVariant='outlined'
          placeholder='mm/dd/yyyy'
          fullWidth
          format='MM/DD/YYYY'
          mask='__/__/____'
          size='small'
          label={label}
          value={value || null}
          onChange={onChange}
        />
      </MuiPickersUtilsProvider>
    );

  if (label === 'Email')
    val = (
      <TextField
        type='email'
        fullWidth
        value={value}
        size='small'
        variant='outlined'
        style={{ fontSize: '14px' }}
        label={label}
        onChange={onChange}
        readOnly={readOnly}
      ></TextField>
    );

  if (label === 'First Name' || label === 'Last Name' || label === 'Middle Name')
    val = (
      <TextField
        value={value}
        fullWidth
        size='small'
        variant='outlined'
        style={{ fontSize: '14px' }}
        label={label}
        onChange={onChange}
        readOnly={readOnly}
      ></TextField>
    );

  if (label === 'Phone Number')
    val = (
      <MuiPhoneNumber
        value={value}
        fullWidth
        variant='outlined'
        size='small'
        style={{ fontSize: '14px' }}
        defaultCountry='us'
        label={label}
        onChange={onChange}
      ></MuiPhoneNumber>
    );

  if (variant === 'inline') {
    val = value || <span aria-hidden='true'>&ndash;&ndash;</span>;
  }

  return <span key={label}>{val}</span>;
};

export const BaseHmrcOdxGdsTaskListTemplate = () => {
  const [firstName, setFirstName] = useState('Ian');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('Joe');
  const [phone, setPhone] = useState('+16397975093');
  const [serviceDate, setServiceDate] = useState('2023-01-25');
  const [email, setEmail] = useState('john@doe.com');
  const regionChildrenResolved = [
    {
      readOnly: true,
      value: firstName,
      label: 'First Name',
      hasSuggestions: false,
      onChange: val => {
        setFirstName(val.target.value);
      }
    },
    {
      readOnly: undefined,
      value: middleName,
      label: 'Middle Name',
      hasSuggestions: false,
      onChange: val => {
        setMiddleName(val.target.value);
      }
    },
    {
      readOnly: undefined,
      value: lastName,
      label: 'Last Name',
      hasSuggestions: false,
      onChange: val => {
        setLastName(val.target.value);
      }
    },
    {
      readOnly: undefined,
      value: email,
      label: 'Email',
      hasSuggestions: false,
      onChange: val => {
        setEmail(val.target.value);
      }
    },
    {
      readOnly: undefined,
      value: phone,
      label: 'Phone Number',
      datasource: {
        fields: {
          value: undefined
        },
        source: [
          {
            value: '+1'
          },
          {
            value: '+91'
          },
          {
            value: '+48'
          },
          {
            value: '+44'
          }
        ]
      },
      hasSuggestions: false,
      onChange: val => {
        setPhone(val);
      }
    },
    {
      readOnly: undefined,
      value: serviceDate,
      label: 'Service Date',
      hasSuggestions: false,
      onChange: date => {
        const changeValue = date && date.isValid() ? date.toISOString() : null;
        setServiceDate(changeValue);
      }
    }
  ];
  const props = {
    template: 'DefaultForm',
    getPConnect: () => {
      return {
        getChildren: () => {
          return pyReviewRaw.children;
        },
        createComponent: config => {
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
            default:
              break;
          }
        },
        getContextName: () => {
          // Resolve config props
        },
        getCaseSummary: () => {
          return caseData;
        }
      };
    }
  };

  window.PCore.getDataPageUtils = () => {
    return {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      getDataAsync: (dataView, parameters, options) => {
        return new Promise(resolve => {
          if (dataView === 'D_CaseTaskList') {
            resolve({
              data: {
                caseInfo: {
                  content: {
                    CaseTasks: {
                      CaseTaskList: [
                        {
                          TaskLabel: 'Your details',
                          TaskStatus: 'Completed',
                          IsTaskALink: true
                        },
                        {
                          TaskLabel: 'Relationship details',
                          TaskStatus: 'In progress',
                          IsTaskALink: true
                        },
                        {
                          TaskLabel: 'Child details',
                          TaskStatus: 'Cannot start yet',
                          IsTaskALink: false
                        },
                        {
                          TaskLabel: 'Income details',
                          TaskStatus: 'Cannot start yet',
                          IsTaskALink: false
                        }
                      ]
                    }
                  }
                }
              }
            });
          } else {
            resolve({
              data: {
                data: []
              }
            });
          }
        });
      }
    };
  };

  const regionAChildren = pyReviewRaw.children[0].children.map(child => {
    return props.getPConnect().createComponent(child);
  });
  const regionBChildren = pyReviewRaw.children[1].children.map(child => {
    return props.getPConnect().createComponent(child);
  });

  return (
    <>
      <HmrcOdxGdsTaskListTemplate {...props}>
        {regionAChildren}
        {regionBChildren}
      </HmrcOdxGdsTaskListTemplate>
    </>
  );
};
