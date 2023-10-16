import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../../BaseComponents/Button/Button';

export default function ActionButtons(props) {
  const { arMainButtons, arSecondaryButtons, onButtonPress } = props;
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const localeCategory = 'Assignment';
  function _onButtonPress(sAction: string, sButtonType: string) {
    onButtonPress(sAction, sButtonType);
  }

  return (
    <>
      <div className='govuk-button-group govuk-!-padding-top-4'>
        {arMainButtons.map(mButton =>
           mButton.name !== 'Hidden' ? (
            <Button
              variant='primary'
              onClick={e => {
                e.target.blur();
                _onButtonPress(mButton.jsAction, 'primary');
              }}
              key={mButton.actionID}
              attributes={{ type: 'button' }}
            >
              {localizedVal(mButton.name, localeCategory)}
            </Button>
          ) : null
        )}
        {arSecondaryButtons.map(sButton =>
          sButton.actionID !== 'back' &&
          sButton.name !== 'Hidden' &&
          sButton.name.indexOf('Save') === -1 ? (
            <Button
              variant='secondary'
              onClick={e => {
                e.target.blur();
                _onButtonPress(sButton.jsAction, 'secondary');
              }}
              key={sButton.actionID}
              attributes={{ type: 'button' }}
            >
              {localizedVal(sButton.name, localeCategory)}
            </Button>
          ) : null
        )}
      </div>

        {arSecondaryButtons.map(sButton =>
          sButton.actionID !== 'back' &&
          sButton.name !== 'Hidden' &&
          sButton.name.indexOf('Save') !== -1 ? (
            <Button
            variant='link'
              onClick={e => {
                e.target.blur();
                _onButtonPress(sButton.jsAction, 'secondary');
              }}
              key={sButton.actionID}
              attributes={{ type: 'link' }}
            >{localizedVal(sButton.name, localeCategory)}</Button>
          ) : null
        )}


    </>
  );
}

ActionButtons.propTypes = {
  arMainButtons: PropTypes.array,
  arSecondaryButtons: PropTypes.array,
  onButtonPress: PropTypes.func,
  // buildName: PropTypes.string
};

ActionButtons.defaultProps = {
  arMainButtons: [],
  arSecondaryButtons: []
  // buildName: null
};
