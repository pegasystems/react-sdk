import React from 'react';
import PropTypes from 'prop-types';
import { getAllFields } from '../templates/utils';

// Need to import any templates that we might render
import CaseSummary from '../templates/CaseSummary';
import CaseView from '../templates/CaseView';
import DefaultForm from '../templates/DefaultForm';
import Details from '../templates/Details';
import DetailsTwoColumn from '../templates/DetailsTwoColumn';
import DetailsThreeColumn from '../templates/DetailsThreeColumn';
import ListPage from '../templates/ListPage';
import ListView from '../templates/ListView';
import NarrowWidePage from '../templates/NarrowWidePage';
import NarrowWideForm from '../templates/NarrowWideForm';
import NarrowWideDetails from '../templates/NarrowWideDetails';
import OneColumn from '../templates/OneColumn';
import OneColumnTab from '../templates/OneColumnTab';
import SimpleTable from '../templates/SimpleTable';
import SubTabs from '../templates/SubTabs';
import TwoColumn from '../templates/TwoColumn';
import TwoColumnPage from '../templates/TwoColumnPage';
import WideNarrowForm from '../templates/WideNarrowForm';
import WideNarrowPage from '../templates/WideNarrowPage';
import WideNarrowDetails from '../templates/WideNarrowDetails';
import DataReference from '../templates/DataReference';
import OneColumnPage from '../templates/OneColumnPage';
import InlineDashboardPage from '../templates/InlineDashboardPage';
import DetailsSubTabs from '../templates/Details/SubTabs';
import TwoColumnTab from '../templates/TwoColumnTab';
import CheckAnswers from '../templates/CheckAnswers'

import './View.css';
//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

export default function View(props) {
  const { children, template, getPConnect, mode } = props;
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

  // As long as the template is defined in the dependencies of the view
  // it will be loaded, otherwise fall back to single column
  //  JA - React SDK not using LazyComponentMap yet
  if (template /* && LazyComponentMap[template] */) {
    // const ViewTemplate = LazyComponentMap[template];
    let ViewTemplate: any;

    switch (template) {
      case 'CaseSummary':
        ViewTemplate = CaseSummary;
        break;

      case 'CaseView':
        ViewTemplate = CaseView;
        break;

      case 'DefaultForm':
        ViewTemplate = DefaultForm;
        break;

      case 'Details':
        ViewTemplate = Details;
        break;

      case 'DetailsTwoColumn':
        ViewTemplate = DetailsTwoColumn;
        break;

      case 'DetailsThreeColumn':
        ViewTemplate = DetailsThreeColumn;
        break;

      case 'ListPage':
        ViewTemplate = ListPage;
        break;

      case 'ListView': {
        ViewTemplate = ListView;
        const bInForm = true;
        props = { ...props, bInForm };
        break;
      }

      case 'NarrowWideForm':
        ViewTemplate = NarrowWideForm;
        break;

      case 'NarrowWidePage':
        ViewTemplate = NarrowWidePage;
        break;

      case 'NarrowWideDetails':
        ViewTemplate = NarrowWideDetails;
        break;

      case 'OneColumn':
        ViewTemplate = OneColumn;
        break;

      case 'OneColumnTab':
        ViewTemplate = OneColumnTab;
        break;

      case "TwoColumnTab":
        ViewTemplate = TwoColumnTab;
        break;

      case 'SimpleTable':
        ViewTemplate = SimpleTable;
        break;

      case 'SubTabs':
        ViewTemplate = SubTabs;
        break;

      case 'DetailsSubTabs':
        ViewTemplate = DetailsSubTabs;
        break;

      case 'OneColumnPage':
        ViewTemplate = OneColumnPage;
        break;

      case 'TwoColumn':
        ViewTemplate = TwoColumn;
        break;

      case 'TwoColumnPage':
        ViewTemplate = TwoColumnPage;
        break;

      case 'WideNarrowForm':
        ViewTemplate = WideNarrowForm;
        break;

      case 'WideNarrowPage':
        ViewTemplate = WideNarrowPage;
        break;

      case 'WideNarrowDetails':
        ViewTemplate = WideNarrowDetails;
        break;

      case 'InlineDashboardPage':
        ViewTemplate = InlineDashboardPage;
        break;

      case 'DataReference':
        ViewTemplate = DataReference;
        break;

      case 'HMRC_ODX_CheckAnswers':
        ViewTemplate = CheckAnswers;
        break;

      default:
        // eslint-disable-next-line no-console
        console.error(`View: Trying to render an unknown template: ${template}`);
        break;
    }

    // spreading because all props should go to the template
    const RenderedTemplate = <ViewTemplate {...props}>{children}</ViewTemplate>;

    return (
      <>
        {showLabel && template !== 'SubTabs' && template !== 'SimpleTable' && (
          <h2 className='govuk-heading-m'>{label}</h2>
        )}
        {RenderedTemplate}
      </>
    );
  }

  if (children) {
    return <>{children}</>;
  } else {
    return <div id='View'>View has no children.</div>;
  }
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

// Adapted from Nebula/Constellation to add in additional props for some templates
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
