import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isUnAuthJourney } from '../../../helpers/utils';

import ActionButtons from '../ActionButtons';

export default function AssignmentCard(props) {
  const { children, actionButtons, onButtonPress } = props;

  const [arMainButtons, setArMainButtons] = useState([]);
  const [arSecondaryButtons, setArSecondaryButtons] = useState([]);

  useEffect(() => {
    if (actionButtons) {
      setArMainButtons(actionButtons.main);
      setArSecondaryButtons(actionButtons.secondary);
    }
  }, [actionButtons]);

  function buttonPress(sAction, sType) {
    onButtonPress(sAction, sType);
  }

  return (
    <>
      {children}
      {arMainButtons && arSecondaryButtons && (
        <ActionButtons
          arMainButtons={arMainButtons}
          arSecondaryButtons={arSecondaryButtons}
          onButtonPress={buttonPress}
          isUnAuth={isUnAuthJourney()}
        ></ActionButtons>
      )}
    </>
  );
}

AssignmentCard.propTypes = {
  children: PropTypes.node.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  itemKey: PropTypes.string,
  actionButtons: PropTypes.object,
  onButtonPress: PropTypes.func
  // buildName: PropTypes.string
};

AssignmentCard.defaultProps = {
  itemKey: null
  // buildName: null
};
