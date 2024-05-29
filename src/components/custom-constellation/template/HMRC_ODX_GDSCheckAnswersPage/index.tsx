import React, { useRef, useEffect } from 'react';
import { getInstructions } from './utils';
import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

import StyledHmrcOdxGdsCheckAnswersPageWrapper from './styles';

interface HmrcOdxGdsCheckAnswersPageProps extends PConnProps {
  // If any, enter additional props that only exist on this componentName
  NumCols?: string;
  instructions?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  children: Array<any>;
}

export default function HmrcOdxGdsCheckAnswersPage(props: HmrcOdxGdsCheckAnswersPageProps) {
  // template structure setup
  const { getPConnect, NumCols = '1' } = props;
  const instructions = getInstructions(getPConnect(), props.instructions);

  let divClass: string;

  const numCols = NumCols || '1';
  switch (numCols) {
    case '1':
      divClass = 'psdk-default-form-one-column';
      break;
    case '2':
      divClass = 'psdk-default-form-two-column';
      break;
    case '3':
      divClass = 'psdk-default-form-three-column';
      break;
    default:
      divClass = 'psdk-default-form-one-column';
      break;
  }

  const arChildren = getPConnect().getChildren()[0].getPConnect().getChildren();
  const dfChildren = arChildren.map((kid, idx) => {
    kid.key = idx;
    // @ts-ignore
    return getPConnect().createComponent(kid.getPConnect().getRawMetadata());
  });

  // Create a ref to the mainer rendering container
  const dfChildrenContainerRef = useRef(null);

  // function getSummaryListRows(htmlString) {
  //   const parser = new DOMParser();
  //   const doc = parser.parseFromString(htmlString, 'text/html');
  //   const summaryListRows = doc.querySelectorAll('div.govuk-summary-list__row, h2');
  //   return Array.from(summaryListRows);
  // }

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const containerItemID = pConn.getContextName();

  function navigateToStep(event, stepId) {
    event.preventDefault();
    // eslint-disable-next-line no-console
    console.log('navigation', stepId);
    const navigateToStepPromise = actions.navigateToStep(stepId, containerItemID);

    navigateToStepPromise
      .then(() => {
        //  navigate to step success handling
        console.log('navigation successful'); // eslint-disable-line
      })
      .catch(error => {
        // navigate to step failure handling
        // eslint-disable-next-line no-console
        console.log('Change link Navigation failed', error);
      });
  }

  function updateHTML(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const summaryListRows = doc.querySelectorAll('div.govuk-summary-list__row, h2');

    const fragment = document.createDocumentFragment();
    let openDL = false;
    let currentDL;

    summaryListRows.forEach(elem => {
      if (elem.tagName === 'H2') {
        if (openDL) {
          fragment.appendChild(currentDL);
          fragment.appendChild(elem.cloneNode(true));
          openDL = false;
        } else {
          fragment.appendChild(elem.cloneNode(true));
        }
      } else if (elem.tagName === 'DIV') {
        if (!openDL) {
          openDL = true;
          currentDL = document.createElement('dl');
          currentDL.className = 'govuk-summary-list govuk-!-margin-bottom-9';
          currentDL.appendChild(elem.cloneNode(true));
        } else {
          currentDL.appendChild(elem.cloneNode(true));
        }
      }
    });

    if (openDL) {
      fragment.appendChild(currentDL);
    }

    // Manually copy onClick handlers from React components to their clones
    // const originalLinks = Array.from(summaryListRows);
    fragment.querySelectorAll('a').forEach(cloneLink => {
      const originalLink = cloneLink;
      if (originalLink) {
        const stepId = originalLink.getAttribute('data-step-id');
        cloneLink.addEventListener('click', event => navigateToStep(event, stepId));
      }
    });

    // ONLY UPDATE THIS WHEN THE HTML IS CORRECT OTHER USERS WILL SEE NOTHING.
    if (dfChildrenContainerRef.current) {
      // Clear existing content
      // @ts-ignore
      // dfChildrenContainerRef.current.innerHTML = '';
      // Append the new content
      // @ts-ignore
      // dfChildrenContainerRef.current.appendChild(fragment);
    }
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      // Access the DOM elements through the ref
      if (dfChildrenContainerRef.current && dfChildren && dfChildren.length > 0) {
        // Access the children of the container
        // @ts-ignore
        const children = dfChildrenContainerRef.current.children;
        // Check if children contain the expected content
        if (children && children.length > 0) {
          // Extract HTML content from the first child
          // const htmlContent = children[0].innerHTML;
          let htmlContent = '';
          Array.from(children).forEach((child: unknown) => {
            htmlContent += (child as HTMLElement).innerHTML;
          });

          updateHTML(htmlContent);
        }
      }
    }, 0);

    return () => clearTimeout(timerId); // Cleanup the timer
  }, [dfChildren]);

  return (
    <StyledHmrcOdxGdsCheckAnswersPageWrapper>
      <>
        {instructions && (
          <div className='psdk-default-form-instruction-text'>
            {/* server performs sanitization method for instructions html content */}
            {/* eslint-disable react/no-danger */}
            <div key='instructions' dangerouslySetInnerHTML={{ __html: instructions }} />
          </div>
        )}
        <div ref={dfChildrenContainerRef} className={divClass}>
          <div className='govuk-visually-hidden'>{dfChildren}</div>
        </div>
      </>
    </StyledHmrcOdxGdsCheckAnswersPageWrapper>
  );
}
