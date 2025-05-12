import { PropsWithChildren } from 'react';

import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import { getAllFields } from '@pega/react-sdk-components/lib/components/helpers/template-utils';
import { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

// Need to import any templates that we might render

import './View.css';

interface ViewProps extends PConnProps {
  // If any, enter additional props that only exist on this component
  template?: string;
  label?: string;
  showLabel: boolean;
  mode?: string;
  title?: string;
  visibility?: boolean;
  name?: string;
  bInForm?: boolean;
}

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

const FORMTEMPLATES = ['OneColumn', 'TwoColumn', 'DefaultForm', 'WideNarrow', 'NarrowWide'];
const NO_HEADER_TEMPLATES = [
  'SubTabs',
  'SimpleTable',
  'Details',
  'DetailsTwoColumn',
  'DetailsThreeColumn',
  'NarrowWideDetails',
  'WideNarrowDetails',
  'Confirmation',
  'DynamicTabs'
];

export default function View(props: PropsWithChildren<ViewProps>) {
  const { children, template, getPConnect, mode, visibility, name: pageName } = props;
  let { label = '', showLabel = false } = props;

  // Get the inherited props from the parent to determine label settings. For 8.6, this is only for embedded data form views
  // Putting this logic here instead of copy/paste in every Form template index.js

  const inheritedProps: any = getPConnect().getInheritedProps(); // try to remove any when getInheritedProps typedefs are fixed
  label = inheritedProps.label || label;
  showLabel = inheritedProps.showLabel || showLabel;

  const isEmbeddedDataView = mode === 'editable'; // would be better to check the reference child for `context` attribute if possible
  if (isEmbeddedDataView && showLabel === undefined) {
    showLabel = true;
  }

  const key = `${getPConnect().getContextName()}_${getPConnect().getPageReference()}_${pageName}`;
  // As long as the template is defined in the dependencies of the view
  // it will be loaded, otherwise fall back to single column
  if (visibility === false) {
    return '';
  }

  // As long as the template is defined in the dependencies of the view
  // it will be loaded, otherwise fall back to single column
  //  JA - React SDK not using LazyComponentMap yet
  if (template /* && LazyComponentMap[template] */) {
    // const ViewTemplate = LazyComponentMap[template];
    const ViewTemplate: any = getComponentFromMap(template);

    if (template === 'ListView') {
      // special case for ListView - add in a prop
      const bInForm = true;
      props = { ...props, bInForm };
    }

    // for debugging/investigation
    // console.log(`View rendering template: ${template}`);

    // spreading because all props should go to the template
    let RenderedTemplate = (
      <ViewTemplate key={key} {...props}>
        {children}
      </ViewTemplate>
    );

    if (FORMTEMPLATES.includes(template) && showLabel) {
      // Original:
      // RenderedTemplate = (
      //   <FieldGroup name={label} style={{ marginBlockStart: "1rem" }}>
      //     {RenderedTemplate}
      //   </FieldGroup>
      // );
      RenderedTemplate = (
        <div
          data-name='RenderedTemplate'
          data-template-type={template}
          /* name */ id='label'
          style={{ marginBlockStart: '1rem' }}
          className='grid-column'
        >
          {RenderedTemplate}
        </div>
      );
    }

    return (
      <div className='grid-column'>
        {/* {showLabel && !NO_HEADER_TEMPLATES.includes(template) && (
          <div className='template-title-container'>
            <span>{label}</span>
          </div>
        )} */}
        {RenderedTemplate}
      </div>
    );
  }

  // debugging/investigation help
  // console.log(`View about to render React.Fragment for children: ${children}`);

  if (children) {
    return <>{children}</>;
  }

  return null;
}

// Adapted from Constellation DX Component to add in additional props for some templates
View.additionalProps = (state, getPConnect) => {
  const thePConn = getPConnect();
  const { template } = thePConn.getConfigProps();

  let propObj = {};
  let allFields = {};

  switch (template) {
    case 'CaseSummary':
      allFields = getAllFields(thePConn);
      // eslint-disable-next-line no-case-declarations
      const unresFields = {
        primaryFields: allFields[0],
        secondaryFields: allFields[1]
      };
      propObj = thePConn.resolveConfigProps(unresFields);
      break;

    case 'Details':
      allFields = getAllFields(thePConn);
      propObj = { fields: allFields[0] };
      break;

    default:
      break;
  }

  return propObj;
};
