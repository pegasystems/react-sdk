import { withConfiguration, Button } from '@pega/cosmos-react-core';
import { useRef, useEffect } from 'react';

import styled, { css } from 'styled-components';

type layoutProps = {
  children: any;
};

export const PegaExtensionsUKGovLayout = (props: layoutProps) => {
  const { children } = props;
  // const { formfields } = children[0].props
  //   .getPConnect()
  //   .getChildren()[0]
  //   .getPConnect()
  //   .getConfigProps();
  const nextRef = useRef<any>(null);
  const prevRef = useRef<any>(null);
  let current = 0;
  const layoutRef = useRef<any>(null);

  const StyledDiv = styled.div(() => {
    return css`
      .ukgov-layout {
        display: 'flex';
        justify-content: 'space-between';
        flex-direction: 'row';
      }
      label,
      legend {
        font-size: 1.6875rem;
        line-height: 1.1111111111;
        margin: 0 0 20px 0;
      }
      button {
        font-family: 'GDS Transport', arial, sans-serif;
        font-weight: 400;
        font-size: 1.1875rem;
        border-radius: 0;
        color: #fff;
        background-color: #00703c;
        box-shadow: 0 2px 0 rgb(0, 44.8, 24);
        text-align: center;
        padding: 8px 10px 7px;
        border: 2px solid rgba(0, 0, 0, 0);
      }
      input[type='text'],
      input[type='radio'] + label > div {
        font-weight: 400;
        font-size: 1.1875rem;
        line-height: 1.25;
        box-sizing: border-box;
        height: 2.5rem;
        padding: 5px;
        border: 2px solid #0b0c0c;
        color: #0b0c0c;
      }
      input[type='radio'] + label > div {
        height: 2.5rem;
        width: 2.5rem;
      }
      input[type='radio'] + label {
        margin: 0 0 10px 0;
      }
    `;
  });

  const handlePreviousClick = () => {
    if (layoutRef.current) {
      const child = layoutRef.current.children;
      current -= 1;
      if (current != 0) {
        nextRef.current.disabled = false;
      } else {
        prevRef.current.disabled = true;
      }
      child[current].style.transition = 'visibility 0s, opacity 0.5s linear';
      child[current + 1].style.display = 'none';
      child[current].style.display = 'block';
    }
  };

  const handleNextClick = () => {
    if (layoutRef.current) {
      const child = layoutRef.current.children;
      current += 1;
      if (current != child.length - 1) {
        prevRef.current.disabled = false;
        prevRef.current.style.display = 'block';
      } else {
        nextRef.current.disabled = true;
        const aiButton = document.querySelector(
          'button[data-testid=":assignment-action-buttons:fill-form-with-ai"]'
        ) as HTMLElement;
        const slButton = document.querySelector(
          'button[data-testid=":assignment-action-buttons:save"]'
        ) as HTMLElement;
        const suButton = document.querySelector(
          'button[data-testid=":assignment-action-buttons:submit"]'
        ) as HTMLElement;
        const cButton = document.querySelector(
          'button[data-testid=":assignment-action-buttons:cancel"]'
        ) as HTMLElement;
        if(aiButton){
        aiButton.style.display = 'block';
      }
        slButton.style.display = 'block';
        suButton.style.display = 'block';
        cButton.style.display = 'block';
      }
      child[current].style.transition = 'opacity 1s ease 0s;';
      child[current - 1].style.display = 'none';
      child[current].style.display = 'block';
    }
  };

  useEffect(() => {
    if (layoutRef.current) {
      const child = layoutRef.current.children;
      if (child.length == 1) {
        nextRef.current.style.display = 'none';
      } else {
        for (let i = 1; i < child.length; i += 1) {
          child[i].style.display = 'none';
        }
        prevRef.current.disabled = false;
        const aiButton = document.querySelector(
          'button[data-testid=":assignment-action-buttons:fill-form-with-ai"]'
        ) as HTMLElement;
        const slButton = document.querySelector(
          'button[data-testid=":assignment-action-buttons:save"]'
        ) as HTMLElement;
        const suButton = document.querySelector(
          'button[data-testid=":assignment-action-buttons:submit"]'
        ) as HTMLElement;
        const cButton = document.querySelector(
          'button[data-testid=":assignment-action-buttons:cancel"]'
        ) as HTMLElement;
        const summaryPanel = document.querySelector(
          'div[data-testid=":summary-item:"]'
        ) as HTMLElement;

        summaryPanel.style.display = 'none';
        if( aiButton) {
        aiButton.style.display = 'none';
        }
        slButton.style.display = 'none';
        suButton.style.display = 'none';
        cButton.style.display = 'none';
      }
      prevRef.current.style.display = 'none';
    }
  }, []);
  // children[0].props.getPConnect().getChildren()[0].getPConnect().getConfigProps()
  return (
    <div>
      <StyledDiv className='ukgov-layout'>
        {children.map((child: any, i: number) => (
          <div style={{ flex: 1, margin: '0 0 24px 0' }} ref={layoutRef} key={`r-${i + 1}`}>
            {child}
          </div>
        ))}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: '8px 0'
          }}
        >
          <Button onClick={handleNextClick} id='next' ref={nextRef}>
            Continue
          </Button>
          <Button onClick={handlePreviousClick} id='previous' ref={prevRef}>
            Previous
          </Button>
        </div>
      </StyledDiv>
      <div className='navigation-layout'></div>
    </div>
  );
};
export default withConfiguration(PegaExtensionsUKGovLayout);
