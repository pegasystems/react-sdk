/* eslint-disable no-nested-ternary */
import { Fragment } from 'react';
import { DateTimeDisplay, Card, CardHeader, CardContent, Flex } from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';

// includes in bundle
import Operator from './Operator.jsx';

import StyledHmrcOdxGdsTaskListWrapper from './styles';


// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxGdsTaskList(props) {

  const {
    getPConnect,
    title,
    label,
    createLabel,
    updateLabel,
    createOperator,
    updateOperator,
    createDateTime,
    updateDateTime,
    resolveLabel,
    resolveOperator,
    resolveDateTime,
    hideLabel
  } = props;


  const [_label, user, dateTimeValue] =
    label === 'Create operator'
      ? [createLabel, createOperator, createDateTime]
      : label === 'Update operator'
      ? [updateLabel, updateOperator, updateDateTime]
      : [resolveLabel, resolveOperator, resolveDateTime];



  return user.userId && user.userName ? (
    <StyledHmrcOdxGdsTaskListWrapper>
      <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent>
      <Flex container={{ direction: 'row'}}>
      <Operator label={hideLabel ? null : _label} name={user.userName} id={user.userId} getPConnect={getPConnect} />

      {dateTimeValue && (
        <Fragment>
          {' '}
          <DateTimeDisplay value={dateTimeValue} variant='relative' />
        </Fragment>
      )}
      </Flex>
      </CardContent>
      </Card>

    </StyledHmrcOdxGdsTaskListWrapper>
  ) : (
    <StyledHmrcOdxGdsTaskListWrapper>
    defVal
    </StyledHmrcOdxGdsTaskListWrapper>
  );



}

HmrcOdxGdsTaskList.defaultProps = {
  "label": "Create operator",
  "title": "Create operator",
  createLabel: null,
  updateLabel: null,
  createOperator: null,
  updateOperator: null,
  createDateTime: null,
  updateDateTime: null,
  resolveLabel: null,
  resolveOperator: null,
  resolveDateTime: null,
  hideLabel: false
};

HmrcOdxGdsTaskList.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  label: PropTypes.string,
  title: PropTypes.string,
  createLabel: PropTypes.string,
  updateLabel: PropTypes.string,
  resolveLabel: PropTypes.string,
  createOperator: PropTypes.objectOf(PropTypes.any),
  updateOperator: PropTypes.objectOf(PropTypes.any),
  resolveOperator: PropTypes.objectOf(PropTypes.any),
  createDateTime: PropTypes.string,
  updateDateTime: PropTypes.string,
  resolveDateTime: PropTypes.string,
  hideLabel: PropTypes.bool
};

// as objects are there in props, shallow comparision fails & re-rendering of comp happens even with
// same key value pairs in obj. hence using custom comparison function on when to re-render
// const comparisonFn = (prevProps, nextProps) => {
//   return prevProps.updateDateTime === nextProps.updateDateTime;
// };
