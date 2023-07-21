import React from 'react';
import Button from '../../components/BaseComponents/Button/Button';

export default function UserPortal(props){

  const { beginClaim, children } = props;

  return (
    <>
      <div className="govuk-grid-column-two-thirds">
          <h1 className='govuk-heading-xl'>Your claim applications</h1>
      </div>
      <div className="govuk-grid-column-two-thirds">
          <p className='govuk-body'>We&apos;re only listing your cases that need completing for information on claims or applications that have been submitted. Use the contact information to speak with a Benefits Officer</p>
          {children}
      </div>
      <div className="govuk-grid-column-one-third">
        <p className='govuk-body'>
          Call the Child Benefit helpline if you need to speak with us or use the chat
        </p>
        <p className='govuk-body'>
          You&apos;ll need:
        </p>
        <ul className='govuk-list govuk-list--bullet'>
          <li >National Insurance number</li>
        </ul>
        <ul className='govuk-details__text govuk-list'>
          <li>Child Benefit helpline</li>
          <li>Telephone: 0300 200 3100</li>
          <li>Welsh language: 0300 200 1900</li>
          <li>Textphone: 0300 200 3103 </li>
          <li>Outside UK: +44 161 210 3086</li>
          <li>Monday to Friday, 8am to 6pm</li>
        </ul>

        <span className='govuk-heading-m'>Online</span>
        <a className='govuk-link'>Ask HMRC online</a>
        <Button attributes={{className:'govuk-!-margin-top-4'}} onClick={beginClaim} variant='start'>Begin New Claim</Button>
      </div>
    </>)
}
