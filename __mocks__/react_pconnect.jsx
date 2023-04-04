/* eslint-disable no-plusplus */
import TextInput from '@pega/react-sdk-components/lib/components/field/TextInput';
import AutoComplete from '@pega/react-sdk-components/lib/components/field/AutoComplete';
import Email from '@pega/react-sdk-components/lib/components/field/Email';
import Phone from '@pega/react-sdk-components/lib/components/field/Phone';
import Operator from '@pega/react-sdk-components/lib/components/designSystemExtension/Operator';
import Currency from '@pega/react-sdk-components/lib/components/field/Currency';
import RadioButtons from '@pega/react-sdk-components/lib/components/field/RadioButtons';

// Making TextInput the default component
let compType = TextInput;
let formIndex = 0;
let detailsIndex = 0;
let detailsRegionIndex = 0;

const createPConnectComponent = () => {
  const formComponents = [TextInput, TextInput,TextInput, Phone, AutoComplete, Email];
  const detailsComponents = [TextInput, TextInput, TextInput, Email, Phone, Currency, RadioButtons, Operator];
  const detailsRegionComponents = [TextInput, TextInput, TextInput, Email, Phone, Currency, RadioButtons, TextInput, TextInput, TextInput, Email, Phone, Currency, Operator];

  let component;

  switch(compType){
    case "Details":
      if(detailsIndex >= detailsComponents.length){
        detailsIndex = 0;
      }
      component = detailsComponents[detailsIndex++];
      break;

    case "DetailsRegion":
      if(detailsRegionIndex >= detailsRegionComponents.length){
        detailsRegionIndex = 0;
      }
      component = detailsRegionComponents[detailsRegionIndex++];
      break;

    default:
      if(formIndex >= formComponents.length){
        formIndex = 0;
      }
      component = formComponents[formIndex++];
  }

  return component;
}
export default createPConnectComponent;

// The decorator to be used in ./storybook/preview to apply the mock to all stories

export function decorator(story, parameters) {
  compType = parameters.parameters?.type;
  return story();
}
