/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable operator-assignment */
import { useRef, useEffect, useState, Fragment, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'throttle-debounce';
import { createFilter, combineFilters, getFormattedDate } from './filterUtils';
import { getFilterExpression } from './filterUtils';
import { TextField } from '@material-ui/core';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

declare const PCore: any;

export default function DashboardFilter(props) {
  const { children, name, filterProp, type, metadata, getPConnect } = props;
  const { current: filterId } = useRef(uuidv4());

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_DASHBOARD_FILTER_CLEAR_ALL,
      () => {
        if (type === 'Dropdown') {
          getPConnect().getActionsApi().updateFieldValue(filterProp, '');
        } else if (type === 'RadioButtons') {
          const reference = getPConnect().getFullReference() + filterProp;
          const radList = document.getElementsByName(reference);
          for (let i = 0; i < radList.length; i = i + 1) {
            if ((radList[i] as HTMLInputElement).value === '') {
              (radList[i] as HTMLInputElement).checked = true;
            } else {
              (radList[i] as HTMLInputElement).checked = false;
            }
          }
        } else {
          getPConnect().getActionsApi().updateFieldValue(filterProp, undefined);
          if (type === 'DateTime') {
            setStartDate(null);
            setEndDate(null);
          }
        }
      },
      filterId,
      false,
      getPConnect().getContextName()
    );
    return function cleanup() {
      PCore.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.EVENT_DASHBOARD_FILTER_CLEAR_ALL,
        filterId,
        getPConnect().getContextName()
      );
    };
  });

  const fireFilterChange = filterValue => {
    const filterData = {
      filterId,
      filterExpression: getFilterExpression(filterValue, name, metadata)
    };

    PCore.getPubSubUtils().publish(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_DASHBOARD_FILTER_CHANGE,
      filterData
    );
  };

  const fireFilterChangeDebounced = debounce(500, fireFilterChange);
  const dateRangeChangeHandler = value => {
    const { start, end } = value;

    let startDate = getFormattedDate(start);
    let endDate = getFormattedDate(end);

    if (startDate && endDate) {
      startDate = `${startDate}T00:00:00`;
      endDate = `${endDate}T00:00:00`;
      const startFilter = createFilter(startDate, name, 'GT');
      const endFilter = createFilter(endDate, name, 'LT');

      const filterData = {
        filterId,
        filterExpression: combineFilters([startFilter, endFilter], null)
      };
      PCore.getPubSubUtils().publish(
        PCore.getConstants().PUB_SUB_EVENTS.EVENT_DASHBOARD_FILTER_CHANGE,
        filterData
      );
    }
  };

  const renderAutoComplete = () => {
    metadata.config.onRecordChange = e => {
      fireFilterChange(e.id);
    };
    return getPConnect().createComponent(metadata);
  };

  const onChange = dates => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    dateRangeChangeHandler({ start, end });
  };

  type TextProps = React.HTMLProps<HTMLInputElement>;

  const label = metadata.config.label.substring(3);

  const CustomDateInput = forwardRef<HTMLInputElement, TextProps>(
    ({ value, onClick }, ref: any) => (
      <TextField
        label={label}
        variant='outlined'
        fullWidth
        value={value}
        size='small'
        onClick={onClick}
        ref={ref}
      >
        {value}
      </TextField>
    )
  );

  return (
    <Fragment>
      {type === 'DateTime' && (
        <DatePicker
          onChange={onChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          enableTabLoop={false}
          customInput={<CustomDateInput />}
        />
      )}
      {type === 'AutoComplete' && (
        <span
          onChange={event => {
            if (event && event.target && !(event.target as HTMLInputElement).value) {
              fireFilterChange('ALL');
            }
          }}
        >
          {renderAutoComplete()}
        </span>
      )}
      {children && (
        <span
          onChange={event => {
            fireFilterChangeDebounced((event.target as HTMLInputElement).value);
          }}
        >
          {children}
        </span>
      )}
    </Fragment>
  );
}

DashboardFilter.defaultProps = {
  children: null,
  type: null,
  metadata: null
};
DashboardFilter.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  children: PropTypes.object,
  name: PropTypes.string.isRequired,
  filterProp: PropTypes.string.isRequired,
  type: PropTypes.string,
  metadata: PropTypes.objectOf(PropTypes.any)
};
