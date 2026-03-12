import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import OOTBMultiStep from '@pega/react-sdk-components/lib/components/infra/MultiStep';

interface MultiStepProps {
  getPConnect?: () => typeof PConnect;
  children?: any;
  itemKey?: string;
  actionButtons?: any;
  onButtonPress?: (sAction: string, sButtonType: string) => void;
  bIsVertical?: boolean;
  arNavigationSteps?: any[];
}

function getStepStateClass(status: string) {
  if (status === 'current') return 'mc-multi-step-icon-current';
  if (status === 'success') return 'mc-multi-step-icon-success';
  return 'mc-multi-step-icon-future';
}

function getLabelStateClass(status: string) {
  return status === 'future' ? 'mc-multi-step-label-future' : 'mc-multi-step-label-active';
}

function getLineStateClass(status: string) {
  return status === 'success' ? 'mc-multi-step-line-success' : 'mc-multi-step-line-default';
}

export default function MultiStep(props: MultiStepProps) {
  // Delegate to OOTB MultiStep when not on the WSS portal
  const isWssPortal = (PCore.getEnvironmentInfo() as any).environmentInfoObject?.pyPortalTemplate === 'wss';
  if (!isWssPortal) {
    return <OOTBMultiStep {...(props as any)} />;
  }

  const { getPConnect, children, itemKey = '', actionButtons, onButtonPress, bIsVertical = false, arNavigationSteps = [] } = props;

  // Get AssignmentCard from the component map (same as OOTB)
  const AssignmentCard = getComponentFromMap('AssignmentCard');

  function buttonPress(sAction: string, sButtonType: string) {
    if (onButtonPress) onButtonPress(sAction, sButtonType);
  }

  const getHIconContent = (status: string, index: number) => {
    if (status === 'success') return <span className='mc-multi-step-icon-check'>{'\u2713'}</span>;
    return <span className={status === 'current' ? 'mc-multi-step-icon-index-current' : 'mc-multi-step-icon-index-default'}>{index + 1}</span>;
  };

  if (bIsVertical) {
    return (
      <Box className='mc-multi-step-vertical'>
        {arNavigationSteps.map((mainStep, i) => (
          <Box key={i} className='mc-multi-step-vertical-step'>
            <Box className='mc-multi-step-vertical-header'>
              <Box className={`mc-multi-step-icon mc-multi-step-icon-small ${getStepStateClass(mainStep.visited_status)}`}>
                <Box className='mc-multi-step-icon-content'>{getHIconContent(mainStep.visited_status, i)}</Box>
              </Box>
              <Typography className='mc-multi-step-vertical-title'>{mainStep.name}</Typography>
            </Box>
            <Box
              className={`mc-multi-step-vertical-body ${
                i < arNavigationSteps.length - 1 ? 'mc-multi-step-vertical-body-with-line' : 'mc-multi-step-vertical-body-last'
              }`}
            >
              {mainStep.visited_status === 'current' && (
                <Box className='mc-multi-step-vertical-assignment'>
                  <AssignmentCard getPConnect={getPConnect} itemKey={itemKey} actionButtons={actionButtons} onButtonPress={buttonPress}>
                    {children}
                  </AssignmentCard>
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  // Horizontal stepper
  return (
    <Box className='mc-multi-step-horizontal'>
      <Box className='mc-multi-step-horizontal-track'>
        {arNavigationSteps.map((mainStep, i) => (
          <Box key={i} className='mc-multi-step-horizontal-segment'>
            <Box className='mc-multi-step-horizontal-step'>
              <Box className={`mc-multi-step-icon mc-multi-step-icon-large ${getStepStateClass(mainStep.visited_status)}`}>
                {getHIconContent(mainStep.visited_status, i)}
              </Box>
              <Typography className={`mc-multi-step-horizontal-label ${getLabelStateClass(mainStep.visited_status)}`}>{mainStep.name}</Typography>
            </Box>
            {i < arNavigationSteps.length - 1 && <Box className={`mc-multi-step-horizontal-line ${getLineStateClass(mainStep.visited_status)}`} />}
          </Box>
        ))}
      </Box>

      {arNavigationSteps.map((mainStep, i) => {
        if (mainStep.visited_status !== 'current') return null;
        return (
          <Box key={i} className='mc-multi-step-horizontal-assignment'>
            <AssignmentCard getPConnect={getPConnect} itemKey={itemKey} actionButtons={actionButtons} onButtonPress={buttonPress}>
              {children}
            </AssignmentCard>
          </Box>
        );
      })}
    </Box>
  );
}
