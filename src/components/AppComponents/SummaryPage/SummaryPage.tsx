import React, {useEffect} from 'react';
import  MainWrapper from '../../BaseComponents/MainWrapper' ;
import Button from '../../BaseComponents/Button/Button';
import ParsedHTML from '../../helpers/formatters/ParsedHtml';
import setPageTitle from '../../helpers/setPageTitleHelpers';

export default function SummaryPage(props){
    const {summaryTitle, summaryContent, summaryBanner, backlinkProps} = props; 
    const {backlinkAction, backlinkText} = backlinkProps;
    
    useEffect(() => {
        setPageTitle();
    }, [summaryTitle, summaryBanner ])    
    
    return  <>
        <Button variant='backlink' onClick={backlinkAction}>{backlinkText}</Button>
        <MainWrapper>
            { (summaryBanner && summaryBanner !== "") ?
                    <div className='govuk-panel govuk-panel--confirmation govuk-!-margin-bottom-7'>
                        <h1 className='govuk-panel__title'> {summaryBanner} </h1>
                    </div> 
                    :
                    <h1 className='govuk-heading-l'>
                        {summaryTitle}
                    </h1>
            }
            <ParsedHTML htmlString={summaryContent} />
        </MainWrapper>
    </>
}
