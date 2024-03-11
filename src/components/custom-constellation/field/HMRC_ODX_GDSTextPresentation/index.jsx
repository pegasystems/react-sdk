import React, { useEffect, useState, useRef } from 'react';
import {
  Input,
  FieldValueList,
  Text,
  EmailDisplay,
  PhoneDisplay,
  URLDisplay
} from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';

// include in bundle
import handleEvent from './event-utils';
import StatusWorkRenderer from './StatusWork.jsx';
import { suggestionsHandler } from './suggestions-handler';

import StyledHmrcOdxGdsTextPresentationWrapper from './styles';

const formatExists = formatterVal => {
  const formatterValues = [
    'TextInput',
    'WorkStatus',
    'RichText',
    'Email',
    'Phone',
    'URL',
    'Operator'
  ];
  return formatterValues.includes(formatterVal);
};

const textFormatter = (formatter, value) => {
  let displayComponent = null;
  switch (formatter) {
    case 'TextInput':
      displayComponent = value;
      break;
    case 'Email':
      displayComponent = <EmailDisplay value={value} displayText={value} variant='link' />;
      break;
    case 'Phone':
      displayComponent = <PhoneDisplay value={value} variant='link' />;
      break;
    case 'URL':
      displayComponent = (
        <URLDisplay target='_blank' value={value} displayText={value} variant='link' />
      );
      break;
    default:
      // handle default case
      break;
  }
  return displayComponent;
};

const HmrcOdxGdsTextPresentation = props => {
  const {
    getPConnect,
    placeholder,
    validatemessage,
    label,
    hideLabel,
    helperText,
    testId,
    fieldMetadata,
    additionalProps,
    displayMode,
    displayAsStatus,
    variant,
    hasSuggestions,
    isTableFormatter,
    enableAdditionalInformation
  } = props;
  const { formatter } = props;
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = pConn.getStateProps().value;
  const maxLength = fieldMetadata?.maxLength;
  const fieldDescription = fieldMetadata?.description;
  const hasValueChange = useRef(false);

  let { value, readOnly, required, disabled } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    prop => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  const [inputValue, setInputValue] = useState(value);
  const [status, setStatus] = useState(hasSuggestions ? 'pending' : undefined);
  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    if (validatemessage !== '') {
      setStatus('error');
    }
    if (hasSuggestions) {
      setStatus('pending');
    } else if (!hasSuggestions && status !== 'success') {
      setStatus(validatemessage !== '' ? 'error' : undefined);
    }
  }, [validatemessage, hasSuggestions, status]);

  const onResolveSuggestionHandler = accepted => {
    suggestionsHandler(accepted, pConn, setStatus);
  };

  // Override the value to render as status work when prop passed to display as status
  if (displayAsStatus) {
    value = StatusWorkRenderer({ value });

    // Fall into this scenario for case summary, default to stacked status
    if (!displayMode) {
      return (
        <FieldValueList
          variant='stacked'
          data-testid={testId}
          fields={[{ id: 'status', name: label, value }]}
        />
      );
    }
  }

  if (displayMode === 'LABELS_LEFT' || displayMode === 'DISPLAY_ONLY') {
    let displayComp = value || <span aria-hidden='true'>&ndash;&ndash;</span>;
    if (isTableFormatter && formatExists(formatter)) {
      displayComp = textFormatter(formatter, value);
    }
    return displayMode === 'DISPLAY_ONLY' ? (
      <StyledHmrcOdxGdsTextPresentationWrapper>
        {displayComp}
      </StyledHmrcOdxGdsTextPresentationWrapper>
    ) : (
      <StyledHmrcOdxGdsTextPresentationWrapper>
        <FieldValueList
          variant={hideLabel ? 'stacked' : variant}
          data-testid={testId}
          fields={[{ id: '1', name: hideLabel ? '' : label, value: displayComp }]}
        />
      </StyledHmrcOdxGdsTextPresentationWrapper>
    );
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    const isValDefined = typeof value !== 'undefined' && value !== '';
    const val = isValDefined ? (
      <Text variant='h1' as='span'>
        {value}
      </Text>
    ) : (
      ''
    );
    return (
      <StyledHmrcOdxGdsTextPresentationWrapper>
        <FieldValueList
          variant='stacked'
          data-testid={testId}
          fields={[{ id: '2', name: hideLabel ? '' : label, value: val }]}
        />
      </StyledHmrcOdxGdsTextPresentationWrapper>
    );
  }

  return (
    <StyledHmrcOdxGdsTextPresentationWrapper>
      <Input
        {...additionalProps}
        type='text'
        label={label}
        labelHidden={hideLabel}
        info={validatemessage || helperText}
        data-testid={testId}
        value={inputValue}
        status={status}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        maxLength={maxLength}
        onChange={event => {
          if (hasSuggestions) {
            setStatus(undefined);
          }
          setInputValue(event.target.value);
          if (value !== event.target.value) {
            handleEvent(actions, 'change', propName, event.target.value);
            hasValueChange.current = true;
          }
        }}
        onBlur={event => {
          if ((!value || hasValueChange.current) && !readOnly) {
            handleEvent(actions, 'blur', propName, event.target.value);
            if (hasSuggestions) {
              pConn.ignoreSuggestion();
            }
            hasValueChange.current = false;
          }
        }}
        onResolveSuggestion={onResolveSuggestionHandler}
        {...(enableAdditionalInformation && fieldDescription
          ? {
              additionalInfo: {
                heading: label,
                content: fieldDescription
              }
            }
          : {})}
      />
    </StyledHmrcOdxGdsTextPresentationWrapper>
  );
};

HmrcOdxGdsTextPresentation.defaultProps = {
  value: '',
  placeholder: '',
  validatemessage: '',
  helperText: '',
  displayAsStatus: false,
  hideLabel: false,
  disabled: false,
  readOnly: false,
  required: false,
  testId: '',
  fieldMetadata: {},
  additionalProps: {},
  displayMode: null,
  variant: 'inline',
  formatter: '',
  isTableFormatter: false,
  hasSuggestions: false,
  enableAdditionalInformation: false
};

HmrcOdxGdsTextPresentation.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  displayMode: PropTypes.string,
  displayAsStatus: PropTypes.bool,
  label: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
  getPConnect: PropTypes.func.isRequired,
  validatemessage: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  testId: PropTypes.string,
  fieldMetadata: PropTypes.objectOf(PropTypes.any),
  additionalProps: PropTypes.objectOf(PropTypes.any),
  variant: PropTypes.string,
  formatter: PropTypes.string,
  isTableFormatter: PropTypes.bool,
  hasSuggestions: PropTypes.bool,
  enableAdditionalInformation: PropTypes.bool
};

export default HmrcOdxGdsTextPresentation;
