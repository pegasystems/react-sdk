import React from 'react';
import renderer from 'react-test-renderer';
import Checkboxes from '../../../../src/components/BaseComponents/Checkboxes/Checkboxes';

let Props = Checkboxes.propTypes;



it("renders a group of 3 checkboxes, with legend 'heading' ", () => {
  let items = [
    { checked: false, label: 'Item 1', hintText: '', readOnly: false },
    { checked: false, label: 'Item 2', hintText: '', readOnly: false },
    { checked: false, label: 'Item 3', hintText: '', readOnly: false }
  ];
  const tree = renderer.create(<Checkboxes name="test-checkbox" label="heading" items={items} isSmall={false} labelIsHeading={true} errorText="" />).toJSON();
  expect(tree).toMatchSnapshot()
});


it("renders a group of 3 checkboxes, hint text for label", () => {
  let items = [
    { checked: false, label: 'Item 1', hintText: '', readOnly: false },
    { checked: false, label: 'Item 2', hintText: '', readOnly: false },
    { checked: false, label: 'Item 3', hintText: '', readOnly: false }
  ];
  const tree = renderer.create(<Checkboxes name="test-checkbox" label="heading" items={items} isSmall={false} labelIsHeading={true} errorText="" hintText={"Testing hint text"} />).toJSON();
  expect(tree).toMatchSnapshot()
});

it("renders a group of 3 checkboxes, hint text for items", () => {
  let items = [
    { checked: false, label: 'Item 1', hintText: 'testing item hint text', readOnly: false },
    { checked: false, label: 'Item 2', hintText: '', readOnly: false },
    { checked: false, label: 'Item 3', hintText: '', readOnly: false }
  ];
  const tree = renderer.create(<Checkboxes name="test-checkbox" label="heading" items={items} isSmall={false} labelIsHeading={true} errorText="" />).toJSON();
  expect(tree).toMatchSnapshot()
});


// TODO - Add this test case after Fieldset.tsx has been merged as it has the logic for error

// it("renders a group of 3 checkboxes, with error as expected ", () => {
//   let items = [
//     { checked: false, label: 'Item 1', hintText: '', readOnly: false },
//     { checked: false, label: 'Item 2', hintText: '', readOnly: false },
//     { checked: false, label: 'Item 3', hintText: '', readOnly: false }
//   ];
//   const tree = renderer.create(<Checkboxes label="heading" items={items} isSmall={false} labelIsHeading={true} errorText="A testing Error." />).toJSON();
//   expect(tree).toMatchSnapshot()
// });


// TODO - Add Test cases for functionality
