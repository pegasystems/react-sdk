// utilizing theming, comment out, if want individual style
import styled, { css } from 'styled-components';
// import { Configuration } from '@pega/cosmos-react-core';

// export default styled(Configuration)``;

// individual style, comment out above, and uncomment here and add styles
// import styled, { css } from 'styled-components';
//
export default styled.div(() => {
  return css`
    margin: 0px 0;

    .u-hide {
      display: none !important;
    }

    .tl-right_align {
      display: block;
      float: right;
    }

    ul li {
      margin-inline-start: 0 !important;
    }

    label[for='SelectedTask'],
    #SelectedTask {
      display: none;
    }

    svg {
      display: none;
    }
  `;
});
