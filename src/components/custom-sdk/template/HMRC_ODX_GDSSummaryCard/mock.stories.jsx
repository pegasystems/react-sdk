import { Input, DateInput, RadioButtonGroup, RadioButton } from '@pega/cosmos-react-core'; // components required for render

let updateVals = [];

function updateProp(propName, value) {
  return propName + value;
  // receive current config, propname and value
  // return new object?
  // console.log(propName, value);
}

const renderField = resolvedProps => {
  let {
    type,
    // displayMode,
    readOnly = false, // is field read only?
    value = '',
    label = ''
    // theme = useTheme() // can't use custom hook here, which is what I think useTheme() is
  } = resolvedProps;

  // loop through updateVals array and update the relevant props
  updateVals.map(p => {
    switch (p.propName) {
      case 'readOnly':
        readOnly = p.value;
        break;
      case 'type':
        type = p.value;
        break;
      case 'value':
        value = p.value;
        break;
      case 'label':
        label = p.value;
        break;
      default:
        readOnly = p.value;
    }
    return p;
  });

  // const variant = displayMode === 'LABELS_LEFT' ? 'inline' : 'stacked';

  // INPUT
  switch (type) {
    case 'TextInput':
      return <Input label={label} value={value} readOnly={readOnly} />;

    case 'DateTime':
      return <DateInput label={label} value={value} readOnly={readOnly} DateTimeFormat='short' />;

    case 'RadioButtons': // TODO - make dynamic
      return (
        <RadioButtonGroup label={label} value={value}>
          <RadioButton
            readOnly={readOnly}
            label='Yes'
            id='Yes'
            defaultChecked='false'
            additionalInfo={{
              heading: 'Additional Info',
              content: 'You declare you are subject to immigration'
            }}
          />
          <RadioButton
            readOnly={readOnly}
            label='No'
            id='No'
            defaultChecked
            additionalInfo={{
              heading: 'Additional Info',
              content: 'You are not subject to immigration'
            }}
          />
        </RadioButtonGroup>
      );
    default:
      return <Input label={label} value={value} readOnly={readOnly} />;
  }
};
let regionChildrenResolved;
// looks like this data object is used to look up values to see if they exist - at ALL levels e.g. top level or children
const pyReviewRawMetadata = {
  name: 'DisplayClaimantDetails',
  type: 'View',
  config: {
    ruleClass: 'HMRC-ChB-Work-Claim',
    template: 'Details',
    localeReference: '@LR HMRC-CHB-WORK-CLAIM!VIEW!DISPLAYCLAIMANTDETAILS',
    showLabel: false,
    inheritedProps: [
      {
        prop: 'label',
        value: '@L Claimant details'
      },
      {
        prop: 'showLabel',
        value: true
      }
    ]
  },
  children: [
    {
      name: 'A',
      type: 'Region',
      getPConnect: () => {
        return {
          getRawMetadata: () => {
            return pyReviewRawMetadata;
          },
          getChildren: () => {
            return regionChildrenResolved;
          },
          setInheritedProp: (propName, value) => {
            // console.log(propName);
            // pass in current config, propName and value.
            updateVals = [{ propName, value }];

            return updateProp(propName, value);
          },
          getComponent: () => {
            // console.log(regionChildrenResolved[0]);
            // console.log(updateVals);
            return renderField(regionChildrenResolved[0]);
          }
        };
      },
      children: [
        {
          config: {
            name: 'NINumber',
            inheritedProps: [
              {
                prop: 'label',
                value: '@L Claimant National Insurance Number'
              },
              {
                prop: 'showLabel',
                value: false
              }
            ],
            ruleClass: 'HMRC-ChB-Work-Claim',
            type: 'view'
          }
        },
        {
          type: 'reference',
          config: {
            name: 'NameDetails',
            inheritedProps: [
              {
                prop: 'label',
                value: '@L Claimant Name Details'
              },
              {
                prop: 'showLabel',
                value: false
              }
            ],
            ruleClass: 'HMRC-ChB-Work-Claim',
            type: 'view'
          }
        },
        {
          type: 'reference',
          config: {
            name: 'DateOfBirth',
            inheritedProps: [
              {
                prop: 'label',
                value: '@L Claimant Date of Birth'
              },
              {
                prop: 'showLabel',
                value: false
              }
            ],
            ruleClass: 'HMRC-ChB-Work-Claim',
            type: 'view'
          }
        },
        {
          type: 'RadioButtons',
          config: {
            name: 'SubjectToImmigration',
            label:
              '@L Are you subject to immigration control now, or have you been at any time in the last 6 months?',
            listType: 'associated',
            datasource: '@ASSOCIATED .IsSubjectToImmigrationControl',
            value: '@P .IsSubjectToImmigrationControl',
            inline: true
          }
        }
      ]
    }
  ],
  classID: 'HMRC-ChB-Work-Claim'
};
regionChildrenResolved = [
  {
    getPConnect: () => {
      return {
        getRawMetadata: () => {
          return pyReviewRawMetadata;
        },
        getChildren: () => {
          return regionChildrenResolved;
        },
        setInheritedProp: (propName, value) => {
          // console.log(propName);
          // pass in current config, propName and value.
          updateVals = [{ propName, value }];

          return updateProp(propName, value);
        },
        getComponent: () => {
          // console.log(regionChildrenResolved[0]);
          // console.log(updateVals);
          return renderField(regionChildrenResolved[0]);
        }
      };
    },
    // this is the component rendered if the dey matches in the pyReviewRaw data above
    type: 'TextInput',
    readOnly: false, // determines whether or not the component is readonly
    value: 'AB123456C',
    label: 'National Insurance Number',
    displayMode: 'LABELS_LEFTX' // labels left will currently render as text / read only
  },
  {
    getPConnect: () => {
      return {
        getRawMetadata: () => {
          return pyReviewRawMetadata;
        },
        getChildren: () => {
          return regionChildrenResolved;
        },
        setInheritedProp: (propName, value) => {
          // console.log(propName);
          // pass in current config, propName and value.
          updateVals = [{ propName, value }];

          return updateProp(propName, value);
        },
        getComponent: () => {
          // console.log(regionChildrenResolved[0]);
          // console.log(updateVals);
          return renderField(regionChildrenResolved[1]);
        }
      };
    },
    type: 'TextInput',
    readOnly: false,
    value: 'Jones',
    label:
      'Have you ever been known by any other last names or family names including your maiden name?',
    displayMode: 'LABELS_LEFT'
  },
  {
    getPConnect: () => {
      return {
        getRawMetadata: () => {
          return pyReviewRawMetadata;
        },
        getChildren: () => {
          return regionChildrenResolved;
        },
        setInheritedProp: (propName, value) => {
          // console.log(propName);
          // pass in current config, propName and value.
          updateVals = [{ propName, value }];

          return updateProp(propName, value);
        },
        getComponent: () => {
          // console.log(regionChildrenResolved[0]);
          // console.log(updateVals);
          return renderField(regionChildrenResolved[2]);
        }
      };
    },
    type: 'DateTime',
    value: '2022-12-11T20:06:27.232Z',
    label: 'Date of birth',
    displayMode: 'STACKED_LARGE_VAL',
    readOnly: false
  },
  {
    getPConnect: () => {
      return {
        getRawMetadata: () => {
          return pyReviewRawMetadata;
        },
        getChildren: () => {
          return regionChildrenResolved;
        },
        setInheritedProp: (propName, value) => {
          // console.log(propName);
          // pass in current config, propName and value.
          updateVals = [{ propName, value }];

          return updateProp(propName, value);
        },
        getComponent: () => {
          // console.log(regionChildrenResolved[0]);
          // console.log(updateVals);
          return renderField(regionChildrenResolved[3]);
        }
      };
    },
    type: 'RadioButtons',
    datasource: '@ASSOCIATED .IsSubjectToImmigrationControl', // meta
    inline: true,
    label:
      'Are you subject to immigration control now, or have you been at any time in the last 6 months?',
    listType: 'associated',
    value: 'No'
  }
];

export default pyReviewRawMetadata;
