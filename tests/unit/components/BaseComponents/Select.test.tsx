import React from 'react';
import renderer from 'react-test-renderer';
import Select from '../../../../src/components/BaseComponents/Select/Select';

it('renders correctly', () => {
  const tree = renderer
    .create(<Select></Select>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

const name = "name";
const label = "label";
const hintText = "hintText";
const errorText = "errorText";
const options = [{key:"Option_1", value:"Option 1"}, {key:"Option_2", value:"Option 2"}]
const onChange = () => {};

it('Basic single question select input', () => {
  let a = Select.propTypes;

  const tree = renderer
    .create(<Select name={name} label={label} labelIsHeading={true} onChange={onChange}>
      {options.map(option => {return (<option key={option.key} value={option.value}>{option.value}</option>)})}
    </Select>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Basic multi question select input', () => {
  const tree = renderer
    .create(<Select name={name} label={label} labelIsHeading={false} onChange={onChange}>
      {options.map(option => {return (<option key={option.key} value={option.value}>{option.value}</option>)})}
    </Select>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Basic select input with hint and error text', () => {
    const tree = renderer
    .create(<Select name={name} label={label} onChange={onChange} hintText={hintText} errorText={errorText}>
      {options.map(option => {return (<option key={option.key} value={option.value}>{option.value}</option>)})}
    </Select>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Basic select with pre-selected value', () => {
  const tree = renderer
  .create(<Select name={name} label={label} onChange={onChange} hintText={hintText} value={"Option 2"}>
    {options.map(option => {return (<option key={option.key} value={option.value}>{option.value}</option>)})}
  </Select>)
  .toJSON();
expect(tree).toMatchSnapshot();
});
