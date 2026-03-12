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

export default function MultiStep(props: MultiStepProps) {
  // Delegate to OOTB MultiStep when not on the WSS portal
  const isWssPortal = (PCore.getEnvironmentInfo() as any).environmentInfoObject?.pyPortalTemplate === 'wss';
  if (!isWssPortal) {
    return <OOTBMultiStep {...props as any} />;
  }

  const { getPConnect, children, itemKey = '', actionButtons, onButtonPress, bIsVertical = false, arNavigationSteps = [] } = props;

  // Get AssignmentCard from the component map (same as OOTB)
  const AssignmentCard = getComponentFromMap('AssignmentCard');

  function buttonPress(sAction: string, sButtonType: string) {
    if (onButtonPress) onButtonPress(sAction, sButtonType);
  }

  // Find the current active step
  let currentStep = arNavigationSteps.find(({ visited_status: vs }: any) => vs === 'current');
  if (!currentStep) {
    let lastActiveStepIndex = -1;
    for (let i = arNavigationSteps.length - 1; i >= 0; i--) {
      if (arNavigationSteps[i].visited_status === 'success') {
        lastActiveStepIndex = i;
        break;
      }
    }
    currentStep = arNavigationSteps[lastActiveStepIndex >= 0 ? lastActiveStepIndex : 0];
  }
  const getHIconSx = (status: string) => {
    if (status === 'current')
      return {
        backgroundColor: '#5a3a9b',
        border: '1px solid #5a3a9b',
        animation: 'pulse 2s infinite cubic-bezier(0.66,0,0,1)',
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(106,27,154,0.7)' },
          '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(106,27,154,0)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(106,27,154,0)' }
        }
      };
    if (status === 'success') return { backgroundColor: '#5a3a9b', border: '1px solid #5a3a9b' };
    return { backgroundColor: '#e6e0e9', border: '1px solid #e6e0e9' };
  };

  const getHIconContent = (status: string, index: number) => {
    if (status === 'success') return <span style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>✓</span>;
    return <span style={{ color: status === 'current' ? '#fff' : '#49454f', fontSize: 16, fontWeight: 500 }}>{index + 1}</span>;
  };

  const getHLabelColor = (status: string) => (status === 'future' ? '#49454f' : '#333');
  const getLineBg = (status: string) => (status === 'success' ? '#5a3a9b' : '#e0e0e0');

  if (bIsVertical) {
    return (
      <Box sx={{ backgroundColor: 'transparent', display: 'block', textAlign: 'left' }}>
        {arNavigationSteps.map((mainStep, i) => (
          <Box key={i} sx={{ display: 'block' }}>
            <Box sx={{ overflow: 'hidden', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', height: 24, p: '24px' }}>
              <Box
                sx={{
                  mr: '12px',
                  borderRadius: '50%',
                  height: 24,
                  width: 24,
                  flexShrink: 0,
                  position: 'relative',
                  ...getHIconSx(mainStep.visited_status)
                }}
              >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                  {getHIconContent(mainStep.visited_status, i)}
                </Box>
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {mainStep.name}
              </Typography>
            </Box>
            <Box
              sx={{
                ml: '36px',
                position: 'relative',
                ...(i < arNavigationSteps.length - 1 && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    borderLeftWidth: '1px',
                    borderLeftStyle: 'solid',
                    top: '-16px',
                    bottom: '-16px'
                  }
                })
              }}
            >
              {mainStep.visited_status === 'current' && (
                <Box sx={{ pl: '20px' }}>
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
    <Box sx={{ backgroundColor: 'transparent', display: 'block' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-around',
          py: 3,
          px: '1.5rem',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        }}
      >
        {arNavigationSteps.map((mainStep, i) => (
          <Box key={i} sx={{ display: 'contents' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: '1rem 0' }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                  position: 'relative',
                  zIndex: 2,
                  transition: 'background-color 0.3s ease, transform 0.3s ease',
                  ...getHIconSx(mainStep.visited_status)
                }}
              >
                {getHIconContent(mainStep.visited_status, i)}
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: getHLabelColor(mainStep.visited_status) }}>{mainStep.name}</Typography>
            </Box>
            {i < arNavigationSteps.length - 1 && (
              <Box
                sx={{
                  height: 2,
                  flexGrow: 1,
                  position: 'relative',
                  top: '19px',
                  zIndex: 1,
                  my: '1rem',
                  backgroundColor: getLineBg(mainStep.visited_status),
                  transition: 'background-color 0.3s ease'
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      {arNavigationSteps.map((mainStep, i) => {
        if (mainStep.visited_status !== 'current') return null;
        return (
          <Box key={i} sx={{ px: '1.5rem', pb: '1rem' }}>
            <AssignmentCard getPConnect={getPConnect} itemKey={itemKey} actionButtons={actionButtons} onButtonPress={buttonPress}>
              {children}
            </AssignmentCard>
          </Box>
        );
      })}
    </Box>
  );
}
