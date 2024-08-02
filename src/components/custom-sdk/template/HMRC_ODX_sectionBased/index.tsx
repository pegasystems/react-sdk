import { createElement, PropsWithChildren } from 'react';

import { getInstructions } from '@pega/react-sdk-components/lib/components/helpers/template-utils';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';
import connectToState from '@pega/react-sdk-components/lib/components/helpers/state-utils';

import { getKeyForMappedField, mapStateToProps } from './utils';
import { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

import './DefaultForm.css';
import StyledHmrcOdxSectionBasedWrapper from './styles';
import React from 'react';

interface HmrcOdxSectionBasedProps extends PConnProps {
  // If any, enter additional props that only exist on this component
  NumCols: string;
  instructions: string;
}

const Child = connectToState(mapStateToProps)(props => {
  const { key, visibility, ...rest } = props;

  return createElement(createPConnectComponent(), { ...rest, key, visibility });
});

// Duplicated runtime code from React SDK

// props passed in combination of props from property panel (config.json) and run time props from Constellation
export default function HmrcOdxSectionBased(props: PropsWithChildren<HmrcOdxSectionBasedProps>) {
  const { getPConnect, NumCols = '1' } = props;
  const instructions = getInstructions(getPConnect(), props.instructions);

  let divClass: string;

  const numCols = NumCols || '1';
  switch (numCols) {
    case '1':
      divClass = 'psdk-default-form-one-column';
      break;
    case '2':
      divClass = 'psdk-default-form-two-column';
      break;
    case '3':
      divClass = 'psdk-default-form-three-column';
      break;
    default:
      divClass = 'psdk-default-form-one-column';
      break;
  }

  // debugger;

  // repoint the children because they are in a region and we need to not render the region
  // to take the children and create components for them, put in an array and pass as the
  // defaultForm kids
  const arChildren = getPConnect().getChildren()[0].getPConnect().getChildren();
  const dfChildren = arChildren?.map(kid => <Child key={getKeyForMappedField(kid)} {...kid} />);

  return (
    <StyledHmrcOdxSectionBasedWrapper>
      <>
        {instructions && (
          <div className='psdk-default-form-instruction-text'>
            {/* server performs sanitization method for instructions html content */}
            {/* eslint-disable react/no-danger */}
            <div
              key='instructions'
              id='instruction-text'
              dangerouslySetInnerHTML={{ __html: instructions }}
            />
          </div>
        )}
        <div className={divClass}>{dfChildren}</div>
      </>
    </StyledHmrcOdxSectionBasedWrapper>
  );
}
