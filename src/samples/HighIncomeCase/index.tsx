import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LandingPage from './LandingPage';
import ClaimPage from './ClaimPage';
import setPageTitle, { registerServiceName } from '../../components/helpers/setPageTitleHelpers';

const HighIncomeCase: FunctionComponent<any> = () => {
    const [showLandingPage, setShowLandingPage] = useState<boolean>(!window.location.search.includes('code')); 
    const {t} = useTranslation();   
    registerServiceName(t('HIGH_INCOME_BENEFITS'));
    const landingPageProceedHandler = () => {
        localStorage.setItem('showLandingPage', 'false');
        setShowLandingPage(false);
    }
    return (
        <>            
            {showLandingPage ?
            <LandingPage onProceedHandler={landingPageProceedHandler}/>             
            : <ClaimPage/>}
        </>
    )
}
export default HighIncomeCase;