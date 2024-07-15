import React from 'react';
import { useTranslation } from 'react-i18next';

export default function NoAwardPage(){  

    const { t } = useTranslation()

    return (
    <>
        <h1 className="govuk-heading-xl">{t('NO_AWARD_HEADING')}</h1>
        <p className="govuk-body">{t('NO_AWARD_CANNOT_FIND_CLAIM')}</p>
        <p className="govuk-body">{t('NO_AWARD_THIS_MAY_BE_BECAUSE')}</p>
        <ul className="govuk-list govuk-list--bullet">
            <li>{t('NO_AWARD_NOT_MADE_CLAIM_LISTITEM')}</li>
            <li>{t('NO_AWARD_CLAIM_STILL_PROCESSING_LISTITEM')}</li>
            <li>{t('NO_AWARD_SOMEONE_ELSE_MADE_CLAIM_LISTITEM')}</li>
            <li>{t('NO_AWARD_NO_LONGER_RECEIVING_BENEFIT')}</li>
        </ul>
        <p className="govuk-body">{t('NO_AWARD_YOU_CAN')} <a className="govuk-link" rel="noreferrer noopener" target="_blank" href="https://www.gov.uk/child-benefit">{`${t('NO_AWARD_FIND_OUT_MORE_LINKTEXT')} ${t('OPENS_IN_NEW_TAB')}`}</a>.</p>
    </>
    )
}
