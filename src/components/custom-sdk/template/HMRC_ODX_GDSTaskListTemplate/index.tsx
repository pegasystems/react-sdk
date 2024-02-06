import React, { Fragment } from 'react';
import { Grid } from '@pega/cosmos-react-core';
import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import StyledHmrcOdxGdsTaskListTemplateWrapper from './styles';
import './TaskListTemplate.css';

interface HmrcOdxGdsTaskListTemplateProps extends PConnProps {
  // If any, enter additional props that only exist on this componentName
  children: Array<any>;
  cssClassHook: string;
  NumCols: string;
}

export default function HmrcOdxGdsTaskListTemplate(props: HmrcOdxGdsTaskListTemplateProps) {
  const { children, cssClassHook, NumCols, getPConnect } = props;
  const nCols = parseInt(NumCols, 8);

  const context = getPConnect().getContextName();
  const caseInfo = getPConnect().getCaseSummary();
  const data = caseInfo.content.CaseTaskList;

  const handleOnClick = (section: string) => {
    getPConnect().setValue('.SelectedTask', section, '', false);
    getPConnect().getActionsApi().finishAssignment(context);
  };

  return (
    <StyledHmrcOdxGdsTaskListTemplateWrapper>
      <Grid
        className={`govuk-!-padding-bottom-4 ${cssClassHook}`}
        container={{
          cols: `repeat(${nCols}, minmax(0, 1fr))`,
          gap: 2
        }}
      >
        {children[0]}
      </Grid>
      <div className='govuk-!-padding-bottom-4'>
        <ul className='govuk-task-list'>
          {data &&
            data.map((task, index) => {
              const key = new Date().getTime() + index;
              return (
                <Fragment key={key}>
                  <li className='govuk-task-list__item govuk-task-list__item--with-link'>
                    <div className='govuk-task-list__name-and-hint'>
                      {task.IsTaskALink ? (
                        <a
                          className='govuk-link govuk-task-list__link'
                          href='#'
                          aria-describedby={`${task.TaskLabel.replaceAll(' ', '')}-${key}-status`}
                          onClick={() => handleOnClick(`${task.TaskLabel}`)}
                        >
                          {task.TaskLabel}
                        </a>
                      ) : (
                        <span>{task.TaskLabel}</span>
                      )}
                    </div>
                    <div
                      className='govuk-task-list__status'
                      id={`${task.TaskLabel.replaceAll(' ', '')}-${key}-status`}
                    >
                      {task.IsTaskInProgress ? (
                        <strong className='govuk-tag govuk-tag--blue'>{task.TaskStatus}</strong>
                      ) : (
                        task.TaskStatus
                      )}
                    </div>
                  </li>
                </Fragment>
              );
            })}
        </ul>
      </div>
      <Grid
        className='govuk-!-display-none'
        container={{
          cols: `repeat(${nCols}, minmax(0, 1fr))`,
          gap: 2
        }}
      >
        {children[1]}
      </Grid>
    </StyledHmrcOdxGdsTaskListTemplateWrapper>
  );
}
