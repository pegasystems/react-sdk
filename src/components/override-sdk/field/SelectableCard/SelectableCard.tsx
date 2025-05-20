import React from 'react';
import { Radio, Checkbox, FormControlLabel, Card, CardContent, Typography } from '@mui/material';
// import { SelectableCardProps } from './SelectableCard.types';
import { resolveReferenceFields } from './utils1';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';
import CheckboxComponent from '../Checkbox';

const SelectableCard: React.FC<any> = props => {
  const {
    getPConnect,
    type,
    image: { imagePosition, imageSize, showImageDescription, imageField = '', imageDescription = '' },
    dataSource,
    recordKey = '',
    className,
    cardLabel,
    hideFieldLabels = false,
    readOnly,
    disabled,
    readOnlyList = [],
    displayMode,
    radioBtnValue,
    onChange,
    onBlur,
    onClick,
    onKeyDown,
    additionalProps,
    testId,
    setIsRadioCardSelected,
    showNoValue = false
  } = props;

  const pConn = getPConnect();
  const actionsApi = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;

  if (showNoValue) return <Typography>No Value</Typography>;

  const cardDataSource = readOnly || displayMode === 'DISPLAY_ONLY' ? readOnlyList || [] : dataSource?.source;
  const imageDescriptionKey = showImageDescription ? imageDescription : undefined;

  let radioItemSelected = false;

  return (
    <>
      {(cardDataSource || []).map(item => {
        const resolvedFields = resolveReferenceFields(item, hideFieldLabels, recordKey, pConn);

        const commonProps = {
          id: item[recordKey],
          key: item[recordKey],
          fields: resolvedFields,
          label: item[cardLabel]
        };

        const image = item[imageField]
          ? {
              src: item[imageField],
              alt: showImageDescription && imageDescriptionKey ? item[imageDescriptionKey] : '',
              style: { width: imageSize, objectPosition: imagePosition }
            }
          : undefined;

        const cardContent = (
          <Card className={className} style={{ display: 'flex' }} data-testid={testId}>
            {image && <img src={image.src} alt={image.alt} style={{ width: '100px' }} />}
            <CardContent>
              <Typography variant='body1'>{item[cardLabel]}</Typography>
              {/* <Typography variant='body1'>{item.VIN}</Typography> */}
              {commonProps.fields.map((field, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Typography key={index} variant='body2'>
                  {field.value}
                </Typography>
              ))}
            </CardContent>
          </Card>
        );

        if (displayMode === 'DISPLAY_ONLY') {
          return cardContent;
        }

        const handleChange = event => {
          handleEvent(actionsApi, 'changeNblur', propName, event.target.checked);
        };

        const handleBlur = event => {
          pConn.getValidationApi().validate(event.target.checked);
        };

        const component = (
          <div style={{ paddingTop: '15px' }}>
            {type === 'checkbox' ? (
              <Card className={className} style={{ display: 'flex' }} data-testid={testId}>
                {image && <img src={image.src} alt={image.alt} style={{ width: '100px' }} />}
                <CardContent>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id={item[recordKey]}
                        getPConnect={getPConnect}
                        checked={readOnlyList.some(data => data[recordKey] === item[recordKey])}
                        onChange={onChange}
                        onBlur={onBlur}
                        onClick={onClick}
                        onKeyDown={onKeyDown}
                        disabled={disabled}
                        {...additionalProps}
                      />
                    }
                    label={<Typography variant='body1'>{item[cardLabel]}</Typography>}
                  />

                  {/* <Typography variant='body1'>{item.VIN}</Typography> */}
                  {commonProps.fields.map((field, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Typography key={index} variant='body2'>
                      {field.value}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className={className} style={{ display: 'flex' }} data-testid={testId}>
                {image && <img src={image.src} alt={image.alt} style={{ width: '100px', backgroundColor: '#555' }} />}
                <CardContent>
                  <FormControlLabel
                    control={
                      <Radio
                        value={item[recordKey]}
                        checked={radioBtnValue === item[recordKey]}
                        onChange={onChange}
                        onBlur={onBlur}
                        onClick={onClick}
                        onKeyDown={onKeyDown}
                        disabled={disabled}
                        {...additionalProps}
                      />
                    }
                    label={<Typography variant='body1'>{item[cardLabel]}</Typography>}
                  />

                  {/* <Typography variant='body1'>{item.VIN}</Typography> */}
                  {commonProps.fields.map((field, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Typography key={index} variant='body2'>
                      {field.value}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        );

        if (type === 'radio' && radioBtnValue === item[recordKey]) {
          radioItemSelected = true;
        }

        return component;
      })}

      {type === 'radio' && setIsRadioCardSelected && setIsRadioCardSelected(radioItemSelected)}
    </>
  );
};

export default SelectableCard;
