import React from "react";
import PropTypes from "prop-types";
// import { FieldGroup } from "@pega/cosmos-react-core";
// import { LazyMap as LazyComponentMap } from "../../components_map";
import { getAllFields} from '../templates/utils';

// Need to import any templates that we might render
import CaseSummary from '../templates/CaseSummary';
import CaseView from '../templates/CaseView';
import DefaultForm from '../templates/DefaultForm';
import Details from '../templates/Details';
import DetailsTwoColumn from '../templates/DetailsTwoColumn';
import ListPage from '../templates/ListPage';
import ListView from '../templates/ListView';
import NarrowWidePage from "../templates/NarrowWidePage";
import NarrowWideForm from "../templates/NarrowWideForm";
import NarrowWideDetails from "../templates/NarrowWideDetails";
import OneColumn from "../templates/OneColumn";
import OneColumnTab from '../templates/OneColumnTab';
import SimpleTable from '../templates/SimpleTable';
import SubTabs from '../templates/SubTabs';
import TwoColumn from '../templates/TwoColumn';
import TwoColumnPage from '../templates/TwoColumnPage';
import WideNarrowForm from "../templates/WideNarrowForm";
import WideNarrowPage from "../templates/WideNarrowPage";
import WideNarrowDetails from "../templates/WideNarrowDetails";
import DataReference from '../templates/DataReference';
//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//


const FORMTEMPLATES = [
  "OneColumn",
  "TwoColumn",
  "DefaultForm",
  "WideNarrow",
  "NarrowWide"
];


export default function View(props) {
  const { children, template, getPConnect, mode } = props;
  let { label = "label", showLabel = true } = props;

  // Get the inherited props from the parent to determine label settings. For 8.6, this is only for embedded data form views
  // Putting this logic here instead of copy/paste in every Form template index.js
  ({ label = "label", showLabel = true } = {
    label,
    showLabel,
    ...getPConnect().getInheritedProps()
  });

  const isEmbeddedDataView = mode === "editable"; // would be better to check the reference child for `context` attribute if possible
  if (isEmbeddedDataView && showLabel === undefined) {
    showLabel = true;
  }

  // As long as the template is defined in the dependencies of the view
  // it will be loaded, otherwise fall back to single column
  //  JA - React SDK not using LazyComponentMap yet
  if (template /* && LazyComponentMap[template] */) {

    // const ViewTemplate = LazyComponentMap[template];
    let ViewTemplate: any;

    switch(template) {
      case "CaseSummary":
        ViewTemplate = CaseSummary;
        break;

      case "CaseView":
        ViewTemplate = CaseView;
        break;

      case "DefaultForm":
        ViewTemplate = DefaultForm;
        break;

      case "Details":
        ViewTemplate = Details;
        break;

      case "DetailsTwoColumn":
        ViewTemplate = DetailsTwoColumn;
        break;

      case "ListPage":
        ViewTemplate = ListPage;
        break;

      case "ListView": {
        ViewTemplate = ListView;
        const bInForm = true;
        props = { ...props, bInForm};
        break;
      }

      case "NarrowWideForm":
        ViewTemplate= NarrowWideForm;
        break;

      case "NarrowWidePage":
        ViewTemplate= NarrowWidePage;
        break;

      case "NarrowWideDetails":
        ViewTemplate= NarrowWideDetails;
        break;

      case "OneColumn":
        ViewTemplate = OneColumn;
        break;

      case "OneColumnTab":
        ViewTemplate = OneColumnTab;
        break;

      case 'SimpleTable':
        ViewTemplate = SimpleTable;
        break;

      case "SubTabs":
        ViewTemplate = SubTabs;
        break;

      case "TwoColumn":
        ViewTemplate = TwoColumn;
        break;

      case "TwoColumnPage":
        ViewTemplate = TwoColumnPage;
        break;

      case "WideNarrowForm":
        ViewTemplate= WideNarrowForm;
        break;

      case "WideNarrowPage":
        ViewTemplate= WideNarrowPage;
        break;

      case "WideNarrowDetails":
        ViewTemplate= WideNarrowDetails;
        break;

      case "DataReference":
        ViewTemplate= DataReference;
        break;

      default:
        // eslint-disable-next-line no-console
        console.error(`View: Trying to render an unknown template: ${template}`);
        break;
    }

    // for debugging/investigation
    // console.log(`View rendering template: ${template}`);

    // spreading because all props should go to the template
    let RenderedTemplate = <ViewTemplate {...props}>{children}</ViewTemplate>;

    if (FORMTEMPLATES.includes(template) && showLabel) {

      // Original:
      // RenderedTemplate = (
      //   <FieldGroup name={label} style={{ marginBlockStart: "1rem" }}>
      //     {RenderedTemplate}
      //   </FieldGroup>
      // );
      RenderedTemplate = (
        <div data-name="RenderedTemplate" data-template-type={template} /* name */ id="label" style={{ marginBlockStart: "1rem" }}>
          {RenderedTemplate}
        </div>
      );

    }

    return RenderedTemplate;
  }

  // debugging/investigation help
  // console.log(`View about to render React.Fragment for children: ${children}`);

  if (children) {
    return <>{children}</>
  } else {
    return <div id="View">View has no children.</div>
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
    case "CaseSummary":
      allFields = getAllFields(thePConn);
      // eslint-disable-next-line no-case-declarations
      const unresFields = {
        primaryFields: allFields[0],
        secondaryFields: allFields[1]
      }
      propObj = thePConn.resolveConfigProps( unresFields );
      break;

    case "Details":
      allFields = getAllFields(thePConn);
      propObj = { fields: allFields[0] }
      break;

    default:
      break;

  }

  return propObj;
};
