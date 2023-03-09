import TextInput from '@pega/react-sdk-components/lib/components/field/TextInput';
import AutoComplete from '@pega/react-sdk-components/lib/components/field/AutoComplete';
import Email from '@pega/react-sdk-components/lib/components/field/Email';
import Phone from '@pega/react-sdk-components/lib/components/field/Phone';

let index = 0;

const createPConnectComponent = () => {
  const components = [TextInput, TextInput, TextInput, Phone, AutoComplete, Email];

  if(index > 5){
    index = 0;
  }
  // eslint-disable-next-line no-plusplus
  return components[index++];
}

export default createPConnectComponent;

// The decorator to be used in ./storybook/preview to apply the mock to all stories

export function decorator(story) {
  return story();
}
