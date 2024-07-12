// @ts-nocheck

import React, { useEffect, useState } from 'react';
import StartClaim from './StartClaim';
import PortalPage from './PortalPage';

export default function Landing({ handleStartCliam, assignmentPConn, showPortalBanner, setShowLandingPage }) {
  const [inProgressClaims, setInProgressClaims] = useState([]);
  const [submittedClaims, setSubmittedClaims] = useState([]);
  const [showStartClaim, setShowStartClaim] = useState(false);
  const [loadingInProgressClaims, setLoadingInProgressClaims] = useState(true);
  const [loadingSubmittedClaims, setLoadingSubmittedClaims] = useState(true);

  function fetchSubmittedClaimsData() {
    const operatorId = PCore.getEnvironmentInfo().getOperatorIdentifier();
    PCore.getDataPageUtils()
      // @ts-ignore
      .getDataAsync('D_ClaimantSubmittedEdStartCases', 'root', { OperatorId: operatorId })
      .then(resp => {
        setSubmittedClaims(resp.data.slice(0, 10));
      })
      .finally(() => setLoadingSubmittedClaims(false));
  }

  function fetchInProgressClaimsData(isSaveComeBackClicked = false) {
    let inProgressClaimsData: any = [];
    // @ts-ignore
    PCore.getDataPageUtils()
      .getDataAsync('D_ClaimantWorkAssignmentEdStartCases', 'root')
      .then(resp => {
        resp = resp.data.slice(0, 10);
        inProgressClaimsData = resp;
        setInProgressClaims(inProgressClaimsData);
      })
      .finally(() => {
        setLoadingInProgressClaims(false);
        if (isSaveComeBackClicked) {
          // Here we are calling this close container because of the fact that above
          // D_ClaimantWorkAssignmentChBCases API is getting excuted as last call but we want to make
          // close container call as the very last one.
          PCore.getContainerUtils().closeContainerItem(
            PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
            { skipDirtyCheck: true }
          );
        }
      });
  }

  useEffect(() => {
    fetchInProgressClaimsData();
    fetchSubmittedClaimsData();
  }, []);

  return (
    !(loadingInProgressClaims && loadingSubmittedClaims) && (
      <>
        {!showStartClaim && (inProgressClaims.length || submittedClaims.length) ? (
          <PortalPage
            inProgressClaims={inProgressClaims}
            submittedClaims={submittedClaims}
            assignmentPConn={assignmentPConn}
            setShowStartClaim={setShowStartClaim}
            showPortalBanner={showPortalBanner}
            setShowLandingPage={setShowLandingPage}
          />
        ) : (
          <StartClaim
            handleStartCliam={handleStartCliam}
            setShowStartClaim={setShowStartClaim}
            showStartClaim={showStartClaim}
          />
        )}
      </>
    )
  );
}
