import React, {useEffect, useState} from 'react';
import DateFormatter from '@pega/react-sdk-components/lib/components/helpers/formatters/Date';
import Button from '../../../components/BaseComponents/Button/Button';
import PropTypes from "prop-types";
import { scrollToTop, GBdate} from '../../helpers/utils';
import { useTranslation } from 'react-i18next';
import WarningText from '../../BaseComponents/WarningText/WarningText';

declare const PCore: any;

export default function ClaimsList(props){
  const { thePConn, data, title, rowClickAction, buttonContent,  caseId} = props;
  const { t } = useTranslation();
  const [claims, setClaims] = useState([]);
  const statusMapping = (status) => {
    switch(status){
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
        return {text: t('CLAIM_RECEIVED'), tagColour:'purple'};
      default:
        return {text:status, tagColour:'grey'};
    }
  }

  const containerManger = thePConn.getContainerManager();
  const resetContainer = () => {
    const context = PCore.getContainerUtils().getActiveContainerItemName(`${PCore.getConstants().APP.APP}/primary`);
    containerManger.resetContainers({
      context:"app",
      name:"primary",     
      containerItems: [context]
    });
  }

  function _rowClick(row: any) {
    const {pzInsKey, pyAssignmentID} = row;

    const container = thePConn.getContainerName();
    const target = `${PCore.getConstants().APP.APP}/${container}`;

    if( rowClickAction === 'OpenAssignment'){
      resetContainer();
      const openAssignmentOptions = { containerName: container};
      PCore.getMashupApi().openAssignment(pyAssignmentID, target, openAssignmentOptions)
      .then(()=>{
        scrollToTop();
      }).catch(err => console.log('Error : ',err)); // eslint-disable-line no-console
    } else if ( rowClickAction === 'OpenCase'){
      PCore.getMashupApi().openCase(pzInsKey, target, {pageName:'SummaryClaim'})
      .then(()=>{
        scrollToTop();
      });
    }
  }

  function extractChildren(childrenJSON : string) {
    return JSON.parse(childrenJSON.slice(childrenJSON.indexOf(':') + 1));
  }

  function getClaims() {
    const claimsData = [];
    data.forEach(item => {
      const claimItem = {
        claimRef : item.pyID,
        dateCreated : DateFormatter.Date(item.pxCreateDateTime, { format: 'DD/MM/YYYY' }),
       dateUpdated: item.pxUpdateDateTime,
        children : [],
        actionButton :
          (<Button
              attributes={{className:'govuk-!-margin-top-4 govuk-!-margin-bottom-4'}}
              variant='secondary'
              onClick={() => {
                _rowClick(item);
              }}
            >
              {buttonContent}
            </Button>),
        status : statusMapping(item.pyStatusWork)
      };

      if(item.Claim.ChildrenJSON){
        const additionalChildren = extractChildren(item.Claim.ChildrenJSON);
        additionalChildren.forEach(child =>{
          const newChild = {
            firstName : child.name,
            lastName : ' ',
            dob : child.dob ? GBdate(child.dob) : ''
          }
          claimItem.children.push(newChild);
        })
      }else{
        claimItem.children.push({
          firstName : item.Claim.Child.pyFirstName,
          lastName : item.Claim.Child.pyLastName,
          dob : item.Claim.Child.DateOfBirth ? GBdate(item.Claim.Child.DateOfBirth) : ''
        });
      }
      claimsData.push(claimItem);
    })
    return claimsData;
  }

  useEffect(() => {
    setClaims([...getClaims()]);
  },[data])

  return (
    <>
    
      {claims.length !== 0 && <h2 className='govuk-heading-m'>{title}</h2>}
    
      {claims.length > 1 && <h3 className='govuk-heading-s'>{t('CHILDREN_ADDED')}</h3>}
      {claims.map(claimItem =>
    
        <div className='govuk-summary-list inline-block-warning' key={claimItem.claimRef}>
         {!caseId?.includes(claimItem.claimRef) &&( claimItem?.status?.text === 'In Progress' || claimItem?.status?.text === 'AR WAITH')  && <WarningText date ={claimItem?.dateUpdated}/>}
          <div className='govuk-summary-list__row'>
            <dt className='govuk-summary-list__key'>
          
              {claimItem.children.map(child =>
              
           
                <p key={child.firstName}>
                  {child.firstName && child.lastName && `${child.firstName} ${child.lastName}`}
                  {child.dob && <><br/><span className='govuk-!-font-weight-regular'>{`${t('DATE_OF_BIRTH')} ${child.dob}`}</span><br/></>}
                  <span className='govuk-!-font-weight-regular'>{t('CREATED_DATE')} {claimItem.dateCreated}</span>
                </p>
              )}
              {claimItem.actionButton}
            </dt>
            <dd className='govuk-summary-list__actions govuk-!-width-one-half'>
              <strong className={`govuk-tag govuk-tag--${claimItem.status.tagColour}`}>{claimItem.status.text}</strong>            
            </dd>
          </div>
        </div>
  )}
    </>
  )
}

ClaimsList.propTypes = {
  thePConn: PropTypes.object,
  data: PropTypes.array,
  title: PropTypes.string,
  rowClickAction: PropTypes.oneOf(["OpenCase","OpenAssignment"]),
  buttonContent: PropTypes.string
}
