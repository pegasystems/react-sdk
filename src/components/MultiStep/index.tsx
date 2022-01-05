import React from "react";
import PropTypes from "prop-types";
import './MultiStep.css';

import AssignmentCard from '../AssignmentCard';

// import { useConstellationContext } from "../../bridge/Context/StoreContext";

export default function MultiStep(props) {
    const { getPConnect, children, itemKey, actionButtons, onButtonPress} = props;
    const { bIsVertical, arNavigationSteps } = props;

    // const svgCurrent = Utils.getImageSrc("circle-solid", PCore.getAssetLoader().getStaticServerUrl());
    // const svgNotCurrent = Utils.getImageSrc("circle-solid", PCore.getAssetLoader().getStaticServerUrl());

    function _getVIconClass(status): string {
        if (status === "current") {
          return "psdk-vertical-step-icon-selected";
        }

        return "psdk-vertical-step-icon";
      }

      function _getVLabelClass(status): string {
        if (status === "current") {
          return "psdk-vertical-step-label-selected";
        }

        return "psdk-vertical-step-label";
      }

      function _getVBodyClass(index: number): string {
        if (index < arNavigationSteps.length - 1) {
          return "psdk-vertical-step-body psdk-vertical-step-line";
        }

        return "psdk-vertical-step-body";
      }

      function _getHIconClass(status): string {
        if (status === "current") {
          return "psdk-horizontal-step-icon-selected";
        }

        return "psdk-horizontal-step-icon";
      }

      function _getHLabelClass(status): string {
        if (status === "current") {
          return "psdk-horizontal-step-label-selected";
        }

        return "psdk-horizontal-step-label";
      }

      function _showHLine(index: number): boolean {
        if (index < arNavigationSteps.length - 1) {
          return true;
        }

        return false;
      }

      function buttonPress(sAction: string, sButtonType: string) {
        onButtonPress(sAction, sButtonType);
      }

    return (
      <React.Fragment>
          <div>
              {bIsVertical ?
                <div className="psdk-vertical-stepper">
                    {arNavigationSteps.map((mainStep, index) =>   {
                      return (
                        <React.Fragment key={mainStep.actionID}>
                        <div className="psdk-vertical-step">
                            <div className="psdk-vertical-step-header">
                                <div className={ _getVIconClass(mainStep.visited_status)}>
                                    <div className="psdk-vertical-step-icon-content">
                                        <span>{index + 1}</span>
                                    </div>
                                </div>
                                <div className={ _getVLabelClass(mainStep.visited_status)}>
                                    {mainStep.name}
                                </div>
                            </div>
                            <div className={ _getVBodyClass(index)}>
                                {mainStep?.steps &&
                                <React.Fragment>
                                <ul style={{paddingInlineStart: "0rem", marginLeft: "-7px"}}>
                                    {mainStep.steps.forEach((subStep) => {
                                        <li className="psdk-sub-step-list">
                                        <div style={{display: "inline-flex"}}>
                                            {subStep.visited_status === 'current' &&
                                            <img className="psdk-current-svg-icon" src="{svgCurrent}" />
                                            }
                                            {subStep.visited_status !== 'current' &&
                                            <img className="psdk-not-current-svg-icon" src="{svgNotCurrent}" />
                                            }
                                            {subStep.visited_status === 'current' &&
                                            <label className="psdk-sub-step-current">{subStep.name}</label>
                                            }
                                            {subStep.visited_status !== 'current' &&
                                            <label className="psdk-sub-step-not-current">{subStep.name}</label>
                                            }
                                        </div>
                                        {subStep.visited_status === 'current' &&
                                            <div>
                                                <AssignmentCard getPConnect={getPConnect} itemKey={itemKey} actionButtons={actionButtons} onButtonPress={buttonPress} >
                                                    {children}
                                                </AssignmentCard>
                                            </div>
                                        }


                                        </li>
                                    })}

                                </ul>
                                </React.Fragment>
                                }
                                {!mainStep?.steps && mainStep.visited_status === 'current' &&
                                <AssignmentCard getPConnect={getPConnect} itemKey={itemKey} actionButtons={actionButtons} onButtonPress={buttonPress} >
                                        {children}
                                 </AssignmentCard>
                                }
                            </div>
                        </div>
                        </React.Fragment>
                    )})}
                </div>

              :
                <div className="psdk-horizontal-stepper">
                     <div className="psdk-horizontal-stepper-header-container">
                     {arNavigationSteps.map((mainStep, index) => {
                        return (
                        <React.Fragment key={mainStep.actionID}>
                        <div className="psdk-horizontal-step-header">
                            <div className={ _getHIconClass(mainStep.visited_status)}>
                                <div className="psdk-horizontal-step-icon-content">
                                <span>{index + 1}</span>
                                </div>
                            </div>
                            <div className={ _getHLabelClass(mainStep.visited_status)}>
                                <div className="psdk-horizontal-step-text-label">
                                {mainStep.name}
                                </div>
                            </div>
                        </div>
                        { _showHLine(index) &&
                            <div className="psdk-horizontal-step-line"></div>
                        }
                        </React.Fragment>
                     )})}
                     </div>
                     {arNavigationSteps.map((mainStep) => {
                        return (
                         <React.Fragment key={mainStep.actionID}>
                         {mainStep.steps &&
                            <React.Fragment>
                            <ul style={{paddingInlineStart: "0rem", marginLeft: "35px"}}>
                            {mainStep.steps.map((subStep) => (
                                <React.Fragment>
                                <li className="psdk-sub-step-list">
                                <div style={{display: "inline-flex"}}>
                                    {subStep.visited_status === 'current' &&
                                    <img className="psdk-current-svg-icon" src="{svgCurrent}" />
                                    }
                                    {subStep.visited_status !== 'current' &&
                                    <img className="psdk-not-current-svg-icon" src="{svgNotCurrent}" />
                                    }
                                    {subStep.visited_status === 'current' &&
                                    <label className="psdk-sub-step-current">{subStep.name}</label>
                                    }
                                    {subStep.visited_status !== 'current' &&
                                    <label className="psdk-sub-step-not-current">{subStep.name}</label>
                                    }
                                </div>
                                {subStep.visited_status === 'current' &&
                                <AssignmentCard getPConnect={getPConnect} itemKey={itemKey} actionButtons={actionButtons} onButtonPress={buttonPress} >
                                        {children}
                                 </AssignmentCard>
                                }
                              </li>
                              </React.Fragment>
                            ))}

                          </ul>
                          </React.Fragment>
                        }
                        { !mainStep?.steps && mainStep.visited_status === 'current' &&
                            <AssignmentCard getPConnect={getPConnect} itemKey={itemKey} actionButtons={actionButtons} onButtonPress={buttonPress} >
                                {children}
                            </AssignmentCard>
                        }
                        </React.Fragment>
                     )})}
                </div>
              }

          </div>

      </React.Fragment>

    )
  }

  MultiStep.propTypes = {
    children: PropTypes.node.isRequired,
    getPConnect: PropTypes.func.isRequired,
    itemKey: PropTypes.string,
    actionButtons: PropTypes.object,
    onButtonPress: PropTypes.func,
    bIsVertical: PropTypes.bool,
    // eslint-disable-next-line react/no-unused-prop-types
    arCurrentStepIndicies: PropTypes.array,
    arNavigationSteps: PropTypes.array
  };

  MultiStep.defaultProps = {
    itemKey: null
  };
