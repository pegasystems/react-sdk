import React, { useState, Fragment, useEffect } from 'react';
import { Grid, GridSize } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

import StyledHmrcOdxGdsTaskListTemplateWrapper from './styles';
import './TaskListTemplate.css';

interface HmrcOdxGdsTaskListTemplateProps extends PConnProps {
  // If any, enter additional props that only exist on this componentName
  children: Array<any>;
  templateCol: string;
  taskList: {};
  cssClassHook: string;
}

const useStyles = makeStyles(() => ({
  colStyles: {
    display: 'grid',
    gap: '1rem',
    alignContent: 'baseline'
  }
}));

// Duplicated runtime code from React SDK

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxGdsTaskListTemplate(props: HmrcOdxGdsTaskListTemplateProps) {
  const classes = useStyles();

  const { children, templateCol = '1fr', cssClassHook } = props;

  if (children.length !== 2) {
    // eslint-disable-next-line no-console
    console.error(`TwoColumn template sees more than 2 columns: ${children.length}`);
  }

  // Calculate the size
  //  Default to assume the 2 columns are evenly split. However, override if templateCol
  //  (example value: "1fr 1fr")
  let aSize: GridSize = 6;
  let bSize: GridSize = 6;

  const colAArray = templateCol
    // @ts-ignore
    .replaceAll(/[a-z]+/g, '')
    .split(/\s/)
    .map(itm => Number(itm));
  const totalCols = colAArray.reduce((v, itm) => itm + v, 0);
  const ratio = 12 / totalCols;
  aSize = (ratio * colAArray[0]) as GridSize;
  bSize = (ratio * colAArray[1]) as GridSize;

  // eslint-disable-next-line prefer-const
  let { taskList, getPConnect } = props;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const context = getPConnect().getContextName();
  const caseInfo = getPConnect().getCaseSummary();
  const caseID = caseInfo.content.pyID;

  const params = {
    caseID
  };

  useEffect(() => {
    const fetchTaskList = async () => {
      try {
        // @ts-ignore
        const response = await PCore.getDataPageUtils().getDataAsync(
          'D_CaseTaskList',
          context
          // params
        ); // TODO make configurable.

        // @ts-ignore
        // eslint-disable-next-line prefer-template, no-console
        // console.log('DATA: ' + response.data);

        // @ts-ignore
        taskList = await response.data;

        // if (Array.isArray(taskList)) {
        //   globalTaskList = globalTaskList.concat(taskList);
        // } else {
        //   globalTaskList.push(taskList);
        // }

        setData(taskList);
      } catch (error) {
        // Handle error
        return []; // or throw error based on your requirement
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    // Example of how to use the async function
    fetchTaskList();
  }, []);

  const handleOnClick = (section: string) => {
    getPConnect().setValue('.SelectedTask', section, '', false);
    getPConnect().getActionsApi().finishAssignment(context);
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  // if (!data.caseInfo) {
  //   return <p>No data</p>;
  // }
  return (
    <StyledHmrcOdxGdsTaskListTemplateWrapper>
      <Grid container spacing={1} className={`govuk-!-padding-bottom-8 ${cssClassHook}`}>
        <Grid item xs={12} md={aSize} className={classes.colStyles}>
          {children[0]}
        </Grid>
      </Grid>
      <div className='govuk-!-padding-bottom-4'>
        <ul className='govuk-task-list'>
          {data &&
            data.map((task, index) => {
              const key = new Date().getTime() + index;

              // eslint-disable-next-line no-console
              console.log(data);

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

                          {/* { 
                        TODO
                        Update property - text - selectedTask configurable?
                        Submit assignment} */}
                        </a>
                      ) : (
                        <span>{task.TaskLabel}</span>
                      )}
                    </div>
                    <div
                      className='govuk-task-list__status'
                      id={`${task.TaskLabel.replaceAll(' ', '')}-${key}-status`}
                    >
                      {task.TaskStatus.toLowerCase() === 'in progress' ? (
                        <strong className='govuk-tag govuk-tag--blue'>{task.TaskStatus}</strong>
                      ) : (
                        task.TaskStatus
                      )}
                      {/* <strong class="govuk-tag govuk-tag--blue"></strong>
                    {task.TaskStatus} */}
                    </div>
                  </li>
                </Fragment>
              );
            })}
        </ul>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={12} md={bSize} className={classes.colStyles}>
          {children[1]}
        </Grid>
      </Grid>
    </StyledHmrcOdxGdsTaskListTemplateWrapper>
  );
}
