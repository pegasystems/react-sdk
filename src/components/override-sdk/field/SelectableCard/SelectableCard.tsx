import { Radio, Checkbox, FormControlLabel, Card, CardContent, Typography } from '@mui/material';
import { resolveReferenceFields } from './utils';

export default function SelectableCard(props) {
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
              {commonProps.fields.map((field, index) => (
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

        const component = (
          <div key={item[recordKey]} style={{ paddingTop: '15px' }}>
            <Card className={className} style={{ display: 'flex', flexDirection: 'column', height: '100%' }} data-testid={testId}>
              <CardContent
                style={{
                  ...((imagePosition === 'inline-start' || imagePosition === 'inline-end') && { display: 'flex', height: '100%' }),
                  ...(imagePosition === 'inline-end' && { flexDirection: 'row-reverse' })
                }}
              >
                <div
                  style={{
                    ...((imagePosition === 'inline-start' || imagePosition === 'inline-end') && { width: '40%' })
                  }}
                >
                  {image && (
                    <img
                      src={image.src}
                      alt={image.alt}
                      style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        aspectRatio: '16 / 9',
                        maxHeight: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        maxWidth: '100%'
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    ...((imagePosition === 'inline-start' || imagePosition === 'inline-end') && { width: '60%' })
                  }}
                >
                  {type === 'radio' ? (
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
                  ) : (
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
                  )}

                  {commonProps.fields.map((field, index) => (
                    <div
                      key={index}
                      style={{
                        fontSize: '0.875rem',
                        ...(field.type !== 'TextArea' && { display: 'grid', gridTemplateColumns: '1fr 1fr' }),
                        margin: '5px'
                      }}
                    >
                      {field.name && <div>{field.name}</div>}
                      <div>{field?.value?.props.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
}
