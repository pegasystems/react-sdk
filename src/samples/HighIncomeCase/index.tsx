import React, { FunctionComponent, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LandingPage from './LandingPage';
import ClaimPage from './ClaimPage';
import setPageTitle, { registerServiceName } from '../../components/helpers/setPageTitleHelpers';
import { getSdkConfig } from '@pega/react-sdk-components/lib/components/helpers/config_access';
import AppHeader from './reuseables/AppHeader';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import AppFooter from '../../components/AppComponents/AppFooter';

const HighIncomeCase: FunctionComponent<any> = () => {
    const [showLandingPage, setShowLandingPage] = useState<boolean>(!window.location.search.includes('code')); 
    const [shuttered, setShuttered] = useState(null)

    const {t} = useTranslation();   
    registerServiceName(t('HIGH_INCOME_BENEFITS'));
    const landingPageProceedHandler = () => {
        localStorage.setItem('showLandingPage', 'false');
        setShowLandingPage(false);
    }

    useEffect(()=>{
        getSdkConfig().then((config)=>{
            config.hicbcOptinConfig?.shutterService ? setShuttered(config.hicbcOptinConfig.shutterService) : setShuttered(false)
        })
    }, []);


    if(shuttered === null) {
        return null;
    } else if(shuttered){  
        setPageTitle();
        return (  
            <>
                {/* <AppHeader
                    appname={useTranslation().t('HIGH_INCOME_BENEFITS')}
                    hasLanguageToggle={false}                   
                />
                <div className='govuk-width-container'>                
                    <MainWrapper>                            
                        <ShutterServicePage />
                    </MainWrapper>
                </div> */}
                <AppHeader
                    appname={t('HIGH_INCOME_BENEFITS')}
                    hasLanguageToggle={false}                   
                />
                <div className='govuk-width-container'>                
                    <MainWrapper showPageNotWorkingLink={false}>                            
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-two-thirds">
                            <h1 className="govuk-heading-l">Sorry, the service is unavailable</h1>
                            <p className="govuk-body">Try again later.</p>
                            <p className="govuk-body">You can return to <a className="govuk-link" href="https://www.gov.uk/child-benefit">Child Benefit guidance</a></p>          
                            </div>
                        </div>
                    </MainWrapper>
                </div>
                <AppFooter />
            </>
        )
    }
    else {
    return (
        <>            
            {showLandingPage ?
            <LandingPage onProceedHandler={landingPageProceedHandler}/>             
            : <ClaimPage/>}
        </>
    )
    }
}
export default HighIncomeCase;