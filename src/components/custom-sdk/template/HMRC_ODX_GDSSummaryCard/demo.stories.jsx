import {
  Input,
  // useTheme,
  DateInput,
  RadioButtonGroup,
  RadioButton
} from '@pega/cosmos-react-core'; // components required for render
import HmrcOdxGdsSummaryCard from './index'; // import the component to test
import { pyReviewRawMetadata, regionChildrenResolved } from './mock.stories'; // inport test data
import { Region } from './utils'; // utility functions - TODO make more generic and widely globally available

// supply Storybook with naming parameters
export default {
  title: 'HmrcOdxGdsSummaryCard',
  component: HmrcOdxGdsSummaryCard
};
let Template = {};
export const Primary = Template.bind({});

 Template = args => {
  const regionAChildren = pyReviewRawMetadata.children[0].children.map(child => {
    return Primary.args.getPConnect().createComponent(child);
  });

  const regionBChildren = pyReviewRawMetadata.children[0].children.map(child => {
    return Primary.args.getPConnect().createComponent(child);
  });

  // children is the child contained within the PizzaPlanetOdxGdsSummaryCard wrapper

  return (
    <HmrcOdxGdsSummaryCard {...args}>
      <Region {...pyReviewRawMetadata.children[0]}>{regionAChildren}</Region>
      <Region {...pyReviewRawMetadata.children[0]}>{regionBChildren}</Region>
    </HmrcOdxGdsSummaryCard>
  );
};

// TODO Make more generic
const renderField = resolvedProps => {
  const {
    type,
    readOnly = false, // is field read only?
    value = '',
    label = '',
    // theme = useTheme()
  } = resolvedProps;

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
            label='Yes'
            id='Yes'
            defaultChecked='false'
            additionalInfo={{
              heading: 'Additional Info',
              content: 'You declare you are subject to immigration'
            }}
          />
          <RadioButton
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
        return '';
  }

  // let val = value != '' ? <Input label={label} value={value} readOnly={readOnly} /> : '';

  // if (label === 'Create date/time')
  //   val = <DateTimeDisplay value={value} variant='datetime' format='long' clockFormat={null} />;

  // if (displayAsStatus === true) val = StatusWorkRenderer({ value });

  // if (label === 'Create Operator')
  //   val = (
  //     <Button
  //       variant='link'
  //       style={
  //         label !== null
  //           ? { width: 'max-content', height: theme.components.input.height }
  //           : undefined
  //       }
  //     >
  //       {value.userName}
  //     </Button>
  //   );

  // if (variant === 'inline') {
  //   val = value || <span aria-hidden='true'>&ndash;&ndash;</span>;
  // } else {
  //   val = (
  //     <Text variant='h1' as='span'>
  //       {val}
  //     </Text>
  //   );
  // }

  // return <FieldValueList variant={variant} fields={[{ name: label, value: val }]} />;
  // return <Input label={label} value={value} />;
};


// core template as used by Storybook
Primary.args = {
  handleOnClick: () => {
    return false;
  },
  template: 'Review answers template',
  showHighlightedData: true,
  label: 'Review answers',
  sectionHeader: 'Claimant answers',
  useType: 1,
  showLabel: 'true',
  stepId: '1',
  actions: {
    navigateToStep: () => {
      // Return the children array for the mock.
      const navigateToStepPromise = new Promise((resolve) => {
        // Perform asynchronous operation
        // ...
        // Simulate successful response
        resolve('Data');
        // Simulate error response
        // reject(new Error('Error fetching data'));
      });

      return navigateToStepPromise;
    }
  },
  getPConnect: () => {
    return {
      getChildren: () => {
        // Return the children array for the mock.
        return pyReviewRawMetadata.children;
      },
      getRawMetadata: () => {
        // Return the complete mock object.
        return pyReviewRawMetadata;
      },
      getInheritedProps: () => {
        // Obtain the array and perform no operation as this set as this is a mock.
        return pyReviewRawMetadata.config.inheritedProps;
      },
      createComponent: config => {
        // create the desired component from the resolved mock data
        switch (config.config.name) {
          // case '@P .pyStatusWork':
          //   return renderField(pyReviewResolved.highlightedData[0].config);
          // case '@P .pyID':
          //   return renderField(pyReviewResolved.highlightedData[1].config);
          // case '@P .pxCreateDateTime':
          //   return renderField(pyReviewResolved.highlightedData[2].config);
          // case '@USER .pxCreateOperator':
          //   return renderField(pyReviewResolved.highlightedData[3].config);
          // case '@P .pySLADeadline':
          //   return renderField(regionChildrenResolved[0]);
          // case '@P .pySLAGoal':
          //   return renderField(regionChildrenResolved[1]);
          // case '@P .pySLAStartTime':
          //   return renderField(regionChildrenResolved[2]);
          case 'NINumber':
            return renderField(regionChildrenResolved[0]);
          case 'NameDetails':
            return renderField(regionChildrenResolved[1]);
          case 'DateOfBirth':
            return renderField(regionChildrenResolved[2]);
          case 'SubjectToImmigration':
            return renderField(regionChildrenResolved[3]);
          default:
            return '';

          // TODO - need to make more generic. Throws an error if no match
        }
      },
      setInheritedProp: () => {
        // Obtain the array and perform no operation as this set as this is a mock.
      },
      resolveConfigProps: () => {
        // Resolve config props
      },
      getContextName: () => {
        // Resolve config props
      }
    };
  }
};

