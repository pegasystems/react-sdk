import React from 'react';
import { useMemo, Children, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { buildFilterComponents } from '../../DashboardFilter/filterUtils';
import InlineDashboard from '../InlineDashboard';

export default function InlineDashboardPage(props) {
  const { children, getPConnect } = props;
  const [filterComponents, setFilterComponents] = useState([]);
  const childArray = useMemo(() => {
    return Children.toArray(children);
  }, [children]);

  const allFilters = getPConnect().getRawMetadata().children[1];

  useEffect(() => {
    setFilterComponents(buildFilterComponents(getPConnect, allFilters));
  }, []);

  const inlineProps = props;
  // Region layout views
  inlineProps.children[0] = childArray[0];
  // filter items
  inlineProps.children[1] = filterComponents;

  return <InlineDashboard {...inlineProps} />;
}

InlineDashboardPage.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  getPConnect: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  filterPosition: PropTypes.string
};

InlineDashboardPage.defaultProps = {
  icon: '',
  filterPosition: 'block-start'
};
