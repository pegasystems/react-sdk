// @ts-nocheck

import React, { useEffect, useState } from 'react';
import DateFormatter from '@pega/react-sdk-components/lib/components/helpers/formatters/Date';
import { useTranslation } from 'react-i18next';
import StartClaim from './StartClaim';
import PortalPage from './PortalPage';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import { GBdate } from '../../components/helpers/utils';

export default function Landing({
  handleStartCliam,
  assignmentPConn,
  showPortalBanner,
  setShowLandingPage
}) {
  const [inProgressClaims, setInProgressClaims] = useState([]);
  const [submittedClaims, setSubmittedClaims] = useState([]);
  const [showStartClaim, setShowStartClaim] = useState(false);
  const [loadingInProgressClaims, setLoadingInProgressClaims] = useState(true);
  const [loadingSubmittedClaims, setLoadingSubmittedClaims] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    setPageTitle();
  });

  function extractChildren(childrenJSON: string) {
    return JSON.parse(childrenJSON.slice(childrenJSON.indexOf(':') + 1));
  }

    const statusMapping = status => {
    switch (status) {
      case 'Open-InProgress':
        return { text: t('IN_PROGRESS'), tagColour: 'blue' };
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
        return { text: t('SUBMITTED'), tagColour: 'purple' };
      default:
        return { text: status, tagColour: 'grey' };
    }
  };

  function getClaims(data, buttonContent) {
    const claimsData = [];
    data.forEach(item => {
      if (item.ClaimExtension?.Child?.pyFirstName !== null) {
        const claimItem = {
          claimRef: item.pyID,
          dateCreated: DateFormatter.Date(item.pxCreateDateTime, { format: 'DD MMM YYYY' }),
          dateUpdated: item.pxUpdateDateTime,
          children: [],
          actionButton: buttonContent,
          status: statusMapping(item.pyStatusWork)
        };

        if (item.ClaimExtension?.ChildrenJSON) {
          const additionalChildren = extractChildren(item.ClaimExtension?.ChildrenJSON);
          additionalChildren.forEach(child => {
            const newChild = {
              firstName: child.name,
              lastName: ' ',
              dob: child.dob ? GBdate(child.dob) : ''
            };
            claimItem.children.push(newChild);
          });
        } else {
          claimItem.children.push({
            firstName: item.ClaimExtension.Child.pyFirstName,
            lastName: item.ClaimExtension.Child.pyLastName,
            dob: item.ClaimExtension.Child.DateOfBirth
              ? GBdate(item.ClaimExtension.Child.DateOfBirth)
              : ''
          });
        }
        claimsData.push(claimItem);
      }
    });
    return claimsData;
  }

  function fetchSubmittedClaimsData() {
    const operatorId = PCore.getEnvironmentInfo().getOperatorIdentifier();
    PCore.getDataPageUtils()
      // @ts-ignore
      .getDataAsync('D_ClaimantSubmittedEdStartCases', 'root', { OperatorId: operatorId })
      .then(resp => {
        const filteredCases = getClaims(resp.data.slice(0, 10), t('VIEW_MY_REQUEST'));
        setSubmittedClaims(filteredCases);
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
        inProgressClaimsData = getClaims(resp, t('REQUESTS_IN_PROGRESS'));
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
