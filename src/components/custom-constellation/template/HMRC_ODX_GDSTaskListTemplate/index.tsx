import React from 'react';
import { Grid, Text, SummaryList, Status, withConfiguration } from '@pega/cosmos-react-core';
import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import StyledHmrcOdxGdsTaskListTemplateWrapper from './styles';

interface HmrcOdxGdsTaskListTemplateProps extends PConnProps {
  // If any, enter additional props that only exist on this componentName
  children: Array<any>;
  cssClassHook: string;
  NumCols: string;
}

function HmrcOdxGdsTaskListTemplate(props: HmrcOdxGdsTaskListTemplateProps) {
  const { children, cssClassHook, NumCols, getPConnect } = props;
  const nCols = parseInt(NumCols, 8);
  const context = getPConnect().getContextName();
  const caseInfo = getPConnect().getCaseSummary();
  const data = caseInfo.content.CaseTaskList;

  let totalSections = 0;
  let completedSections = 0;

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
  };

  const itemsToRender = data.map(item => {
    return {
      ...item,
      secondary:
        item.IsTaskInProgress && !item.IsTaskComplete ? (
          <Status className='tl-right_align' variant='pending'>
            {item.TaskStatus}
          </Status>
        ) : (
          <Text className='tl-right_align'>{item.TaskStatus}</Text>
        ),
      visual: item.IsTaskALink ? (
        <a href='#' onClick={() => handleOnClick(`${item.TaskLabel}`)}>
          {item.TaskLabel}
        </a>
      ) : (
        <span>{item.TaskLabel}</span>
      )
    };
  });

  return (
    <StyledHmrcOdxGdsTaskListTemplateWrapper>
      <Grid
        className={`constellation ${cssClassHook}`}
        container={{
          cols: `repeat(${nCols}, minmax(0, 1fr))`,
          gap: 2
        }}
      >
        {children[0]}
      </Grid>
      <div>
        <Text>{completedSections < totalSections ? 'Claim incomplete' : 'Claim complete'}</Text>
        <br />
        <br />
        <Text variant='secondary'>
          {`You have completed ${completedSections} of ${totalSections} sections.`}
        </Text>
        <br />
        <br />
        <SummaryList
          name='Tasks'
          icon='clipboard-check-solid'
          count={totalSections}
          // eslint-disable-next-line no-constant-condition
          items={false ? [] : itemsToRender}
          // loading={}
          noItemsText='No items'
        ></SummaryList>
      </div>
      <Grid
        className='u-hide'
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

export default withConfiguration(HmrcOdxGdsTaskListTemplate);
