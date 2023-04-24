import React from 'react';
import PropTypes from 'prop-types';

// Duplicated runtime code from Constellation Design System Component

//  props passed in combination of props from property panel (config.json) and run time props from Constellation
//  any default values in config.pros should be set in defaultProps at bottom of this file
const HmrcOdxChangeLink = props => {
  const { getPConnect, label, stepId, testID } =
    props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();

  const containerItemID = pConn.getContextName();

  const handleOnClick = () => {
    const navigateToStepPromise = actions.navigateToStep(stepId, containerItemID);

    navigateToStepPromise
      .then(() => {
        //  navigate to step success handling
        console.log('navigation successful'); // eslint-disable-line
      })
      .catch(error => {
        // navigate to step failure handling
        // eslint-disable-next-line no-console
        console.log('Change link Navigation failed', error);
      });
  };

  return (
    <>
      <div className="govuk-!-margin-bottom-9" style={{"display":"flex", "gap": "20px"}} data-test-id={testID}>
        <span style={{"marginLeft":"auto"}}><a href='#' className="govuk-link" onClick={handleOnClick}>Change<span className="govuk-visually-hidden"> {label}</span></a>
        </span>
      </div>
    </>
  );
};

HmrcOdxChangeLink.propTypes = {
  label: PropTypes.string,
  getPConnect: PropTypes.func.isRequired,
};

export default HmrcOdxChangeLink;
