import React, { useState, Fragment, useEffect } from 'react';

import StyledHmrcOdxGdsTaskListWrapper from './styles';
import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import PropTypes from 'prop-types';

interface HmrcOdxGdsTaskListProps extends PConnProps {
  taskList: {};
}

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxGdsTaskList(props: HmrcOdxGdsTaskListProps) {
  const { taskList, getPConnect } = props;

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
  return (
    <StyledHmrcOdxGdsTaskListWrapper>
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
    </StyledHmrcOdxGdsTaskListWrapper>
  );
}

HmrcOdxGdsTaskList.propTypes = {
  taskList: PropTypes.instanceOf(Object),
  getPConnect: PropTypes.func.isRequired
};
