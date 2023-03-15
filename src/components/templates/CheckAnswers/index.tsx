import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';

// import { Grid, Flex } from '@pega/cosmos-react-core';
//  import { DriveEtaTwoTone } from '@material-ui/icons';
// import StyledHmrcOdxCheckAnswersWrapper from './styles';

//  Duplicated runtime code from Constellation Design System Component

//  props passed in combination of props from property panel (config.json) and run time props from Constellation
//  any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxCheckAnswers(props) {
  const { children } = props; //  , template, label, NumCols

  //  let nCols = parseInt(NumCols);
  const [formElms, setFormElms] = useState([null]);

  // console.log(`Rendering ${getPConnect()?.getComponentName()} with ${template} with ${children?.length} Region(s)`);

  useEffect(() => {
    const elms = [null];
    const region = children[0] ? children[0].props.getPConnect() : null;
    if (region?.getChildren()) {
      region.getChildren().forEach(child => {
        child.getPConnect().setInheritedProp('readOnly', true);
        child.getPConnect().setInheritedProp('showLabel', false);
        elms.push(child.getPConnect().getComponent());
      });
      setFormElms(elms);
    }
  }, [children[0]]);

  return (
    <div>
      {formElms.map((field) => (
        <dl key={`check-answers-${field}`} className='govuk-summary-list govuk-!-margin-bottom-9'>
          <Fragment key={field}>{field}</Fragment>
        </dl>
      ))}
    </div>
    /*
    <StyledHmrcOdxCheckAnswersWrapper>

    </StyledHmrcOdxCheckAnswersWrapper> */
  );
}

HmrcOdxCheckAnswers.defaultProps = {
  NumCols: 1,
  templateOverrideMode: 'USE_TEMPLATE',
  children: []
};

HmrcOdxCheckAnswers.propTypes = {
  NumCols: PropTypes.number,
  templateOverrideMode: PropTypes.string,
  // label: PropTypes.string,
  getPConnect: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node), // isRequired
  // template: PropTypes.string.isRequired
};
