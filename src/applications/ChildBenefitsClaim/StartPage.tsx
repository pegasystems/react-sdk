import React from 'react'

const StartPage: React.FC<{onStart: React.MouseEventHandler}> = ({onStart}) => {
  return (
    <div className="govuk-grid-row" id='content'>
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-l">Claim Child Benefit</h1>

        <p className="govuk-body">Use this service to:</p>

        <ul className="govuk-list govuk-list--bullet">
          <li>do something</li>
          <li>update your name, address or other details</li>
          <li>do something else</li>
        </ul>

        <p className="govuk-body">Registering takes around 5 minutes.</p>

        <button type="button" draggable="false" className="govuk-button govuk-!-margin-top-2 govuk-!-margin-bottom-8 govuk-button--start" data-module="govuk-button" onClick={onStart}>
          Start now
          <svg className="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
          </svg></button>

        <h2 className="govuk-heading-m">Before you start</h2>

        <p className="govuk-body">You can also <a className="govuk-link" href="#">register by post</a>.</p>

        <p className="govuk-body">The online service is also available in <a className="govuk-link" href="#">Welsh (Cymraeg)</a>.</p>

        <p className="govuk-body">You cannot register for this service if you’re in the UK illegally.</p>
      </div>

      <div className="govuk-grid-column-one-third">

        <aside className="app-related-items">
          <h2 className="govuk-heading-m" id="subsection-title">
            Subsection
          </h2>
          <nav role="navigation" aria-labelledby="subsection-title">
            <ul className="govuk-list govuk-!-font-size-16">
              <li>
                <a className="govuk-link" href="#">
                  Related link
                </a>
              </li>
              <li>
                <a className="govuk-link" href="#">
                  Related link
                </a>
              </li>
              <li>
                <a href="#" className="govuk-link govuk-!-font-weight-bold">
                  More <span className="govuk-visually-hidden">in Subsection</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

      </div>
    </div>
  )
}

export default StartPage;