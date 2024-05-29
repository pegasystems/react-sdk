import React, { lazy, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import i18n from 'i18next';
import ChildBenefitsClaim from '../ChildBenefitsClaim/index';
import CookiePage from '../ChildBenefitsClaim/cookiePage/index';
import Accessibility from '../ChildBenefitsClaim/AccessibilityPage';
import UnAuthChildBenefitsClaim from '../UnAuthChildBenefitsClaim';
import HighIncomeCase from '../HighIncomeCase';
import AreYouSureToContinueWithoutSignIn from '../StaticPages/AreYouSureToContinueWithoutSignIn/AreYouSureToContinueWithoutSignIn';
import DoYouWantToSignIn from '../StaticPages/DoYouWantToSignIn/doYouWantToSignIn';
import CheckOnClaim from '../StaticPages/CheckOnClaim';
import RecentlyClaimedChildBenefit from '../StaticPages/ChooseClaimService';

const EducationStart = lazy(() => import('../EducationStart'));

const AppSelector = () => {
  const [i18nloaded, seti18nloaded] = useState(false);

  i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      lng: sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en',

      backend: {
        loadPath: `assets/i18n/{{lng}}.json`
      },
      fallbackLng: 'en',
      debug: false,
      returnNull: false,
      react: {
        useSuspense: false
      }
    })
    .finally(() => {
      seti18nloaded(true);
    });

  return !i18nloaded ? null : (
    <Switch>
      <Route exact path='/' component={ChildBenefitsClaim} />
      <Route exact path='/ua' component={UnAuthChildBenefitsClaim} />
      <Route exact path='/hicbc/opt-in' component={HighIncomeCase} />
      <Route
        exact
        path='/education/start'        
      >
        <React.Suspense fallback={<></>}>
          <EducationStart />
        </React.Suspense>
      </Route>
      <Route path='/cookies' component={CookiePage} />
      <Route path='/accessibility' component={Accessibility} />
      <Route
        path='/are-you-sure-to-continue-without-sign-in'
        component={AreYouSureToContinueWithoutSignIn}
      />
      <Route path='/sign-in-to-government-gateway' component={DoYouWantToSignIn} />
      <Route path='/check-on-claim' component={CheckOnClaim} />
      <Route path='/recently-claimed-child-benefit' component={RecentlyClaimedChildBenefit} />
    </Switch>
  );
};

export default AppSelector;
