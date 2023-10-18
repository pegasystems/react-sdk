import React from 'react';
import FieldValueList from '../../designSystemExtensions/FieldValueList';
import PropTypes from 'prop-types';

function CommaSeparatedList(props) {
  const { items } = props;

  return (
    <ul style={{ padding: '0', margin: '0' }}>
      {items.map((value) => {
        return <span>{value}</span>;
      })}
    </ul>
  );
}

export default function ScalarList(props) {
  const {
    label,
    getPConnect,
    componentType,
    value: scalarValues,
    displayMode,
    hideLabel,
    ...restProps
  } = props;

  const items = scalarValues?.map(scalarValue => {
    return getPConnect().createComponent({
      type: componentType,
      config: {
        value: scalarValue,
        displayMode: 'LABELS_LEFT',
        label,
        ...restProps,
        readOnly: 'true'
      }
    });
  });

  if (['LABELS_LEFT', 'STACKED_LARGE_VAL', 'DISPLAY_ONLY'].includes(displayMode)) {
    const displayComp = (
      <div>
        <CommaSeparatedList items={items} />
      </div>
    );
    return displayComp;
  }

  const displayComp = <CommaSeparatedList items={items} />;

  return <FieldValueList name={hideLabel ? '' : label} value={displayComp} variant='stacked' />;
}

ScalarList.defaultProps = {};
ScalarList.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  displayInModal: PropTypes.bool,
  hideLabel: PropTypes.bool,
  value: PropTypes.arrayOf(PropTypes.any)
};
