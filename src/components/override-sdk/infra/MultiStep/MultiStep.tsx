import React, { PropsWithChildren } from 'react';

import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

import './MultiStep.css';

interface MultiStepProps extends PConnProps {
  // If any, enter additional props that only exist on this component
  itemKey: string;
  actionButtons: any[];
  onButtonPress: any;
  bIsVertical: boolean;
  arNavigationSteps: any[];
}

export default function MultiStep(props: PropsWithChildren<MultiStepProps>) {
  // Get emitted components from map (so we can get any override that may exist)
  const AssignmentCard = getComponentFromMap('AssignmentCard');

  const { getPConnect, children, itemKey = '', actionButtons, onButtonPress } = props;
  const { bIsVertical, arNavigationSteps } = props;

  // const svgCurrent = Utils.getImageSrc("circle-solid", Utils.getSDKStaticConentUrl());
  // const svgNotCurrent = Utils.getImageSrc("circle-solid", Utils.getSDKStaticConentUrl());

  function _getVIconClass(status): string {
    if (status === 'current') {
      return 'psdk-vertical-step-icon-selected';
    }

    return 'psdk-vertical-step-icon';
  }

  function _getVLabelClass(status): string {
    if (status === 'current') {
      return 'psdk-vertical-step-label-selected';
    }

    return 'psdk-vertical-step-label';
  }

  function _getVBodyClass(index: number): string {
    if (index < arNavigationSteps.length - 1) {
      return 'psdk-vertical-step-body psdk-vertical-step-line';
    }

    return 'psdk-vertical-step-body';
  }

  function _getHIconClass(status): string {
    if (status === 'current') {
      return 'psdk-horizontal-step-icon-selected';
    }

    return 'psdk-horizontal-step-icon';
  }

  function _getHLabelClass(status): string {
    if (status === 'current') {
      return 'psdk-horizontal-step-label-selected';
    }

    return 'psdk-horizontal-step-label';
  }

  function _showHLine(index: number): boolean {
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (index < arNavigationSteps.length - 1) {
      return true;
    }

    return false;
  }

  function buttonPress(sAction: string, sButtonType: string) {
    onButtonPress(sAction, sButtonType);
  }

  return (
    <div>
      {bIsVertical ? (
        <div className='psdk-vertical-stepper'>
          {arNavigationSteps.map((mainStep, index) => {
            return (
              <React.Fragment key={mainStep.actionID}>
                <div className='psdk-vertical-step'>
                  <div className='psdk-vertical-step-header'>
                    <div className={_getVIconClass(mainStep.visited_status)}>
                      <div className='psdk-vertical-step-icon-content'>
                        <span>{index + 1}</span>
                      </div>
                    </div>
                    <div className={_getVLabelClass(mainStep.visited_status)}>{mainStep.name}</div>
                  </div>
                  <div className={_getVBodyClass(index)} style={{ paddingLeft: '40px' }}>
                    {mainStep?.steps && (
                      <ul
                        style={{
                          paddingInlineStart: '0rem',
                          marginLeft: '-7px'
                        }}
                      >
                        {mainStep.steps.forEach(subStep => {
                          <li className='psdk-sub-step-list'>
                            <div style={{ display: 'inline-flex' }}>
                              {subStep.visited_status === 'current' && <img className='psdk-current-svg-icon' src='{svgCurrent}' />}
                              {subStep.visited_status !== 'current' && <img className='psdk-not-current-svg-icon' src='{svgNotCurrent}' />}
                              {subStep.visited_status === 'current' && <label className='psdk-sub-step-current'>{subStep.name}</label>}
                              {subStep.visited_status !== 'current' && <label className='psdk-sub-step-not-current'>{subStep.name}</label>}
                            </div>
                            {subStep.visited_status === 'current' && (
                              <div>
                                <AssignmentCard
                                  getPConnect={getPConnect}
                                  itemKey={itemKey}
                                  actionButtons={actionButtons}
                                  onButtonPress={buttonPress}
                                  style={{ paddingLeft: '35px' }}
                                >
                                  {children}
                                </AssignmentCard>
                              </div>
                            )}
                          </li>;
                        })}
                      </ul>
                    )}
                    {!mainStep?.steps && mainStep.visited_status === 'current' && (
                      <AssignmentCard getPConnect={getPConnect} itemKey={itemKey} actionButtons={actionButtons} onButtonPress={buttonPress}>
                        {children}
                      </AssignmentCard>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        <div className='psdk-horizontal-stepper'>
          {/* <div className='psdk-horizontal-stepper-header-container'>
            {arNavigationSteps.map((mainStep, index) => {
              return (
                <React.Fragment key={mainStep.actionID}>
                  <div className='psdk-horizontal-step-header'>
                    <div className={_getHIconClass(mainStep.visited_status)}>
                      <div className='psdk-horizontal-step-icon-content'>
                        <span>{index + 1}</span>
                      </div>
                    </div>
                    <div className={_getHLabelClass(mainStep.visited_status)}>
                      <div className='psdk-horizontal-step-text-label'>{mainStep.name}</div>
                    </div>
                  </div>
                  {_showHLine(index) && <div className='psdk-horizontal-step-line' />}
                </React.Fragment>
              );
            })}
          </div> */}
          {arNavigationSteps.map(mainStep => {
            return (
              <React.Fragment key={mainStep.actionID}>
                {mainStep.steps && (
                  <ul style={{ paddingInlineStart: '0rem', marginLeft: '35px' }}>
                    {mainStep.steps.map(subStep => (
                      <li className='psdk-sub-step-list'>
                        <div style={{ display: 'inline-flex' }}>
                          {subStep.visited_status === 'current' && <img className='psdk-current-svg-icon' src='{svgCurrent}' />}
                          {subStep.visited_status !== 'current' && <img className='psdk-not-current-svg-icon' src='{svgNotCurrent}' />}
                          {subStep.visited_status === 'current' && <label className='psdk-sub-step-current'>{subStep.name}</label>}
                          {subStep.visited_status !== 'current' && <label className='psdk-sub-step-not-current'>{subStep.name}</label>}
                        </div>
                        {subStep.visited_status === 'current' && (
                          <AssignmentCard getPConnect={getPConnect} itemKey={itemKey} actionButtons={actionButtons} onButtonPress={buttonPress}>
                            {children}
                          </AssignmentCard>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {!mainStep?.steps && mainStep.visited_status === 'current' && (
                  <AssignmentCard getPConnect={getPConnect} itemKey={itemKey} actionButtons={actionButtons} onButtonPress={buttonPress}>
                    {children}
                  </AssignmentCard>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
