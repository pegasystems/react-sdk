import React from 'react';
import PropTypes from 'prop-types';
import FieldSet from '../FormGroup/FieldSet';
import HintTextComponent from '../../helpers/formatters/ParsedHtml';

// TODO Consider solution to allow for a text divider and/or catch all option, as described here: https://design-system.service.gov.uk/components/radios/divider/index.html

export default function RadioButtons(props) {
  const { name, onChange, displayInline, value, useSmallRadios = false, options } = props;

  const radioDivClasses = `govuk-radios ${displayInline ? 'govuk-radios--inline' : ''} ${
    useSmallRadios ? 'gobuk-radios--small' : ''
  }`.trim();


  return (
    <FieldSet {...props}>
      <div className={radioDivClasses} data-module='govuk-radios'>
        {options.map((option, index) => {
          const itemId = `${name}${index > 0 ? `-${index}` : ''}`.trim();
          const itemHintId = `${itemId}-item-hint`;
          let ariaDescBy = {};
          if(option.hintText){
            ariaDescBy = {'aria-describedby' : itemHintId};
          }
          return (
            <div key={`${name}_${option.value}`} className='govuk-radios__item'>
              <input
                className='govuk-radios__input'
                id={itemId}
                name={name}
                type='radio'
                onChange={onChange}
                value={option.value}
                defaultChecked={option.value === value}
                {...ariaDescBy}
              />
              <label className='govuk-label govuk-radios__label' htmlFor={itemId}>
                {option.label}
              </label>
              {option.hintText && (
                <div id={itemHintId} className='govuk-hint govuk-radios__hint'>
                  <HintTextComponent htmlString={option.hintText} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </FieldSet>
  );
}

RadioButtons.propTypes = {
  ...FieldSet.propTypes,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  displayInline: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })),
  useSmallRadios: PropTypes.bool
};
