import React from 'react';
import renderer from 'react-test-renderer';
import RadioButtons from '../../../../src/components/BaseComponents/RadioButtons/RadioButtons';

let Props = RadioButtons.propTypes;

it("renders basic radio button set with 3 options, legend is heading", () => {
  let radioButtonOptions = [{key:"Option1", value:"Option 1"}, {key:"Option2", value:"Option 2"}, {key:"Option3", value:"Option 3"}]
  const tree = renderer.create(<RadioButtons name={"radioButtons"}
                                  displayInline={radioButtonOptions.length === 2}
                                  options={radioButtonOptions}
                                  label={"Radio Buttons 3 options"}
                                  legendIsHeading={true}
                                />) .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders basic radio button set with 2 options (displays inline), legend is not heading", () => {
  let radioButtonOptions = [{key:"Option1", value:"Option 1"}, {key:"Option2", value:"Option 2"}]
  const tree = renderer.create(<RadioButtons name={"radioButtons"}
                                  displayInline={radioButtonOptions.length === 2}
                                  options={radioButtonOptions}
                                  label={"Radio Buttons 2 options"}
                                  legendIsHeading={false}
                                />) .toJSON();
  expect(tree).toMatchSnapshot();
});


it("renders basic radio button set with 3 options, legend is heading with hint and error text", () => {
  let radioButtonOptions = [{key:"Option1", value:"Option 1"}, {key:"Option2", value:"Option 2"}, {key:"Option3", value:"Option 3"}]
  const tree = renderer.create(<RadioButtons name={"radioButtons"}
                                  displayInline={radioButtonOptions.length === 2}
                                  options={radioButtonOptions}
                                  label={"Radio Buttons 3 options"}
                                  legendIsHeading={true}
                                  hintText={"Helpful text for radio buttons"}
                                  errorText={"Please select an option"}
                                />) .toJSON();
  expect(tree).toMatchSnapshot();
});


it("renders basic radio button set with 3 options, legend is not heading, options have hint text", () => {
  let radioButtonOptions = [{key:"Option1", value:"Option 1", hintText:"For example, 1,one"}, {key:"Option2", value:"Option 2", hintText:"For example 2,two"}, {key:"Option3", value:"Option 3", hintText:"For example 3,three"}]
  const tree = renderer.create(<RadioButtons name={"radioButtons"}
                                  displayInline={radioButtonOptions.length === 2}
                                  options={radioButtonOptions}
                                  label={"Radio Buttons 3 options"}
                                  legendIsHeading={false}
                                />) .toJSON();
  expect(tree).toMatchSnapshot();
});
