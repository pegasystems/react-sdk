import React from 'react';
import renderer from 'react-test-renderer';
import ErrorSummary from '../../../../src/components/BaseComponents/ErrorSummary/ErrorSummary';

it('renders correctly', () => {
  const tree = renderer
    .create(<ErrorSummary errors={[]}></ErrorSummary>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Renders an error summary component with 3 errors listed', () => {
  let a = ErrorSummary.propTypes;

  const tree = renderer
    .create(<ErrorSummary errors={[{message:'Cannot be blank', fieldId:'textInput1'},
                                  {message:'Date cannot be in the past', fieldId:'dateInput1'},
                                  {message:'Date Cannot be in the future', fieldId:'dateInput2'}
                                ]} />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
