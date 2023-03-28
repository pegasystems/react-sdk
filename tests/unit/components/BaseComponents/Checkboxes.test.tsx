import React from 'react';
import renderer from 'react-test-renderer';
import Checkboxes from '../../../../src/components/BaseComponents/Checkboxes/Checkboxes';

let Props = Checkboxes.propTypes;



it("renders a group of 3 checkboxes, with legend 'heading' ", () => {
  let optionsList = [
    { checked: false, label: 'Item 1', hintText: '', readOnly: false },
    { checked: false, label: 'Item 2', hintText: '', readOnly: false },
    { checked: false, label: 'Item 3', hintText: '', readOnly: false }
  ];
  const tree = renderer.create(<Checkboxes name="test-checkbox" label="heading" optionsList={optionsList} legendIsHeading={true} errorText="" />).toJSON();
  expect(tree).toMatchSnapshot()
});


it("renders a group of 3 checkboxes, hint text for label", () => {
  let optionsList = [
    { checked: false, label: 'Item 1', hintText: '', readOnly: false },
    { checked: false, label: 'Item 2', hintText: '', readOnly: false },
    { checked: false, label: 'Item 3', hintText: '', readOnly: false }
  ];
  const tree = renderer.create(<Checkboxes name="test-checkbox" label="heading" optionsList={optionsList} legendIsHeading={true} errorText="" hintText={"Testing hint text"} />).toJSON();
  expect(tree).toMatchSnapshot()
});

it("renders a group of 3 checkboxes, hint text for optionsList", () => {
  let optionsList = [
    { checked: false, label: 'Item 1', hintText: 'testing item hint text', readOnly: false },
    { checked: false, label: 'Item 2', hintText: '', readOnly: false },
    { checked: false, label: 'Item 3', hintText: '', readOnly: false }
  ];
  const tree = renderer.create(<Checkboxes name="test-checkbox" label="heading" optionsList={optionsList} legendIsHeading={true} errorText="" />).toJSON();
  expect(tree).toMatchSnapshot()
});

it("renders a group of 3 checkboxes, with error as expected ", () => {
  let optionsList = [
    { checked: false, label: 'Item 1', hintText: '', readOnly: false },
    { checked: false, label: 'Item 2', hintText: '', readOnly: false },
    { checked: false, label: 'Item 3', hintText: '', readOnly: false }
  ];
  const tree = renderer.create(<Checkboxes name="test-checkbox" label="heading" optionsList={optionsList} legendIsHeading={true} errorText="A testing Error." />).toJSON();
  expect(tree).toMatchSnapshot()
});
