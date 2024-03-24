import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import  MainWrapper   from '../../components/BaseComponents/MainWrapper';
import  RadioButtons  from '../../components/BaseComponents/RadioButtons/RadioButtons';
import  Button from '../../components/BaseComponents/Button/Button';
import ErrorSummary from '../../components/BaseComponents/ErrorSummary/ErrorSummary';

export default function LandingPage(props){
    const {onProceedHandler} = props;    
    const beforeOptionValue = 'before6April';     
    const onOrAfterOptionValue = 'onOrAfter6April'; 
    const [errorText, setErrorText] = useState('');
    const [selectedOption, setSelectedOption] = useState();  

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

    const {t} = useTranslation()

    return (
        <MainWrapper>
            {errorText && <ErrorSummary errors={[{message:errorText, fieldId:'optin-date'}]}/> }
            <RadioButtons
            name='optin-date' 
            options={[
                {label:t('HICBC_LANDINGPAGE_BEFORE_6_APRIL_OPTION_LABEL'), value:beforeOptionValue},
                {label:t('HICBC_LANDINGPAGE_ONORAFTER_6_APRIL_OPTION_LABEL'), value:onOrAfterOptionValue}   ]} 
            displayInline={false}
            label={t('HICBC_LANDINGPAGE_QUESTION_LABEL')}
            useSmallRadios={false}
            legendIsHeading={true}
            errorText={errorText}
            onChange={changeHandler}  
            value={selectedOption}          
            />
            <Button id='continueToOptin' onClick={onContinue}>{t("CONTINUE")}</Button>
            <br />
        </MainWrapper>
    )
}