import React, { useEffect, useState, Fragment } from 'react';
import { registerNonEditableField } from '../../../helpers/hooks/QuestionDisplayHooks';
import PropTypes from 'prop-types';

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxMimicASentence(props) {
  const { children } = props;

  const [formElms, setFormElms] = useState<Array<React.ReactElement>>([]);

  registerNonEditableField();

  useEffect(() => {
    const elms:Array<React.ReactElement> = [];
    const region = children[0] ? children[0].props.getPConnect() : null;
    if (region?.getChildren()) {
      region.getChildren().forEach(child => {
        child.getPConnect().setInheritedProp('readOnly', true);
        elms.push(child.getPConnect().getComponent());
      });
      setFormElms(elms);
    }
  }, [children[0]]);

  return (
    <p className='govuk-body govuk-!-font-weight-bold govuk-!-margin-bottom-6'>
        {formElms.map((field, index) => {
          const key = `${field.props.inheritedProps.find(prop => prop.prop === "label").value.replace(/ /g,"_")}_${index}`;

          const formattedValue = field.props.DateTimeFormat
            ? new Date(field.props.value).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })
            : field.props.value;
          return <Fragment key={key}>{formattedValue} </Fragment>;
        })}
      </p>
  );
}

HmrcOdxMimicASentence.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};
