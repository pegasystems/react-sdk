import React, { createElement } from "react";
import PropTypes from "prop-types";
import { useTranslation } from 'react-i18next';
import createPConnectComponent from "@pega/react-sdk-components/lib/bridge/react_pconnect";

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import StyledYourOrgRequiredDxilDetailsWrapper from "./styles";

// Duplicated runtime code from React SDK

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxGdsInfoPanel(props) {
  const { panelType, panelHeader, panelLink, getPConnect } = props;

  const { t } = useTranslation();
  // Set display mode prop and re-create the children so this part of the dom tree renders
  // in a readonly (display) mode instead of a editable
  getPConnect().setInheritedProp("displayMode", "LABELS_LEFT");
  getPConnect().setInheritedProp("readOnly", true);
  const children = getPConnect()
    .getChildren()
    .map((configObject, index) =>
      createElement(createPConnectComponent(), {
        ...configObject,
        // eslint-disable-next-line react/no-array-index-key
        key: index.toString(),
      })
    );

  let panelTitle;
  switch (panelType) {
    case '1':
      panelTitle = t('INFORMATION');
      break;
    case '2':
      panelTitle = t('WARNING');
      break;
    default:
    case '3':
      panelTitle = t("SUCCESS");
      break;
  }

  return (
    <div className="govuk-notification-banner" role="region" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
      <div className="govuk-notification-banner__header">
        <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
          {panelTitle}
        </h2>
      </div>
      <div className="govuk-notification-banner__content">
        { panelHeader !== '' &&
          <h3 className="govuk-notification-banner__heading">
            {panelHeader}
          </h3>
        }
      {children.map((child, i) => (
        <p className="govuk-body" key={`r-${i + 1}`}>
          {child.props.value}
        </p>
        ))}
        { panelLink !== '' &&
          <a className="govuk-notification-banner__link" href={ panelLink }>More information</a>
        }
      </div>
    </div>
  );
}


// HmrcOdxGdsInfoPanel.defaultProps = {
//   showLabel: true
// };

HmrcOdxGdsInfoPanel.propTypes = {
  getPConnect: PropTypes.func.isRequired
};
