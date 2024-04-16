import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ParsedHTML from '../../components/helpers/formatters/ParsedHtml';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import useServiceShuttered from '../../components/helpers/hooks/useServiceShuttered';
import ShutterServicePage from '../../components/AppComponents/ShutterServicePage';

declare const PCore: any;

const ConfirmationPage = ({ caseId, isUnAuth }) => {
  const { t } = useTranslation();
  const [documentList, setDocumentList] = useState(``);
  const [isBornAbroadOrAdopted, setIsBornAbroadOrAdopted] = useState(false);
  const [returnSlipContent, setReturnSlipContent] = useState();
  const [loading, setLoading] = useState(true);
  const serviceShuttered = useServiceShuttered();
  const [isCaseRefRequired, setIsCaseRefRequired] = useState(false);
  const refId = caseId.replace('HMRC-CHB-WORK ', '');
  const docIDForDocList = 'CR0003';
  const docIDForReturnSlip = 'CR0002';
  const locale = PCore.getEnvironmentInfo().locale.replaceAll('-', '_');

  function getFeedBackLink() {
    return isUnAuth
      ? 'https://www.tax.service.gov.uk/feedback/ODXCHBUA'
      : 'https://www.tax.service.gov.uk/feedback/ODXCHB';
  }
  useEffect(() => {
    setPageTitle();
  }, []);

  useEffect(() => {
    PCore.getDataPageUtils()
      .getPageDataAsync('D_DocumentContent', 'root', {
        DocumentID: docIDForDocList,
        Locale: locale,
        CaseID: caseId
      })
      .then(listData => {
        if (
          listData.DocumentContentHTML.includes("data-bornabroad='true'") ||
          listData.DocumentContentHTML.includes("data-adopted='true'")
        ) {
          setIsBornAbroadOrAdopted(true);
        }
        setLoading(false);
        setDocumentList(listData.DocumentContentHTML);
        if (listData.DocumentContentHTML.includes('data-ninopresent="false"')) {
          setIsCaseRefRequired(true);
        }
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      });

    PCore.getDataPageUtils()
      .getPageDataAsync('D_DocumentContent', 'root', {
        DocumentID: docIDForReturnSlip,
        Locale: locale,
        CaseID: caseId
      })
      .then(pageData => {
        setReturnSlipContent(pageData.DocumentContentHTML);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
      })
      .finally(() => {
        PCore.getPubSubUtils().publish('staySignedInOnConfirmationScreen', {});
        //  As the document API calls are executed as last ones , we want to close container as a very
        //  last call , so we even included 2.5 seconds of time gap for execution
        setTimeout(() => {
          PCore.getContainerUtils().closeContainerItem(
            PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
            { skipDirtyCheck: true }
          );
        }, 2500);
      });
  }, []);

  const generateReturnSlip = e => {
    e.preventDefault();
    const myWindow = window.open('');
    myWindow.document.write(returnSlipContent);
  };

  if (loading) {
    return null;
  } else if (serviceShuttered) {
    return <ShutterServicePage />;
  } else if (!loading && isBornAbroadOrAdopted) {
    return (
      <>
        <MainWrapper>
          <div className='govuk-panel govuk-panel--confirmation govuk-!-margin-bottom-7'>
            <h1 className='govuk-panel__title'> {t('APPLICATION_RECEIVED')}</h1>
            {isUnAuth && isCaseRefRequired && (
              <div className='govuk-panel__body'>
                {t('YOUR_REF_NUMBER')}
                <br></br>
                <strong>{refId}</strong>
              </div>
            )}
            <div className='govuk-panel__body'>
              <p>{t('POST_YOUR_SUPPORTING_DOCUMENTS')}</p>
            </div>
          </div>
          <h2 className='govuk-heading-m'> {t('WHAT_YOU_NEED_TO_DO_NOW')} </h2>
          {isUnAuth && isCaseRefRequired && <p className='govuk-body'>{t('PRINT_THIS_INFO')}</p>}
          <p className='govuk-body'> {t('THE_INFO_YOU_HAVE_PROVIDED')}. </p>
          <ParsedHTML htmlString={documentList} />
          <p className='govuk-body'>
            {t('AFTER_YOU_HAVE')}{' '}
            <a
              href=''
              onClick={e => generateReturnSlip(e)}
              target='_blank'
              rel='noreferrer noopener'
            >
              {t('PRINTED_AND_SIGNED_THE_FORM')} {t('OPENS_IN_NEW_TAB')}
            </a>
            , {t('RETURN_THE_FORM_WITH')}{' '}
          </p>
          <p className='govuk-body govuk-!-font-weight-bold'>
            Child Benefit Office (GB)
            <br />
            Washington
            <br />
            NEWCASTLE UPON TYNE
            <br />
            NE88 1ZD
          </p>
          <p className='govuk-body'> {t('WE_NORMALLY_RETURN_DOCUMENTS_WITHIN')} </p>
          <p className='govuk-body'>
            <a href={getFeedBackLink()} className='govuk-link' target='_blank' rel='noreferrer'>
              {t('WHAT_DID_YOU_THINK_OF_THIS_SERVICE')} {t('OPENS_IN_NEW_TAB')}
            </a>
          </p>
        </MainWrapper>
      </>
    );
  } else {
    return (
      <>
        <MainWrapper>
          <div className='govuk-panel govuk-panel--confirmation govuk-!-margin-bottom-7'>
            <h1 className='govuk-panel__title'> {t('APPLICATION_RECEIVED')}</h1>
            {isUnAuth && isCaseRefRequired && (
              <div className='govuk-panel__body'>
                {t('YOUR_REF_NUMBER')}
                <br></br>
                <strong>{refId}</strong>
              </div>
            )}
          </div>
          <p className='govuk-body'> {t('WE_HAVE_SENT_YOUR_APPLICATION')}</p>
          <h2 className='govuk-heading-m'> {t('WHAT_HAPPENS_NEXT')}</h2>
          {isUnAuth && isCaseRefRequired && <p className='govuk-body'>{t('PRINT_THIS_INFO')}</p>}
          <p className='govuk-body'> {t('WE_WILL_TELL_YOU_IN_14_DAYS')}</p>
          <p className='govuk-body'>
            <a href={getFeedBackLink()} className='govuk-link' target='_blank' rel='noreferrer'>
              {t('WHAT_DID_YOU_THINK_OF_THIS_SERVICE')} {t('OPENS_IN_NEW_TAB')}
            </a>
          </p>
        </MainWrapper>
      </>
    );
  }
};

export default ConfirmationPage;
