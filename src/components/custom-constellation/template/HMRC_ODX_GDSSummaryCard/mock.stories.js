export const pyReviewRaw = {
  name: 'CollectInformation',
  type: 'View',
  config: {
    template: 'DefaultForm',
    ruleClass: 'OM5W9U-SampleApp-Work-Test',
    localeReference: '@LR OM5W9U-SAMPLEAPP-WORK-TEST!VIEW!COLLECTINFORMATION',
    context: '@P .pyViewContext'
  },
  children: [
    {
      name: 'A',
      type: 'Region',
      children: [
        {
          type: 'TextInput',
          config: {
            value: '@P .FirstName',
            label: '@L First Name'
          }
        },
        {
          type: 'TextInput',
          config: {
            value: '@P .MiddleName',
            label: '@L Middle Name'
          }
        },
        {
          type: 'TextInput',
          config: {
            value: '@P .LastName',
            label: '@L Last Name'
          }
        }
      ]
    },
    {
      name: 'B',
      type: 'Region',
      children: [
        {
          type: 'Email',
          config: {
            value: '@P .Email',
            label: '@L Email'
          }
        },
        {
          type: 'Phone',
          config: {
            value: '@P .PhoneNumber',
            label: '@L Phone Number',
            datasource: {
              source: '@DATASOURCE D_pyCountryCallingCodeList.pxResults',
              fields: {
                value: '@P .pyCallingCode'
              }
            }
          }
        },
        {
          type: 'Date',
          config: {
            value: '@P .ServiceDate',
            label: '@L Service Date'
          }
        }
      ]
    }
  ],
  classID: 'OM5W9U-SampleApp-Work-Test'
};

export const regionChildrenResolved = [
  {
    readOnly: undefined,
    value: 'John',
    label: 'First Name',
    hasSuggestions: false
  },
  {
    readOnly: undefined,
    value: '',
    label: 'Middle Name',
    hasSuggestions: false
  },
  {
    readOnly: undefined,
    value: 'Doe',
    label: 'Last Name',
    hasSuggestions: false
  },
  {
    readOnly: undefined,
    value: 'John@doe.com',
    label: 'Email',
    hasSuggestions: false
  },
  {
    readOnly: undefined,
    value: '+16397975093',
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
    hasSuggestions: false
  },
  {
    readOnly: undefined,
    value: '2023-01-25',
    label: 'Service Date',
    hasSuggestions: false
  }
];
