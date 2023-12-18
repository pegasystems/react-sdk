import React from 'react';
import AppHeader from '../../../components/AppComponents/AppHeader';
import AppFooter from '../../../components/AppComponents/AppFooter';
import LanguageToggle from '../../../components/AppComponents/LanguageToggle';
import { useTranslation } from 'react-i18next';
import useHMRCExternalLinks from '../../../components/helpers/hooks/HMRCExternalLinks';
import MainWrapper from '../../../components/BaseComponents/MainWrapper';

export default function Accessibility() {
  const { t } = useTranslation();
  const {referrerURL, hmrcURL} = useHMRCExternalLinks();

    const makeList = (listNumber: number, entries: number) => {
        const output = [];
        for (let i = 0; i < entries; i += 1) {
            output.push(<li key={`${listNumber}${i}`}>{t(`ACCESSIBILITY_LIST_${listNumber}_${i}`)}</li>)
        }
        return output;
    };

    return (
        <>
            <AppHeader appname={t("CLAIM_CHILD_BENEFIT")}/>
            <div className="govuk-width-container">
                <LanguageToggle />
                <MainWrapper>
                    <h1 className="govuk-heading-l">
                        {t("ACCESSIBLITY_STATEMENT_FOR_CHB_SERVICE")}
                    </h1>
                    <p className='govuk-body-l'>
                        {t("THIS_AS_EXPLAINS_HOW")}
                    </p>
                    <p className='govuk-body'>{t("THIS_SERVICE_IS_A_PART_GOVUK_WEBSITE")}<a href="https://www.gov.uk/help/accessibility-statement">{t("SEPARATE_AS_FOR_MAIN_GOVUK_WEBSITE")} {t("OPENS_IN_NEW_TAB")}</a>.</p>
                    <p className='govuk-body'>{t("THIS_PAGE_CONTAINS_INFO_ABOUT_CHB_SERVICE")}</p>
                    
                    
                    <h2 className="govuk-heading-l">
                        {t("USING_THIS_SERVICE")}
                    </h2>
                    <p className='govuk-body'>{t("USE_THIS_FORM_TO_CLAIM")}{t("USE_THIS_FORM_TO_CLAIM_CONTD")}</p>
                    <p className='govuk-body'>{t("THIS_IS_RUN_BY_HMRC")}</p>
                    <ul className="govuk-list govuk-list--bullet">
                        {makeList(1, 5)}
                    </ul>
                    <p className='govuk-body'>{t("WE_HAVE_MADE_TEXTS_SIMPLER")}</p>
                    <p className='govuk-body'>
                        <a className="govuk-link" href="https://mcmw.abilitynet.org.uk/">{t("ABILITYNET_HAS_ADVICE")} {t("OPENS_IN_NEW_TAB")}</a> {t("MAKING_YOUR_DEVICE_EASIER")}
                    </p>
                    
                    
                    <h2 className="govuk-heading-l">
                        {t("HOW_ACCESSIBLE_THIS_SERVICE_IS")}
                    </h2>
                    <p className='govuk-body'>{t("SERVICE_IS_NONCOMPLIANT")} <a className="govuk-link" href="https://www.w3.org/TR/WCAG21/">{t("WEB_CONTENT_ACCESSIBILITY_VERSION")} {t("OPENS_IN_NEW_TAB")}</a>. {t("THIS_SERVICE_HAS_NOT_YET_BEEN_CHECKED")}</p>
                    
                    
                    <h2 className="govuk-heading-l">
                        {t("WHAT_TO_DO_IF_YOU_HAVE_DIFFICULTY_USING_THIS")}
                    </h2>
                    <p className='govuk-body'>{t("YOU_CAN")} <a className="govuk-link" href="https://www.gov.uk/get-help-hmrc-extra-support">{t("CONTACT_HMRC_FOR_EXTRA_SUPPORT")} {t("OPENS_IN_NEW_TAB")}</a> {t("IF_YOU_NEED_HELP_WITH_AUDIORECORDING_BRAILLE_ETC")}</p>
                    
                    
                    <h2 className="govuk-heading-l">
                        {t("REPORTING_ACCESSIBILITY_PROBLEMS_WITH_THIS_SERVICE")}
                    </h2>
                    <p className='govuk-body'>{t("WE_ARE_ALWAYS_LOOKING_TO_IMPROVE")} <a className="govuk-link" href={`${hmrcURL}contact/accessibility?service=463&referrerUrl=${referrerURL}`}>{t("REPORT_THE_ACCESSIBILITY_PROBLEM")} {t("OPENS_IN_NEW_TAB")}</a>.</p>
                    
                    
                    <h2 className="govuk-heading-l">
                        {t("IF_YOU_ARE_NOT_HAPPY")}
                    </h2>
                    <p className='govuk-body'>
                        {t("EHRC_ENFORCES_ACCESSIBILITY_REGULATIONS")}
                        <a className="govuk-link" href="https://www.equalityadvisoryservice.com/">{t("CONTACT_THE_EASS")} {t("OPENS_IN_NEW_TAB")}</a>
                        {t("OR_THE")}
                        <a className="govuk-link" href="https://www.equalityni.org/Home">{t("ECNI")} {t("OPENS_IN_NEW_TAB")}</a>
                        {t("IF_YOU_LIVE_IN_NORTHERN_IRELAND")}
                    </p>
                    
                    
                    <h2 className="govuk-heading-l">
                        {t("CONTACTING_US_BY")}
                    </h2>
                    <p className='govuk-body'>{t("FOR_HEARING_IMPAIRED")}</p>
                    <p className='govuk-body'>{t("BRITISH_SIGN_LANGUGAE")}</p>
                    <p className='govuk-body'>
                        {t("FIND_OUT")}
                        <a className="govuk-link" href="https://www.gov.uk/get-help-hmrc-extra-support">{t("HOW_TO_GET_EXTRA_SUPPORT")} {t("OPENS_IN_NEW_TAB")}</a>
                    </p>
                    
                    
                    <h2 className="govuk-heading-l">
                        {t("TECHNICAL_INFO_ABOUT_THIS_SERVICE")}
                    </h2>
                    <p className='govuk-body'>{t("HMRC_IS_COMMITTED_TO_MAKING_THIS_ACCESSIBLE")}</p>
                    <p className='govuk-body'>
                        {t("SERVICE_IS_NONCOMPLIANT")}
                        <a className="govuk-link" href="https://www.w3.org/TR/WCAG21/">{t("WEB_CONTENT_ACCESSIBILITY_VERSION")} {t("OPENS_IN_NEW_TAB")}</a>
                        {t("DUE_TO_THESE_NONCOMPLIANCES")}
                    </p>
                    <p className='govuk-body'>{t("IT_HAS_NOT_BEEN_TESTED")}</p>

                    <h2 className="govuk-heading-l">
                        {t("HOW_WE_TESTED_THIS")}
                    </h2>
                    <p className='govuk-body'>{t("THIS_SERVICE_HAS_NOT_BEEN_TESTED")}</p>
                    <p className='govuk-body'>{t("PREPARED_AND_LAST_UPDATED")}</p>
                </MainWrapper>
            </div>
            <AppFooter />
        </>
    )
};
