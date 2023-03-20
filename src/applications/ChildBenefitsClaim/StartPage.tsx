import React from 'react'
import Button from '../../components/BaseComponents/Button/Button'

const StartPage: React.FC<{onStart: React.MouseEventHandler}> = ({onStart}) => {
  return (
    <div className='govuk-grid-row'>
      <div className='govuk-grid-column-two-thirds'>
        <h1 className='govuk-heading-xl'>Claim Child Benefit</h1>
        <p className='govuk-body'>
          Use this form to claim Child Benefit if you or your partner are responsible for a child
          who is under 16, or under 20 if they are in{' '}
          <a
            className='govuk-link '
            target='_blank'
            rel='noopener noreferrer'
            href='https://www.gov.uk/child-benefit-16-19'
          >
            approved education or training (opens in new tab)
          </a>
          .
        </p>
        <h2 className='govuk-heading-m'>Who can apply</h2>
        <p className='govuk-body'>Only one person can claim Child Benefit.</p>
        <p className='govuk-body'>
          If you are in a couple and one of you does not work or earns less than £242 a week, it is
          recommended for that person to claim to help protect their state pension. They should fill
          out this form.
        </p>
        <p className='govuk-body'>
          You do not need to be the parent of the child to claim Child Benefit.
        </p>
        <h2 className='govuk-heading-m'>When to apply</h2>
        <p className='govuk-body'>
          Claim as soon as your baby is born and registered or once a child comes to live with you,
          including adoption.
        </p>
        <p className='govuk-body'>
          To claim, the child must either be under 16 or under 20 and in full-time, non-advanced
          education or approved training.
        </p>
        <h2 className='govuk-heading-m'>Before you start</h2>
        <p className='govuk-body'>
          To complete this form, you’ll need the following documents for any children you are
          applying for, depending on your circumstance:
        </p>
        <ul className='govuk-list govuk-list--bullet'>
          <li>birth certificate</li>
          <li>passport or travel documents used to enter the UK</li>
          <li>adoption certificate</li>
        </ul>
        <p className='govuk-body'>You will also need:</p>
        <ul className='govuk-list govuk-list--bullet'>
          <li>your bank or building society details</li>
          <li>your National Insurance number</li>
          <li>your partner’s National Insurance number, if you have a partner</li>
        </ul>
        <div className='govuk-warning-text'>
          <span className='govuk-warning-text__icon' aria-hidden='true'>
            !
          </span>
          <strong className='govuk-warning-text__text'>
            <span className='govuk-warning-text__assistive'></span>
            Do not delay making your claim as Child Benefit can only be backdated up to 3 months.
          </strong>
        </div>
        <Button variant='start' onClick={onStart}>
          Start now
        </Button>
        <p className='govuk-body'>
          If you have any questions about Child Benefit, <a
            href='https://www.gov.uk/government/organisations/hm-revenue-customs/contact/child-benefit' className='govuk-link'>contact the Child Benefit helpline</a>.
        </p>
        <div className='govuk-!-margin-top-8'>
          <a
            lang='en'
            className='govuk-link hmrc-report-technical-issue '
            rel='noreferrer noopener'
            target='_blank'
            href='https://www.tax.service.gov.uk/contact/report-technical-problem?newTab=true&amp;service=claim-child-benefit&amp;referrerUrl=https%3A%2F%2Fwww.tax.service.gov.uk%2Ffill-online%2Fclaim-child-benefit%2F'
          >
            Is this page not working properly? (opens in new tab)
          </a>
        </div>
      </div>
    </div>
  );
}

export default StartPage;
