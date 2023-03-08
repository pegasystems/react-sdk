import React from 'react';
import renderer from 'react-test-renderer';
import TextInput from '../../../../src/components/BaseComponents/TextInput/TextInput';

it('renders correctly', () => {
  const tree = renderer
    .create(<TextInput>Facebook</TextInput>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

let name = "name";
let label = "label";

it('Basic single question text input', () => {
  let a = TextInput.propTypes;

  const tree = renderer
    .create(<TextInput name={name} label={label} labelIsHeading={true}></TextInput>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Basic single question password input', () => {
  let a = TextInput.propTypes;

  const tree = renderer
    .create(<TextInput name={name} label={label} labelIsHeading={true} inputProps={{type:"password"}}></TextInput>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('Basic multi question text input', () => {
  let a = TextInput.propTypes;

  const tree = renderer
    .create(<TextInput name={name} label={label} labelIsHeading={false}></TextInput>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});



it('Basic multi question text input with error', () => {
  let a = TextInput.propTypes;

  const tree = renderer
    .create(<TextInput name={name} label={label} labelIsHeading={false} errorText={"Something went wrong"}></TextInput>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});




it('Basic multi question text input with hint', () => {
  let a = TextInput.propTypes;

  const tree = renderer
    .create(<TextInput name={name} label={label} labelIsHeading={false} hintText={"Enter some text"}></TextInput>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});



it('Basic multi question text input with hint and error', () => {
  let a = TextInput.propTypes;

  const tree = renderer
    .create(<TextInput name={name} label={label} labelIsHeading={false} hintText={"Enter some text"} errorText={"Something went wrong"}></TextInput>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
