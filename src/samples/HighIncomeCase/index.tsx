import React, { FunctionComponent, useState } from 'react';
import LandingPage from './LandingPage';
import ClaimPage from './ClaimPage';

const HighIncomeCase: FunctionComponent<any> = (props) => {
    const [showLandingPage, setShowLandingPage] = useState<boolean>(!window.location.search.includes('code'));    

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