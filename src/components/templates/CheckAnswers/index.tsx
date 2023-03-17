import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';

//  props passed in combination of props from property panel (config.json) and run time props from Constellation
//  any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxCheckAnswers(props) {
  const { children } = props;

  const [formElms, setFormElms] = useState<Array<React.ReactElement>>([]);

  props.getPConnect().setInheritedProp('partOfCheckAnswers', true);

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
    <div>
      {formElms.map((field, index) => {
          const key = `${field.props.inheritedProps.find(prop => prop.prop === "label").value.replace(/ /g,"_")}_${index}`;

          return (<Fragment key={key}>{field}</Fragment>)
      })}
    </div>
  );
}

HmrcOdxCheckAnswers.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};
