import React from 'react';
import  MainWrapper from '../../BaseComponents/MainWrapper' ;
import ParsedHTML from '../../helpers/formatters/ParsedHtml';

export default function SummaryPage(props){
    const {summaryTitle, summaryContent, summaryBanner} = props;

    if(summaryBanner && summaryBanner !== ""){
        return (<>
                <MainWrapper>
                    <div className='govuk-panel govuk-panel--confirmation govuk-!-margin-bottom-7'>
                        {summaryBanner}
                    </div>
                        <ParsedHTML htmlString={summaryContent} />
                </MainWrapper>
            </>
        )
    }
    
    return  <>
        <MainWrapper>
            <h1>
                {summaryTitle}
            </h1>
            <ParsedHTML htmlString={summaryContent} />
        </MainWrapper>
    </>
}
