import React, { useRef} from 'react';
import PropTypes from 'prop-types';
import FieldSet from '../FormGroup/FieldSet';
import GDSCheckbox from './Checkbox'
// import { Checkboxes as govukCheckbox} from 'govuk-frontend/govuk/all';

export default function Checkboxes(props) {
  const {
    optionsList,
    onBlur,
    inputProps,
    exclusiveOption
  } = props;


  // This snippet works to get the govuk-frontend code working BUT it doesn't allow any extension for
  // calling the on change handlers of each check box, therefore the 'behind the scenes' values are not
  // updated and the unchecking of checkboxes doesn't actually get applied
  // (The govuk-frontend changes the checked attribute of each checkbox, this doesn't trigger an onchange)

  const checkboxElement = useRef(null);

  function onExclusiveClick(exclusiveOptopnIndex){
    optionsList.forEach((element, index) => {
      if(index !== exclusiveOptopnIndex){
        element.onChange({target: {checked: false}});
      }
    });

  }


  const checkboxClasses = `govuk-checkboxes`;

  return (
    <FieldSet {...props}>
      <div className={checkboxClasses} data-module="govuk-checkboxes"  ref={checkboxElement}>
        {optionsList.map((item, index) => {
            return (<GDSCheckbox
              item={item}
              index={index}
              name={item.name}
              inputProps={...inputProps}
              onChange={(evt) => {
                item.onChange(evt);
                if(exclusiveOption){
                  exclusiveOption.onChange({target: {checked: false}});
                }
              }}
              onBlur={onBlur}
              key={item.name}
            />)
          })
        }

        {exclusiveOption &&
          <>
            <div className="govuk-checkboxes__divider">or</div>
            <GDSCheckbox
              item={exclusiveOption}
              index={optionsList.length}
              name={exclusiveOption.name}
              inputProps={...inputProps}
              onChange={(evt) => {
                exclusiveOption.onChange(evt);
                onExclusiveClick(optionsList.length);
              }}
              onBlur={onBlur}
              key={exclusiveOption.name}
            />
            </>
        }
      </div>
    </FieldSet>
  );
}

Checkboxes.propTypes = {
  name: PropTypes.string,
  optionsList: PropTypes.arrayOf(PropTypes.shape({
    checked: PropTypes.bool,
    label: PropTypes.string,
    hintText: PropTypes.string,
    readOnly:PropTypes.bool,
    onChange:PropTypes.func})
  ),
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  exclusiveOption: PropTypes.object,
  ...FieldSet.propTypes ,
};
