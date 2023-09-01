import React from 'react';
import PropTypes from 'prop-types';
// import { FieldGroup } from "@pega/cosmos-react-core";
// import { LazyMap as LazyComponentMap } from "../../components_map";

import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
// import ErrorBoundary from '@pega/react-sdk-components/lib/components/infra/ErrorBoundary';

import { getAllFields } from '@pega/react-sdk-components/lib/components/helpers/template-utils';

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
  'Confirmation'
];

export default function View(props) {
  const { children, template, getPConnect, mode, visibility, name: pageName } = props;
  let { label, showLabel = false } = props;

  // Get the inherited props from the parent to determine label settings. For 8.6, this is only for embedded data form views
  // Putting this logic here instead of copy/paste in every Form template index.js

  const inheritedProps = getPConnect().getInheritedProps();
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
    const ViewTemplate = getComponentFromMap(template);

    // for debugging/investigation
    // console.log(`View rendering template: ${template}`);

    // spreading because all props should go to the template
    let RenderedTemplate = <ViewTemplate key={key} {...props}>{children}</ViewTemplate>;

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
        >
          {RenderedTemplate}
        </div>
      );
    }

    return (
      <>
        {showLabel && !NO_HEADER_TEMPLATES.includes(template) && (
          <h2 className='govuk-heading-m'>{label}</h2>
        )}
        {RenderedTemplate}
      </>
    );
  }

  // debugging/investigation help
  // console.log(`View about to render React.Fragment for children: ${children}`);

  if (children) {
    return <>{children}</>;
  }

  return null;
}

View.defaultProps = {
  label: undefined,
  showLabel: undefined,
  mode: undefined
};

View.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.array
  ]) /* array might be empty */,
  template: PropTypes.string /* .isRequired */,
  getPConnect: PropTypes.func.isRequired,
  label: PropTypes.string,
  showLabel: PropTypes.bool,
  mode: PropTypes.string,
  title: PropTypes.string
};

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
