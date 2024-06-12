import React, { useRef, useEffect } from 'react';
import { getInstructions } from './utils';
import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

import './DefaultForm.css';

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
      if (elem.tagName === 'H1' || elem.tagName === 'H2' || elem.tagName === 'H3') {
        if (openDL) {
          fragment.appendChild(currentDL);
          fragment.appendChild(elem.cloneNode(true));
          openDL = false;
        } else {
          fragment.appendChild(elem.cloneNode(true));
        }
      } else if (elem.tagName === 'DIV') {
        const isCsV = (elem.children[1] as HTMLElement).dataset.isCsv;
        if (isCsV === 'true') {
          const csvItems = (elem as HTMLElement).children[1].textContent.split(',');
          (elem as HTMLElement).children[1].innerHTML = '';
          csvItems.forEach(item => {
            const textNode = document.createTextNode(item.trim());
            (elem as HTMLElement).children[1].appendChild(textNode);
            (elem as HTMLElement).children[1].appendChild(document.createElement('br'));
          });
        }
        if (!openDL) {
          openDL = true;
          currentDL = document.createElement('dl');
          //  currentDL.className = 'govuk-summary-list govuk-!-margin-bottom-9';
          currentDL.className = 'govuk-summary-list';
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

    if (dfChildrenContainerRef.current) {
      // Clear existing content
      dfChildrenContainerRef.current.innerHTML = '';
      // Append the new content
      dfChildrenContainerRef.current.appendChild(fragment);
    }
  }
  let hasAutocompleteLoaded = window.sessionStorage.getItem('hasAutocompleteLoaded');

  const checkChildren = () => {
    const container = dfChildrenContainerRef.current;
    const summaryListElement = container?.querySelector('.govuk-summary-list');

    if (summaryListElement) {
      let htmlContent = '';
      Array.from(container.children).forEach(child => {
        if (child instanceof HTMLElement) {
          if (child.tagName === 'H2' || child.tagName === 'H3') {
            htmlContent += child.outerHTML;
          } else {
            htmlContent += child.innerHTML;
          }
        }
      });

      updateHTML(htmlContent);
    } else {
      // Retry until a child with the class "govuk-summary-list" is rendered
      requestAnimationFrame(checkChildren);
    }
  };

  function CYARendering() {
    if (dfChildrenContainerRef.current) {
      // moving this code outside in a function and calling it in useEffect

      // const checkChildren = () => {
      //   const container = dfChildrenContainerRef.current;
      //   const summaryListElement = container?.querySelector('.govuk-summary-list');

      //   if (summaryListElement) {
      //     let htmlContent = '';
      //     Array.from(container.children).forEach(child => {
      //       if (child instanceof HTMLElement) {
      //         htmlContent += child.innerHTML;
      //       }
      //     });

      //     updateHTML(htmlContent);
      //   } else {
      //     // Retry until a child with the class "govuk-summary-list" is rendered
      //     requestAnimationFrame(checkChildren);
      //   }
      // };
      hasAutocompleteLoaded = window.sessionStorage.getItem('hasAutocompleteLoaded');
      if (hasAutocompleteLoaded === 'true') {
        window.sessionStorage.setItem('hasAutocompleteLoaded', 'false');
        PCore.getPubSubUtils().subscribe(
          'rerenderCYA',
          () => {
            window.sessionStorage.setItem('hasAutocompleteLoaded', 'false');
            checkChildren();
            PCore?.getPubSubUtils().unsubscribe('rerenderCYA', '');
          },
          'rerenderCYA'
        );
      } else {
        setTimeout(() => {
          checkChildren();
        }, 2000);
      }
    }
  }
  useEffect(() => {
    CYARendering();

    setTimeout(() => {
      checkChildren();
    }, 2000);
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
