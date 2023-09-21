import { withKnobs } from '@storybook/addon-knobs';

import HmrcOdxGdsSummaryCard from './index.jsx';
import { DateInput, Input, FieldValueList, Text } from '@pega/cosmos-react-core';
import { PhoneInput as CosmosPhone } from '@pega/cosmos-react-core';
import { pyReviewRaw, regionChildrenResolved } from './mock.stories';

export default {
  title: 'HmrcOdxGdsSummaryCard',
  decorators: [withKnobs],
  component: HmrcOdxGdsSummaryCard
};

const renderField = resolvedProps => {
  const { displayMode, value = '', label = '' } = resolvedProps;

  const variant = displayMode === 'LABELS_LEFT' ? 'inline' : 'stacked';

  let val =
    value !== '' ? (
      <Text variant='h1' as='span'>
        {value}
      </Text>
    ) : (
      ''
    );


  if (label === 'Service Date')
    val = <DateInput value={value} style={{ fontSize: '14px' }}></DateInput>;

  if (label === 'Email')
    val = <Input type='email' value={value} style={{ fontSize: '14px' }}></Input>;

  if (label === 'First Name' || label === 'Last Name' || label === 'Middle Name')
    val = <Input value={value} style={{ fontSize: '14px' }}></Input>;

  if (label === 'Phone Number')
    val = <CosmosPhone value={value} style={{ fontSize: '14px' }}></CosmosPhone>;


  if (variant === 'inline') {
    val = value || <span aria-hidden='true'>&ndash;&ndash;</span>;
  } else {
    val = (
      <Text variant='h1' as='span'>
        {val}
      </Text>
    );
  }
  return <FieldValueList variant={variant} fields={[{ name: label, value: val }]} />;
};


export const baseHmrcOdxGdsSummaryCard = () => {
  const props = {
    template: 'DefaultForm',
    getPConnect: () => {
      return {
        getChildren: () => {
          return pyReviewRaw.children;
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
    <HmrcOdxGdsSummaryCard {...props}>
      {regionAChildren}
      {regionBChildren}
    </HmrcOdxGdsSummaryCard>
  );
};
