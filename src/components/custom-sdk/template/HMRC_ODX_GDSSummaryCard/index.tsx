import React, { ReactNode, useEffect, useState, Fragment } from 'react';
import { Grid } from '@pega/cosmos-react-core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { GBdate, isSingleEntity } from '../../../helpers/utils';
import StyledHmrcOdxGdsSummaryCardWrapper from './styles';

export default function HmrcOdxGdsSummaryCard(props) {
  const { children, NumCols, sectionHeader, getPConnect, useType } = props;

  const containerItemID = getPConnect().getContextName();
  const [pageReference, setPageReference] = useState('');
  const { t } = useTranslation();
  const nCols = parseInt(NumCols, 8);
  const [formElms, setFormElms] = useState<Array<ReactNode>>([]); // Initialize as an empty array of React Nodes
  let itemName = '';
  switch (useType) {
    case '1':
      itemName = t('GDS_INFO_ITEM_CHILD');
      break;
    case '2':
      itemName = t('GDS_INFO_ITEM_NATIONALITY');
      break;
    case '3':
      itemName = t('GDS_INFO_ITEM_COUNTRY');
      break;
    case '4':
      itemName = t('GDS_INFO_ITEM_NAME');
      break;
    default:
      break;
  }
  const [childName, setChildName] = useState(itemName);
  useEffect(() => {
    const elms: Array<string> = [];
    let finalELms: Array<string> = [];
    const region = children[0] ? children[0].props.getPConnect() : null;
    setPageReference(region.getPageReference());
    if (region?.getChildren()) {
      region.getChildren().forEach(child => {
        child.getPConnect().setInheritedProp('readOnly', true);
        elms.push(child.getPConnect().getComponent());
        if (useType === 1) {
          finalELms = elms.slice(0, -1);
        } else {
          finalELms = elms.slice(0);
        }
      });
      setFormElms(finalELms);
    }
  }, [children[0]]);

  const [formattedValues, setFormattedValues] = useState([]);

  useEffect(() => {
    // Populate formattedValues array when formElms change
    const values = formElms.map(field => {
      let formattedValue = '';

      formattedValue =
        (field as any)?.props?.label === 'Date of birth' ||
        (field as any)?.props?.label === 'Dyddiad geni' // TODO: Need to make more robust
          ? GBdate((field as any)?.props?.value)
          : (field as any)?.props?.value;

      return formattedValue;
    });

    setFormattedValues(values);
  }, [formElms]);

  useEffect(() => {
    formElms.forEach(field => {
      if (
        (field as any)?.props?.label === 'First Name' ||
        (field as any)?.props?.label === 'Enw cyntaf'
      ) {
        setChildName((field as any)?.props?.value);
      }
    });
  }, [formElms]);

  const [hiddenText, setHiddenText] = useState('');

  useEffect(() => {
    const updatedHiddenText =
      useType === 2 ? `${formattedValues[0]} ${childName}` : `${childName} ${formattedValues[0]}`;
    setHiddenText(updatedHiddenText);
  }, [childName, formattedValues]);

  const handleOnClick = (action: string) => {
    switch (action) {
      case t('GDS_ACTION_REMOVE'):
        getPConnect().setValue('.UserActions', 'Remove');
        getPConnect().getActionsApi().finishAssignment(containerItemID);
        break;
      case t('GDS_ACTION_CHANGE'):
        getPConnect().setValue('.UserActions', 'Amend');
        getPConnect().getActionsApi().finishAssignment(containerItemID);
        break;
      default:
        break;
    }
  };

  return (
    <StyledHmrcOdxGdsSummaryCardWrapper>
      <h2>{sectionHeader}</h2>
      <Grid
        container={{
          cols: `repeat(${nCols}, minmax(0, 1fr))`,
          gap: 2
        }}
      >
        <div className='govuk-summary-card'>
          <div className='govuk-summary-card__title-wrapper'>
            <h2 className='govuk-summary-card__title'>{itemName}</h2>
            <ul className='govuk-summary-card__actions'>
              {!isSingleEntity(pageReference, getPConnect) && (
                <li className='govuk-summary-card__action remove-link'>
                  {' '}
                  <a
                    className='govuk-link'
                    href='#'
                    onClick={() => handleOnClick(t('GDS_ACTION_REMOVE'))}
                  >
                    {t('GDS_ACTION_REMOVE')}
                    <span className='govuk-visually-hidden'>{hiddenText}</span>
                  </a>
                </li>
              )}
              <li className='govuk-summary-card__action'>
                {' '}
                <a
                  className='govuk-link'
                  href='#'
                  onClick={() => handleOnClick(t('GDS_ACTION_CHANGE'))}
                >
                  {t('GDS_ACTION_CHANGE')}
                  <span className='govuk-visually-hidden'>{hiddenText}</span>
                </a>
              </li>
            </ul>
          </div>
          <div className='govuk-summary-card__content'>
            <dl className='govuk-summary-list'>
              {formElms.map((field, index) => {
                const key = new Date().getTime() + index;

                return (
                  <Fragment key={key}>
                    <div className='govuk-summary-list__row'>
                      <dt className='govuk-summary-list__key'>{(field as any).props.label}</dt>
                      <dd className='govuk-summary-list__value'>{formattedValues[index]}</dd>
                    </div>
                  </Fragment>
                );
              })}
            </dl>
          </div>
        </div>
      </Grid>
    </StyledHmrcOdxGdsSummaryCardWrapper>
  );
}

HmrcOdxGdsSummaryCard.defaultProps = {
  NumCols: 1
};

HmrcOdxGdsSummaryCard.propTypes = {
  sectionHeader: PropTypes.string,
  getPConnect: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  NumCols: PropTypes.number
};
