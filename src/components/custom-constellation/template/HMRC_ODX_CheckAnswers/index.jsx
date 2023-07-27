import { Grid } from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';

import StyledHmrcOdxCheckAnswersWrapper from './styles';


// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxCheckAnswers(props) {


  const { children, NumCols } = props;

  const nCols = parseInt(NumCols, 10);

  // console.log(`Rendering ${getPConnect()?.getComponentName()} with ${template} with ${children?.length} Region(s)`);

  return (
    <StyledHmrcOdxCheckAnswersWrapper>
    <Grid container={{
          cols: `repeat(${nCols}, minmax(0, 1fr))`,
          gap: 2,
          wrap: `wrap`
        }}>
          {children}
    </Grid>
    </StyledHmrcOdxCheckAnswersWrapper>
  );

}

HmrcOdxCheckAnswers.defaultProps = {
  NumCols: 1,
  children: []
};

HmrcOdxCheckAnswers.propTypes = {
  NumCols: PropTypes.number,
  children: PropTypes.arrayOf(PropTypes.node),
};
