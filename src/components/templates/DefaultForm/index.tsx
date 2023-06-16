import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { getInstructions } from '../utils';
import createPConnectComponent from '../../../bridge/react_pconnect';
import connectToState from '../../../utils/state-utils';
import { getKeyForMappedField, mapStateToProps } from './utils';

import './DefaultForm.css';

const Child = connectToState(mapStateToProps)(props => {
  const { key, visibility, ...rest } = props;

  return createElement(createPConnectComponent(), { ...rest, key, visibility });
});

export default function DefaultForm(props) {
  const { getPConnect, NumCols } = props;
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
  const dfChildren = arChildren.map(kid => <Child key={getKeyForMappedField(kid)} {...kid} />);

  return (
    <>
      {instructions && (
        <div className='psdk-default-form-instruction-text'>
          {/* server performs sanitization method for instructions html content */}
          { /* eslint-disable react/no-danger */ }
          <div key='instructions' dangerouslySetInnerHTML={{ __html: instructions }} />
        </div>
      )}
      <div className={divClass}>{dfChildren}</div>
    </>
  );
}

DefaultForm.propTypes = {
  // children: PropTypes.arrayOf(PropTypes.node).isRequired,
  NumCols: PropTypes.string
};

DefaultForm.defaultProps = {
  NumCols: '1'
};
