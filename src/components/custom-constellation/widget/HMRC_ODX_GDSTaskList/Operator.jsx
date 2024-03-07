import { useState, useEffect, Fragment } from 'react';
import {
  Link,
  Button,
  Popover,
  Flex,
  useOuterEvent,
  useElement,
  Progress,
  FormField,
  useTheme
} from '@pega/cosmos-react-core';
import { Glimpse } from '@pega/cosmos-react-work';
import PropTypes from 'prop-types';

import Avatar from './Avatar.jsx';

const Operator = (props) => {
  const { id, name, label, testId, helperText, externalUser, metaObj } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [popoverTarget, setPopoverTarget] = useState(null);
  const [popoverEl, setPopoverEl] = useElement(null);
  const [popoverContent, setpopoverContent] = useState(null);
  const theme = useTheme();

  /* If the id has changed, we need to reset the popover */
  useEffect(() => {
    setPopoverTarget(null);
  }, [id]);



  const OperatorPreview = () => {
    const localizedVal = PCore.getLocaleUtils().getLocaleValue;
    const localeCategory = 'Operator';
    setpopoverContent(
      <Progress variant='ring' message={localizedVal('Loading operator...', localeCategory)} placement='local' />
    );
    if (externalUser && externalUser.classID !== 'Data-Party-Operator') {
      const fields = [
        {
          id: 'pyFirstName',
          name: localizedVal('Name', localeCategory),
          value: externalUser.name
        },
        {
          id: 'pyEmail1',
          name: localizedVal('Email', localeCategory),
          value:
            externalUser.email !== '' ? <Link href={`mailto:${externalUser.email}`}>{externalUser.email}</Link> : ''
        },
        {
          id: 'pyPhoneNumber',
          name: localizedVal('Phone', localeCategory),
          value: externalUser.phone !== '' ? <Link href={`tel:${externalUser.phone}`}>{externalUser.phone}</Link> : ''
        }
      ];
      setIsLoading(false);
      setpopoverContent(
        <Glimpse
          visual={
            <Avatar
              metaObj={{
                name: externalUser.name
              }}
            />
          }
          primary={externalUser.name}
          secondary={[externalUser.position]}
          fields={fields}
        />
      );
    } else {
      const { getOperatorDetails } = PCore.getUserApi();
      getOperatorDetails(id)
        .then((res) => {
          if (res.data && res.data.pyOperatorInfo && res.data.pyOperatorInfo.pyUserName) {
            const fields = [
              {
                id: 'pyOrganization',
                name: localizedVal('Organization', localeCategory),
                value: res.data.pyOperatorInfo.pyOrganization
              },
              {
                id: 'pyTelephone',
                name: localizedVal('Telephone', localeCategory),
                value:
                  res.data.pyOperatorInfo.pyTelephone !== '' ? (
                    <Link href={`tel:${res.data.pyOperatorInfo.pyTelephone}`}>
                      {res.data.pyOperatorInfo.pyTelephone}
                    </Link>
                  ) : (
                    ''
                  )
              },
              {
                id: 'pyEmailAddress',
                name: localizedVal('Email address', localeCategory),
                value:
                  res.data.pyOperatorInfo.pyEmailAddress !== '' ? (
                    <Link href={`mailto:${res.data.pyOperatorInfo.pyEmailAddress}`}>
                      {res.data.pyOperatorInfo.pyEmailAddress}
                    </Link>
                  ) : (
                    ''
                  )
              },
              {
                id: 'ReportToUserName',
                name: localizedVal('Reports to', localeCategory),
                value: res.data.pyOperatorInfo.pyReportToUserName
              }
            ];
            setIsLoading(false);
            setpopoverContent(
              <Glimpse
                visual={
                  <Avatar
                    metaObj={{
                      image: res.data.pyOperatorInfo.pyImageInsKey || '',
                      name: res.data.pyOperatorInfo.pyUserName
                    }}
                  />
                }
                primary={res.data.pyOperatorInfo.pyUserName}
                secondary={[res.data.pyOperatorInfo.pyPosition]}
                fields={fields}
              />
            );
          } else {
            setIsLoading(false);
            setpopoverContent(<Flex container={{ pad: 1 }}>{localizedVal('Operator not found', localeCategory)}</Flex>);
          }
        })
        .catch(() => {
          setIsLoading(false);
          setpopoverContent(
            <Flex container={{ pad: 1 }}>{localizedVal('Error loading the operator profile', localeCategory)}</Flex>
          );
        });
    }
  };


  const clickAction = (e) => {
    setPopoverTarget(e.currentTarget);
    setIsOpen(!isOpen);
    if (popoverTarget === null) {
      OperatorPreview();
    }
  };

  const hidePopover = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };
  useOuterEvent('mousedown', [popoverEl, popoverTarget], hidePopover); // Call the method on clicking outside these elements
  const hideOnEscape = (e) => {
    if (e.key === 'Escape') hidePopover(); // Call the method when Escape key is pressed
  };

  const comp = (
    <Fragment>
      {metaObj ? (
        <Button
          variant='text'
          aria-haspopup
          aria-expanded={isOpen}
          onClick={clickAction}
          onKeyDown={hideOnEscape}
          data-test-id={testId}
          style={label !== null ? { width: 'max-content', height: theme.components.input.height } : undefined}
        >
          <Avatar metaObj={metaObj}></Avatar>
        </Button>
      ) : (
        <Button
          variant='link'
          aria-haspopup
          aria-expanded={isOpen}
          onClick={clickAction}
          onKeyDown={hideOnEscape}
          data-test-id={testId}
          style={label !== null ? { width: 'max-content', height: theme.components.input.height } : undefined}
        >
          {name}
        </Button>
      )}

      {isOpen && (
        <Popover
          ref={setPopoverEl}
          groupId='operator'
          target={popoverTarget}
          placement='bottom-start'
          style={isLoading ? { position: 'relative', width: '10rem', minHeight: '4rem' } : undefined}
          strategy='fixed'
        >
          {popoverContent}
        </Popover>
      )}
    </Fragment>
  );

  if (label !== null) {
    return (
      <FormField label={label} info={helperText}>
        {comp}
      </FormField>
    );
  }

  return comp;
};

Operator.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  testId: PropTypes.string,
  helperText: PropTypes.string,
  metaObj: PropTypes.object
};

Operator.defaultProps = {
  name: '',
  id: '',
  label: null,
  testId: null,
  helperText: null,
  metaObj: null
};

export default Operator;
