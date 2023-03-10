import React from 'react';
import renderer from 'react-test-renderer';
import DateInput from '../../../../src/components/BaseComponents/DateInput/DateInput';

it('renders correctly', () => {
  const tree = renderer
    .create(<DateInput></DateInput>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

const name = "name";
const label = "Date of birth";
const hintText = "hintText";
const errorText = "errorText";
const [day, month, year] = ["10", "2", "1990"];
const onChange = () => {};

it('Basic date input component with legend as h1', () => {
  let a = DateInput.propTypes;

  const tree = renderer.create(<DateInput
    legendIsHeading={true}
    onChangeDay={onChange}
    onChangeMonth={onChange}
    onChangeYear={onChange}
    errorText={errorText}
    hintText={hintText}
    name={name}
    label={label} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('Basic date input component hint and error', () => {
  let a = DateInput.propTypes;

  const tree = renderer.create(<DateInput
     legendIsHeading={false}
    errorText={errorText}
    hintText={hintText}
    name={name}
     label={label} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('Basic date input component prepoulated with a date', () => {
  let a = DateInput.propTypes;

  const tree = renderer.create(<DateInput
    value={{day, month, year}}
    errorText={errorText}
    name={name}
    label={label} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('Basic date input componentwith error applying to whole input', () => {
  let a = DateInput.propTypes;
  const tree = renderer
    .create(<DateInput
      errorText={errorText}
      name={name}
     label={label}
    />).toJSON();
  expect(tree).toMatchSnapshot();
});
