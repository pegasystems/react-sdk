import { useEffect, useState, useCallback, useRef } from 'react';
import { Box, TextField, Alert } from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import handleEvent from '@pega/react-sdk-components/lib/components/helpers/event-utils';

import './Location.css';

interface LocationProps extends PConnFieldProps {
  coordinates?: string;
  onlyCoordinates?: boolean;
  showMap?: boolean;
  showMapReadOnly?: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  marginTop: '0px'
};

const defaultCenter = {
  lat: 18.5204,
  lng: 73.8567
};

const disabledMapOptions = {
  gestureHandling: 'none',
  keyboardShortcuts: false,
  disableDefaultUI: true,
  clickableIcons: false,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false
};

export default function Location(props: LocationProps) {
  const TextInput = getComponentFromMap('TextInput');
  const FieldValueList = getComponentFromMap('FieldValueList');

  const {
    getPConnect,
    label,
    required = false,
    disabled = false,
    value = '',
    validatemessage,
    status,
    readOnly = false,
    testId,
    displayMode,
    hideLabel = false,
    placeholder,
    helperText,
    coordinates = '',
    onlyCoordinates = false,
    showMap,
    showMapReadOnly
  } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const propName = (pConn.getStateProps() as any).value;
  const coordPropName = (pConn.getStateProps() as any).coordinates;

  const [inputValue, setInputValue] = useState<string>(value ?? '');
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: pConn.getGoogleMapsAPIKey?.() || '',
    libraries: ['places', 'geocoding']
  });

  const hasError = status === 'error' && !!validatemessage && !disabled;

  useEffect(() => {
    if (onlyCoordinates && coordinates) {
      setInputValue(coordinates);
    } else {
      setInputValue(value ?? '');
    }
    if (coordinates) {
      const [lat, lng] = coordinates.split(',').map(parseFloat);

      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
      }
    }
  }, [value, coordinates, onlyCoordinates]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value ?? '';
      setInputValue(newValue);
      handleEvent(actions, 'changeNblur', propName, newValue);

      if (newValue === '' && coordPropName) {
        actions.updateFieldValue(coordPropName, '');
        setMarkerPosition(null);
      }
    },
    [actions, propName, coordPropName]
  );

  const handlePlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || '';
        const coordinateString = `${lat}, ${lng}`;

        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });

        if (onlyCoordinates) {
          setInputValue(coordinateString);
          handleEvent(actions, 'changeNblur', propName, coordinateString);
          if (coordPropName) {
            actions.updateFieldValue(coordPropName, coordinateString);
          }
        } else {
          setInputValue(address);
          handleEvent(actions, 'changeNblur', propName, address);
          if (coordPropName) {
            actions.updateFieldValue(coordPropName, coordinateString);
          }
        }
      }
    }
  }, [actions, propName, coordPropName, onlyCoordinates]);

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current);
      autocompleteRef.current.addListener('place_changed', handlePlaceChanged);
    }
  }, [isLoaded, handlePlaceChanged]);

  const handleGetCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const coordinateString = `${lat}, ${lng}`;

          setMapCenter({ lat, lng });
          setMarkerPosition({ lat, lng });

          if (onlyCoordinates) {
            setInputValue(coordinateString);
            handleEvent(actions, 'changeNblur', propName, coordinateString);
            if (coordPropName) {
              actions.updateFieldValue(coordPropName, coordinateString);
            }
          } else {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, responseStatus) => {
              if (responseStatus === 'OK' && results && results[0]) {
                const address = results[0].formatted_address;
                setInputValue(address);
                handleEvent(actions, 'changeNblur', propName, address);
                if (coordPropName) {
                  actions.updateFieldValue(coordPropName, coordinateString);
                }
              }
            });
          }
        },
        error => {
          console.error('Error getting current location: ', error);
        }
      );
    }
  }, [actions, propName, coordPropName, onlyCoordinates]);

  if (displayMode === 'DISPLAY_ONLY') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} />;
  }

  if (displayMode === 'STACKED_LARGE_VAL') {
    return <FieldValueList name={hideLabel ? '' : label} value={value} variant='stacked' />;
  }

  const map = (
    <div style={{ opacity: disabled ? 0.7 : 1 }}>
      <Box mt={1} style={{ flex: 1 }}>
        <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={14} options={disabled ? disabledMapOptions : undefined}>
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </Box>
    </div>
  );

  if (readOnly) {
    return (
      <div>
        <TextInput {...props} />
        {isLoaded && showMapReadOnly && map}
      </div>
    );
  }

  const testProps: any = { 'data-test-id': testId };

  return (
    <div>
      {hasError && (
        <Alert severity='error' sx={{ mb: 1 }}>
          {validatemessage}
        </Alert>
      )}

      {isLoaded && (
        <TextField
          fullWidth
          label={hideLabel ? '' : label}
          required={required}
          disabled={disabled}
          error={hasError}
          placeholder={placeholder ?? 'Search location'}
          helperText={helperText}
          value={inputValue}
          onChange={handleChange}
          inputRef={inputRef}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={handleGetCurrentLocation} disabled={disabled} edge='end'>
                    <AddLocationAltIcon />
                  </IconButton>
                </InputAdornment>
              ),
              inputProps: { ...testProps }
            }
          }}
        />
      )}

      {isLoaded && showMap && map}
    </div>
  );
}
