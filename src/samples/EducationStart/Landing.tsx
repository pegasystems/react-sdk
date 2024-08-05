// @ts-nocheck

import React, { useEffect, useState } from 'react';
import StartClaim from './StartClaim';
import PortalPage from './PortalPage';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';

export default function Landing({
  handleStartCliam,
  assignmentPConn,
  showPortalBanner,
  setShowLandingPage,
  showPortalPageDefault,
  setShowPortalPageDefault,
  setShutterServicePage
}) {
  const [inProgressClaims, setInProgressClaims] = useState([]);
  const [submittedClaims, setSubmittedClaims] = useState([]);
  const [showStartClaim, setShowStartClaim] = useState(false);
  const [loadingInProgressClaims, setLoadingInProgressClaims] = useState(true);
  const [loadingSubmittedClaims, setLoadingSubmittedClaims] = useState(true);

  useEffect(() => {
    setPageTitle();
  });

  function extractChildren(childrenJSON: string) {
    return JSON.parse(childrenJSON.slice(childrenJSON.indexOf(':') + 1));
  }

  const statusMapping = status => {
    switch (status) {
      case 'Open-InProgress':
        return { text: 'IN_PROGRESS_1', tagColour: 'blue' };
      case 'Pending-CBS':
      case 'Resolved-Completed':
      case 'Resolved-Rejected':
      case 'Pending-ManualInvestigation':
      case 'Pending-verify documentation':
      case 'Pending-awaiting documentation':
      case 'Pending-VerifyDocumentation':
      case 'Pending-SystemError':
      case 'Pending-AwaitingDocumentation':
      case 'Pending-Disallowance':
      case 'Resolved-Disallowance':
        return { text: 'SUBMITTED', tagColour: 'purple' };
      default:
        return { text: status, tagColour: 'grey' };
    }
  };

  function getClaims(data, buttonContent) {
    const claimsData = [];
    data.forEach(item => {
        const claimItem = {
          claimRef: item.pyID,
          dateCreated: item.pxCreateDateTime,
          dateUpdated: item.pxUpdateDateTime,
          children: [],
          actionButton: buttonContent,
          rowDetails: { pzInsKey: item.pzInsKey, pyAssignmentID: item.pyAssignmentID },
          status: statusMapping(item.pyStatusWork)
        };

        if (item.ClaimExtension?.ChildrenJSON) {
          const additionalChildren = extractChildren(item.ClaimExtension?.ChildrenJSON);
          additionalChildren.forEach(child => {
            const newChild = {
              firstName: child.name,
              lastName: ' ',
              dob: child.dob
            };
            claimItem.children.push(newChild);
          });
        } else {
          claimItem.children.push({
            firstName: item.ClaimExtension.Child.pyFirstName,
            lastName: item.ClaimExtension.Child.pyLastName,
            dob: item.ClaimExtension.Child.DateOfBirth
              ? (item.ClaimExtension.Child.DateOfBirth)
              : ''
          });
        }
        claimsData.push(claimItem);
    });
    return claimsData;
  }

  function fetchSubmittedClaimsData() {
    const operatorId = PCore.getEnvironmentInfo().getOperatorIdentifier();
    PCore.getDataPageUtils()
      // @ts-ignore
      .getDataAsync('D_ClaimantSubmittedEdStartCases', 'root', { OperatorId: operatorId })
      .then(resp => {
        const filteredCases = getClaims(resp.data.slice(0, 10), 'VIEW_MY_REQUEST');
        setSubmittedClaims(filteredCases);
      })
      .finally(() => setLoadingSubmittedClaims(false));
  }

  function fetchInProgressClaimsData() {
    let inProgressClaimsData: any = [];
    // @ts-ignore
    PCore.getDataPageUtils()
      .getDataAsync('D_ClaimantWorkAssignmentEdStartCases', 'root')
      .then(resp => {
        resp = resp.data.slice(0, 10);
        inProgressClaimsData = getClaims(resp, 'CONTINUE_MY_REQUEST');
        setInProgressClaims(inProgressClaimsData);
      })
      .finally(() => {
        setLoadingInProgressClaims(false);
      });
  }

  useEffect(() => {
    fetchInProgressClaimsData();
    fetchSubmittedClaimsData();
  }, []);

  return (
    (!loadingInProgressClaims && !loadingSubmittedClaims) && (
      <>
        {showPortalPageDefault ||
        (!showStartClaim && (inProgressClaims.length || submittedClaims.length)) ? (
          <PortalPage
            inProgressClaims={inProgressClaims}
            submittedClaims={submittedClaims}
            assignmentPConn={assignmentPConn}
            setShowStartClaim={setShowStartClaim}
            showPortalBanner={showPortalBanner}
            setShowLandingPage={setShowLandingPage}
            setShowPortalPageDefault={setShowPortalPageDefault}
            setShutterServicePage={setShutterServicePage}
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
