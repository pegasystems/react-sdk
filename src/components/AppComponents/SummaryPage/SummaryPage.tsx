import React from 'react';
import  MainWrapper from '../../BaseComponents/MainWrapper' ;
import ParsedHTML from '../../helpers/formatters/ParsedHtml';

export default function SummaryPage(props){
    const {summaryTitle, summaryContent, summaryBanner} = props;

    if(summaryBanner && summaryBanner !== ""){
        return (<>
                <MainWrapper>
                    <div className='govuk-panel govuk-panel--confirmation govuk-!-margin-bottom-7'>
                        <h1 className='govuk-panel__title'> {summaryBanner} </h1>
                    </div>
                        <ParsedHTML htmlString={summaryContent} />
                </MainWrapper>
            </>
        )
    }
    
    return  <>
        <MainWrapper>
            <h1 className='govuk-heading-l'>
                {summaryTitle}
            </h1>
            <ParsedHTML htmlString={summaryContent} />
        </MainWrapper>
    </>
}
