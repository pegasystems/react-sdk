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
                        {t("ACCESSIBILITY_HEADING_1")}
                    </h1>
                    <p className='govuk-body-l'>
                        {t("ACCESSIBILITY_HEADING_2")}
                    </p>
                    <p className='govuk-body'>{t("ACCESSIBILITY_P_1")}</p>
                    <p className='govuk-body'>{t("ACCESSIBILITY_P_2")}</p>
                    <h1 className="govuk-heading-l">
                        {t("ACCESSIBILITY_HEADING_3")}
                    </h1>
                    <p className='govuk-body'>{t("ACCESSIBILITY_P_3")}</p>
                    <p className='govuk-body'>{t("ACCESSIBILITY_P_4")}</p>
                    <ul className="govuk-list govuk-list--bullet">
                        {makeList(1, 5)}
                    </ul>
                    <p className='govuk-body'>{t("ACCESSIBILITY_P_5")}</p>
                    <p className='govuk-body'>
                        <a className="govuk-link" href="https://mcmw.abilitynet.org.uk/">{t("ACCESSIBILITY_ANCHOR_1")}</a>
                        {t("ACCESSIBILITY_P_6")}
                    </p>
                    <h1 className="govuk-heading-l">
                        {t("ACCESSIBILITY_P_7")}
                    </h1>
                    <p className='govuk-body'>{t("ACCESSIBILITY_P_8")} <a className="govuk-link" href="https://www.w3.org/TR/WCAG21/">{t("ACCESSIBILITY_ANCHOR_2")}</a>.</p>
                    <p className='govuk-body'>{t("ACCESSIBILITY_P_9")}</p>
                    <ul className="govuk-list govuk-list--bullet">
                        {makeList(2, 27)}
                    </ul>
                    <h1 className="govuk-heading-l">
                        {t("ACCESSIBILITY_HEADING_4")}
                    </h1>
                    <p className='govuk-body'>{t("ACCESSIBILITY_P_10")} <a className="govuk-link" href="https://www.gov.uk/get-help-hmrc-extra-support">{t("ACCESSIBILITY_ANCHOR_3")}</a> {t("ACCESSIBILITY_P_11")}</p>
                    <h1 className="govuk-heading-l">
                        {t("ACCESSIBILITY_HEADING_5")}
                    </h1>
                    <p className='govuk-body'>{t("ACCESSIBILITY_P_12")} <a className="govuk-link" href={`${hmrcURL}contact/accessibility?service=463&referrerUrl=${referrerURL}`}>{t("ACCESSIBILITY_ANCHOR_4")}</a>.</p>
                    <h1 className="govuk-heading-l">
                        {t("ACCESSIBILITY_HEADING_6")}
                    </h1>
                    <p className='govuk-body'>
                        {t("ACCESSIBILITY_P_13")}
                        <a className="govuk-link" href="https://www.equalityadvisoryservice.com/">{t("ACCESSIBILITY_ANCHOR_5")}</a>
                        {t("ACCESSIBILITY_P_14")}
                        <a className="govuk-link" href="https://www.equalityni.org/Home">{t("ACCESSIBILITY_ANCHOR_6")}</a>
                        {t("ACCESSIBILITY_P_15")}
                    </p>
                    <h1 className="govuk-heading-l">
                        {t("ACCESSIBILITY_HEADING_7")}
                    </h1>
                    <p className='govuk-body'>{t("ACCESSIBILITY_P_16")}</p>
                    <p className='govuk-body'>{t("ACCESSIBILITY_P_17")}</p>
                    <p className='govuk-body'>
                        {t("ACCESSIBILITY_P_18")}
                        <a className="govuk-link" href="https://www.gov.uk/get-help-hmrc-extra-support">{t("ACCESSIBILITY_ANCHOR_7")}</a>
                    </p>
                    <h1 className="govuk-heading-l">
                        {t("ACCESSIBILITY_HEADING_8")}
                    </h1>
                    <p className='govuk-body'>{t("ACCESSIBILITY_P_19")}</p>
                    <p className='govuk-body'>
                        {t("ACCESSIBILITY_P_20")}
                        <a className="govuk-link" href="https://www.w3.org/TR/WCAG21/">{t("ACCESSIBILITY_ANCHOR_8")}</a>
                        {t("ACCESSIBILITY_P_21")}
                    </p>
                    <ol className="govuk-list govuk-list--number">
                        {makeList(3, 26)}
                    </ol>

                    <h1 className="govuk-heading-l">
                        {t("ACCESSIBILITY_HEADING_9")}
                    </h1>
                    <p className='govuk-body'>{t("ACCESSIBILITY_P_22")}</p>
                    <p className='govuk-body'>
                        {t("ACCESSIBILITY_P_23")}
                        <a className="govuk-link" href="https://www.digitalaccessibilitycentre.org/">{t("ACCESSIBILITY_ANCHOR_9")}</a>
                        {t("ACCESSIBILITY_P_24")}
                    </p>
                    <p className='govuk-body'>{t("ACCESSIBILITY_P_25")}</p>
                    <p className="govuk-body">
                        <a className="govuk-link" href={`${hmrcURL}contact/report-technical-problem?newTab=true&service=463&referrerUrl=${referrerURL}`} rel="noreferrer" target="_blank">
                            {t("ACCESSIBILITY_ANCHOR_10")} {t('OPENS_IN_NEW_TAB')}
                        </a>
                    </p>
                </MainWrapper>
            </div>
            <AppFooter />
        </>
    )
};
