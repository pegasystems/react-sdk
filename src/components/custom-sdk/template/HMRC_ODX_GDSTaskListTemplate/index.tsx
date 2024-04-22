import React, { Fragment, useEffect } from 'react';
import { Grid } from '@pega/cosmos-react-core';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const context = getPConnect().getContextName();
  const caseInfo = getPConnect().getCaseSummary();
  const caseTaskListData = caseInfo.content.CaseTaskList;
  const caseType = caseInfo.content.CaseType;

  let totalSections = 0;
  let completedSections = 0;

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('tasklistData', JSON.stringify(caseTaskListData));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    sessionStorage.removeItem('isTasklistClicked');
  }, []);

  let cssHooks = '';
  if (caseType === 'Auth') {
    cssHooks = 'auth';
  } else {
    cssHooks = 'unauth';
  }
  let data;
  if (sessionStorage.getItem('isTasklistClicked') === 'true') {
    data = caseTaskListData;
  } else {
    data = JSON.parse(sessionStorage.getItem('tasklistData')) || caseTaskListData;
  }

  // Loop through the data to determine the number of sections in total and how many are flagged as complete.
  data.forEach(task => {
    totalSections += 1;
    if (task.IsTaskComplete) {
      completedSections += 1;
    }
  });

  const handleOnClick = (section: string) => {
    getPConnect().setValue('.SelectedTask', section, '', false);
    getPConnect().getActionsApi().finishAssignment(context);
    PCore.getPubSubUtils().publish('assignmentFinishedOnTaskListClicked', {});
    sessionStorage.setItem('isTasklistClicked', 'true');
  };

  const labelStatusMapping = status => {
    switch (status) {
      case 'Not yet started':
        return t('NOT_YET_STARTED');
      case 'Cannot start yet':
        return t('CANNOT_START_YET');
      case 'In progress':
        return t('IN_PROGRESS');
      case 'Completed':
        return t('COMPLETED');
      case 'Your details':
        return t('YOUR_DETAILS');
      case 'Relationship details':
        return t('RELATIONSHIP_DETAILS');
      case 'Child details':
        return t('CHILD_DETAILS');
      case 'Income details':
        return t('INCOME_DETAILS');
      default:
        return status;
    }
  };

  return (
    <StyledHmrcOdxGdsTaskListTemplateWrapper>
      <Grid
        className={`govuk-!-padding-bottom-4 ${cssClassHook} ${cssHooks}`}
        container={{
          cols: `repeat(${nCols}, minmax(0, 1fr))`,
          gap: 2
        }}
      >
        {children[0]}
      </Grid>
      <div className='govuk-!-padding-bottom-4'>
        <p className='govuk-body govuk-!-font-weight-bold'>
          {completedSections < totalSections
            ? `${t('CLAIM')} ${t('INCOMPLETE')}`
            : `${t('CLAIM')} ${t('COMPLETE')}`}
        </p>
        <p className='govuk-body govuk-!-padding-bottom-4'>
          {`${t('YOU_HAVE_COMPLETED')} ${completedSections} ${t('OF')} ${totalSections} ${t(
            'SECTIONS'
          )}`}
          .
        </p>
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
                          {labelStatusMapping(task.TaskLabel)}
                        </a>
                      ) : (
                        <span>{labelStatusMapping(task.TaskLabel)}</span>
                      )}
                    </div>
                    {!task.IsTaskALink && !task.IsTaskInProgress && !task.IsTaskComplete && (
                      // cannot start
                      <div
                        className='govuk-task-list__status govuk-task-list__status--cannot-start-yet'
                        id={`${task.TaskLabel.replaceAll(' ', '')}-${key}-status`}
                      >
                        {labelStatusMapping(task.TaskStatus)}
                      </div>
                    )}

                    {task.IsTaskALink &&
                      !task.IsTaskInProgress &&
                      !task.IsTaskComplete && ( // to begin
                        <div
                          className='govuk-task-list__status'
                          id={`${task.TaskLabel.replaceAll(' ', '')}-${key}-status`}
                        >
                          <strong className='govuk-tag govuk-tag--blue'>{labelStatusMapping(task.TaskStatus)}</strong>
                        </div>
                      )}

                    {task.IsTaskALink &&
                      task.IsTaskInProgress &&
                      !task.IsTaskComplete && ( // in progress
                        <div
                          className='govuk-task-list__status'
                          id={`${task.TaskLabel.replaceAll(' ', '')}-${key}-status`}
                        >
                          <strong className='govuk-tag govuk-tag--light-blue'>
                            {labelStatusMapping(task.TaskStatus)}
                          </strong>
                        </div>
                      )}

                    {task.IsTaskALink &&
                      task.IsTaskInProgress &&
                      task.IsTaskComplete && ( // complete
                        <div
                          className='govuk-task-list__status'
                          id={`${task.TaskLabel.replaceAll(' ', '')}-${key}-status`}
                        >
                          <span>{labelStatusMapping(task.TaskStatus)}</span>
                        </div>
                      )}
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
