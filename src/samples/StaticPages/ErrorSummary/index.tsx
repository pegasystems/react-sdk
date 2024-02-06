import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import AppHeader from '../../../components/AppComponents/AppHeader';
import AppFooter from '../../../components/AppComponents/AppFooter';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../../components/BaseComponents/MainWrapper';
import RadioButtons from '../../../components/BaseComponents/RadioButtons/RadioButtons';
import Button from '../../../components/BaseComponents/Button/Button';

export default function StaticPageErrorSummary(props) {
  return (
    <>
      <div className='govuk-error-summary' data-module='govuk-error-summary' tabIndex={-1}>
        <div role='alert'>
          <h2 className='govuk-error-summary__title'>There is a problem</h2>
          <div className='govuk-error-summary__body'>
            <ul className='govuk-list govuk-error-summary__list'>
              <li key='serviceType'>
                <a href={props.linkHref}>{props.errorSummary}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
