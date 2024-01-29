import React, { useState, Fragment, useEffect } from 'react';
import { Grid, GridSize } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

import StyledHmrcOdxGdsTaskListTemplateWrapper from './styles';

interface HmrcOdxGdsTaskListTemplateProps extends PConnProps {
  // If any, enter additional props that only exist on this componentName
  children: Array<any>;
  templateCol: string;
  taskList: {};
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

  const { children, templateCol = '1fr' } = props;

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

  let globalTaskList = [];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const context = getPConnect().getContextName();

    const fetchTaskList = async () => {
      try {
        // @ts-ignore
        const response = await PCore.getDataPageUtils().getDataAsync('D_CaseTaskList', context); // TODO make configurable.
        // @ts-ignore
        taskList = response.data;

        if (Array.isArray(taskList)) {
          globalTaskList = globalTaskList.concat(taskList);
        } else {
          globalTaskList.push(taskList);
        }

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
  if (loading) {
    return <p>Loading...</p>;
  }
  if (!data) {
    return <p>No data</p>;
  }
  return (
    <StyledHmrcOdxGdsTaskListTemplateWrapper>
      <Grid container spacing={1} className='govuk-!-padding-bottom-8'>
        <Grid item xs={12} md={aSize} className={classes.colStyles}>
          {children[0]}
        </Grid>
      </Grid>
      <div className='govuk-grid-column-two-thirds govuk-!-padding-bottom-4'>
        <ul className='govuk-task-list'>
          {data.caseInfo.content.CaseTasks.CaseTaskList.map((task, index) => {
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
                    {task.TaskStatus === 'In progress' ? (
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
