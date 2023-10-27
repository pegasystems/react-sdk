import React from 'react';
import { useTranslation } from 'react-i18next';


export default function ServiceNotAvailable(props) {
  const {returnToPortalPage } = props;
 
  const { t } = useTranslation();

 


  return (
   
    <div className='govuk-body govuk-!-margin-bottom-9'>
         <h2 className="govuk-heading-l">{t('SERVICE_NOT_AVAILABLE')}</h2>
         <p className="govuk-body-s">{t('COME_BACK_LATER')}</p>
        <a href="#" className="govuk-link " onClick={returnToPortalPage} >{t('RETURN_TO_THE_HOMEPAGE')}</a>
    
                  
    </div>
  );
}

