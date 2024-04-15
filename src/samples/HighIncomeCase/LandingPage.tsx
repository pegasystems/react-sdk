import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import  MainWrapper   from '../../components/BaseComponents/MainWrapper';
import  RadioButtons  from '../../components/BaseComponents/RadioButtons/RadioButtons';
import  Button from '../../components/BaseComponents/Button/Button';
import ErrorSummary from './reuseables/ErrorSummary';
import AppHeader from './reuseables/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import useHMRCExternalLinks from '../../components/helpers/hooks/HMRCExternalLinks';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';

export default function LandingPage(props){
    const {onProceedHandler} = props;    
    const beforeOptionValue = 'before6April';     
    const onOrAfterOptionValue = 'onOrAfter6April'; 
    const [errorText, setErrorText] = useState('');
    const [selectedOption, setSelectedOption] = useState();  

    const { hmrcURL } = useHMRCExternalLinks();

    useEffect(() => {
    setPageTitle(!!errorText)
    }, [errorText] )

    const {t} = useTranslation()
    const changeHandler = (evt) => {
        setSelectedOption(evt.target.value);        
    }

    const onContinue = () => {
        if(!selectedOption){    
            setErrorText(t("HICBC_LANDINGPAGE_NO_OPTION_SELECTED_ERROR_MESSAGE"));   
        }  
        else if(selectedOption === beforeOptionValue){
            window.location.href = 
            "https://www.tax.service.gov.uk/digital-forms/form/high-income-child-benefit-tax-charge/draft/guide?_ga=2.201863441.1270276781.1710754405-974122855.1694433480";
        }
        else if(selectedOption === onOrAfterOptionValue){
            onProceedHandler();
        }        
    }    
    
    return (
        <>
            <AppHeader
                appname={t('HIGH_INCOME_BENEFITS')}
                hasLanguageToggle 
                betafeedbackurl={`${hmrcURL}contact/beta-feedback?service=463&referrerUrl=${window.location}`}                  
            />
            <div className='govuk-width-container'>                
                <MainWrapper>
                    {errorText && <ErrorSummary errors={[{message:errorText, fieldId:'optin-date'}]}/> }
                    <h1 className="govuk-heading-xl">{t('HIGH_INCOME_BENEFITS')}</h1>
                    <p className="govuk-body"> {t("HICBC_LANDINGPAGE_P1")}</p>
                    <p className="govuk-body"> {t("HICBC_LANDINGPAGE_P2")}</p>
                    <ul className="govuk-list govuk-list--bullet">
                        <li>{t("HICBC_LANDINGPAGE_LISTITEM1")}</li>
                        <li>{t("HICBC_LANDINGPAGE_LISTITEM2")}</li>
                        <li>{t("HICBC_LANDINGPAGE_LISTITEM3")}</li>
                    </ul>
                    <RadioButtons
                    name='optin-date' 
                    options={[
                        {label:t('HICBC_LANDINGPAGE_BEFORE_6_APRIL_OPTION_LABEL'), value:beforeOptionValue},
                        {label:t('HICBC_LANDINGPAGE_ONORAFTER_6_APRIL_OPTION_LABEL'), value:onOrAfterOptionValue}   ]} 
                    displayInline={false}
                    label={t('HICBC_LANDINGPAGE_QUESTION_LABEL')}
                    useSmallRadios={false}
                    legendIsHeading={false}
                    errorText={errorText}
                    onChange={changeHandler}  
                    value={selectedOption}           
                    />
                    <Button id='continueToOptin' onClick={onContinue} variant='start'>{t("START_NOW")}</Button>
                    <br />
                </MainWrapper>
            </div>
            <AppFooter />
        </>
    )
}