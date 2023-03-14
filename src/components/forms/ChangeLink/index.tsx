import React from 'react';
import PropTypes from 'prop-types';


declare const PCore;
//import { Input, Label, Link } from '@pega/cosmos-react-core';

//import StyledHmrcOdxChangeLinkWrapper from './styles';

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
const HmrcOdxChangeLink = props => {
  const { getPConnect, value, placeholder, disabled, readOnly, required, label, testId, stepId } =
    props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn?.getStateProps()?.value;

  const target = pConn.getTarget();
  const key = pConn.getCaseInfo().getKey();

  const containerItemID = pConn.getContextName(); // PCore.getContainerUtils().getContainerItemName(target, key);

  const handleOnChange = event => {
    const { value: updatedValue } = event.target;
    actions.updateFieldValue(propName, updatedValue);
  };

  const handleOnClick = () => {
    const navigateToStepPromise = actions.navigateToStep(stepId, containerItemID);

    navigateToStepPromise
      .then(() => {
        // navigate to step success handling
        // console.log('navigation successful');
      })
      .catch(error => {
        // navigate to step failure handling
        // console.log('navigation failed', error);
      });
  };

  return (
    <>
      <div style={{"display":"flex", "gap": "20px"}}>
        <span><h2 className="govuk-heading-m" >{label}</h2></span>
        <span style={{"marginLeft":"auto"}}><a href='#' className="govuk-link" onClick={handleOnClick}>Change<span className="govuk-visually-hidden"> {label}</span></a>
        </span>
      </div>

    </>
    /*
    <StyledHmrcOdxChangeLinkWrapper>
      <Link href='#' onClick={handleOnClick}>
        Change
      </Link>
    </StyledHmrcOdxChangeLinkWrapper>*/
  );
};

HmrcOdxChangeLink.defaultProps = {
  value: '',
  placeholder: '',
  disabled: false,
  readOnly: false,
  required: false,
  testId: null
};

HmrcOdxChangeLink.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  getPConnect: PropTypes.func.isRequired,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  testId: PropTypes.string
};

export default HmrcOdxChangeLink;
