// utilizing theming, comment out, if want individual style
// import styled from 'styled-components';
// import { Configuration } from '@pega/cosmos-react-core';

// export default styled(Configuration)``;

// individual style, comment out above, and uncomment here and add styles
// import styled from 'styled-components';

// export const StyledHmrcOdxSectionBasedWrapper = styled('div')`
//   padding: 20px;
//   background-color: orange;
// `;

// export const StyledRegion = styled('div')`
//   padding: 20px;
//   background-color: lightblue;
//   border: 1px solid #ccc;
//   margin-bottom: 10px;
//   border-radius: 5px;
// `;

import styled, { css } from 'styled-components';

export default styled.div(() => {
  return css`
    .sectionBased {
      padding: 0px 48px;
    }

    .sectionBased-region {
      border-bottom: 3px solid rgb(222, 224, 226);
      padding: 20px 0;
      margin-bottom: 20px;
    }

    .sectionBased-region > fieldset > legend > div > div > span {
      font-family: 'TransportBold', Arial, sans-serif;
      font-size: max(1.0625rem, 25px) !important;
    }

    .sectionBased-region > fieldset h3 {
      font-family: 'TransportBold', Arial, sans-serif;
      font-size: max(1.0625rem, 21px) !important;
    }

    .sectionBased-region > fieldset > div fieldset > legend span {
      font-family: 'TransportLight', Arial, sans-serif;
      font-size: max(1.0625rem, 21px) !important;
    }

    .sectionBased-region > fieldset > fieldset > fieldset legend span {
      font-family: 'TransportLight', Arial, sans-serif;
      font-size: max(1.0625rem, 21px) !important;
    }

    .sectionBased-region fieldset fieldset legend + div span {
      // helper text
      font-size: 16px;
    }

    .sectionBased-region input + div span {
      font-family: 'TransportLight', Arial, sans-serif;
      font-size: max(1.0625rem, 19px);
    }

    .sectionBased-region fieldset fieldset fieldset legend > div > div > span {
      font-family: 'TransportBold', Arial, sans-serif !important;
    }

    .sectionBased-region > fieldset > div legend,
    .sectionBased-region > fieldset > div legend span,
    .sectionBased-region > fieldset > div label,
    .sectionBased-region fieldset legend,
    .sectionBased-region fieldset legend span,
    .sectionBased-region fieldset label {
      color: #000000;
      font-family: 'TransportBold', Arial, sans-serif;
      font-size: max(1.0625rem, 19px) !important;
    }

    .sectionBased-region > fieldset > div input + label,
    .sectionBased-region fieldset input + label {
      font-family: 'TransportLight', Arial, sans-serif;
    }

    .sectionBased-region fieldset {
      border-bottom: none;
    }
  `;
});
