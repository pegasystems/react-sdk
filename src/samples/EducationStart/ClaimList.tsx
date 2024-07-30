import React from 'react';
import DateFormatter from '@pega/react-sdk-components/lib/components/helpers/formatters/Date';
import PropTypes from 'prop-types';
import { scrollToTop, getServiceShutteredStatus } from '../../components/helpers/utils';
import { useTranslation } from 'react-i18next';
import Button from '../../components/BaseComponents/Button/Button';
import dayjs from 'dayjs';

declare const PCore: any;

export default function ClaimsList(props) {
  const {
    thePConn,
    cases,
    title,
    fieldType,
    rowClickAction,
    caseId,
    setShutterServicePage,
    setShowLandingPage
  } = props;
  const { t } = useTranslation();

  const containerManger = thePConn?.getContainerManager();
  const resetContainer = () => {
    const context = PCore.getContainerUtils().getActiveContainerItemName(
      `${PCore.getConstants().APP.APP}/primary`
    );
    containerManger?.resetContainers({
      context: 'app',
      name: 'primary',
      containerItems: [context]
    });
  };

  async function _rowClick(e, row: any) {
    e.preventDefault();
    const { pzInsKey, pyAssignmentID } = row;

    // const container = thePConn.getContainerName();
    const container = 'primary'; 

    const target = `${PCore.getConstants().APP.APP}/${container}`;

    if (rowClickAction === 'OpenAssignment') {
      resetContainer();
      const openAssignmentOptions = { containerName: container };
      PCore.getMashupApi()
        .openAssignment(pyAssignmentID, target, openAssignmentOptions)
        .then(() => {
          scrollToTop();
        })
        .catch((err: Error) => console.log('Error : ', err)); // eslint-disable-line no-console
    } else if (rowClickAction === 'OpenCase') {
      const status = await getServiceShutteredStatus();
      if (status) {
        setShutterServicePage(status);
      } else {
        PCore.getMashupApi()
          .openCase(pzInsKey, target, { pageName: 'SummaryClaim' })
          .then(() => {
            scrollToTop();
          });
      }
    }
    setShowLandingPage(false);
  }

  function getCurrentDate(date) {
    return DateFormatter.Date(date, { format: 'DD MMMM YYYY' });
  }

  function renderChildDetails(claimItem) {
    return claimItem.children.map((child, index) => (
      <React.Fragment key={child?.firstName}>
        <dl className='govuk-summary-list govuk-!-margin-bottom-0'>
          {(child?.firstName ||
            child?.lastName) && (
              <div className='govuk-summary-list__row govuk-summary-list__row--no-border'>
                <dt className='govuk-summary-list__key govuk-!-width-one-third govuk-!-padding-bottom-2'>
                  {t('YOUNG_PERSON_NAME')}
                </dt>
                <dd className='govuk-summary-list__value govuk-!-width-one-third govuk-!-padding-bottom-2'>
                  {child?.firstName} {child?.lastName}
                </dd>
                <dd className='govuk-summary-list__actions govuk-!-width-one-third govuk-!-padding-bottom-2'>
                  {/* If this is the first entry add the status */}
                  {index === 0 ? (
                    <strong className={`govuk-tag govuk-tag--${claimItem.status.tagColour}`}>
                      {t(claimItem.status.text)}
                    </strong>
                  ) : (
                    <span className='govuk-visually-hidden'>No action</span>
                  )}
                </dd>
              </div>
            )}
          {child?.dob && (
            <div className='govuk-summary-list__row govuk-summary-list__row--no-border'>
              <dt className='govuk-summary-list__key govuk-!-width-one-third govuk-!-padding-bottom-2'>
                {t('DATE_OF_BIRTH')}
              </dt>
              <dd className='govuk-summary-list__value govuk-!-width-one-third govuk-!-padding-bottom-2'>
                {dayjs(child.dob).format('DD MMM YYYY')}
              </dd>
            </div>
          )}

          <div className='govuk-summary-list__row govuk-summary-list__row--no-border'>
            <dt className='govuk-summary-list__key govuk-!-width-one-third govuk-!-padding-bottom-2'>
              {fieldType}
            </dt>
            <dd className='govuk-summary-list__value govuk-!-width-one-third govuk-!-padding-bottom-2'>
              {claimItem.dateCreated}
            </dd>
            {!child?.firstName && !child?.lastName && (
              <dd className='govuk-summary-list__actions govuk-!-width-one-third'>
                {!claimItem.childrenAdded && (
                  <strong className={`govuk-tag govuk-tag--${claimItem.status.tagColour}`}>
                    {t(claimItem.status.text)}
                  </strong>
                )}
              </dd>
            )}
          </div>
        </dl>

        <Button
          attributes={{ className: 'govuk-!-margin-top-4 govuk-!-margin-bottom-4' }}
          variant='secondary'
          onClick={e => {
            _rowClick(e, claimItem.rowDetails);
          }}
        >
          {t(claimItem.actionButton)}
        </Button>

        {!caseId?.includes(claimItem.claimRef) &&
          (claimItem?.status?.text === 'IN_PROGRESS_1') && (
            <p className='govuk-body'>
              {t('PORTAL_WARNING_TEXT')} {getCurrentDate(claimItem?.dateUpdated)}{' '}
              {t('EDUCATION_PORTAL_WARNING_TEXT2')}
            </p>
          )}
        <hr
          className='govuk-section-break govuk-section-break--l govuk-section-break--visible'
          aria-hidden='true'
        ></hr>
      </React.Fragment>
    ));
  }

  return (
    <>
      <h2 className='govuk-heading-l'>{title}</h2>

      {cases.map(claimItem => (
        <React.Fragment key={claimItem.claimRef}>{renderChildDetails(claimItem)}</React.Fragment>
      ))}
    </>
  );
}

ClaimsList.propTypes = {
  thePConn: PropTypes.object,
  cases: PropTypes.array,
  title: PropTypes.string,
  fieldType: PropTypes.string,
  rowClickAction: PropTypes.oneOf(['OpenCase', 'OpenAssignment']),
  caseId: PropTypes.string,
  setShowLandingPage: PropTypes.func,
  setShutterServicePage: PropTypes.func
};
