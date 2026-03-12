import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import OOTBActionButtons from '@pega/react-sdk-components/lib/components/infra/ActionButtons';

/**
 * Custom ActionButtons for WSS (MediaCo) portal.
 * Styled to match the Angular SDK's Material 3 button look:
 *   - Primary: filled pill buttons with purple background
 *   - Secondary: outlined pill buttons
 *   - Layout: left-aligned secondary, right-aligned primary (matching Angular's button-bar)
 */
interface ActionButtonsProps {
  arMainButtons?: any[];
  arSecondaryButtons?: any[];
  onButtonPress: (sAction: string, sButtonType: string) => void;
}

export default function ActionButtons(props: ActionButtonsProps) {
  // Delegate to OOTB ActionButtons when not on the WSS portal
  const isWssPortal = (PCore.getEnvironmentInfo() as any).environmentInfoObject?.pyPortalTemplate === 'wss';
  if (!isWssPortal) {
    return <OOTBActionButtons {...props} />;
  }

  const { arMainButtons = [], arSecondaryButtons = [], onButtonPress } = props;
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const localeCategory = 'Assignment';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: '1rem 0.5rem',
        marginTop: '2rem',
        marginBottom: '0.5rem',
        gap: '1rem',
        borderTop: '1px solid #e0e0e0',
        pt: '1.5rem',
        boxSizing: 'border-box'
      }}
    >
      {/* Secondary (left) */}
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        {arSecondaryButtons.map((sButton: any) => (
          <Button
            key={sButton.name}
            variant='outlined'
            onClick={() => onButtonPress(sButton.jsAction, 'secondary')}
            sx={{
              borderRadius: '20px',
              padding: '10px 24px',
              fontWeight: 500,
              fontSize: '0.875rem',
              textTransform: 'none',
              letterSpacing: '0.02em',
              borderColor: '#79747e',
              color: '#6750a4',
              minHeight: '40px',
              '&:hover': {
                borderColor: '#6750a4',
                backgroundColor: 'rgba(103, 80, 164, 0.08)'
              }
            }}
          >
            {localizedVal(sButton.name, localeCategory)}
          </Button>
        ))}
      </Box>

      {/* Primary (right) */}
      <Box sx={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
        {arMainButtons.map((mButton: any) => (
          <Button
            key={mButton.name}
            variant='contained'
            onClick={() => onButtonPress(mButton.jsAction, 'primary')}
            sx={{
              borderRadius: '20px',
              padding: '10px 24px',
              fontWeight: 500,
              fontSize: '0.875rem',
              textTransform: 'none',
              letterSpacing: '0.02em',
              backgroundColor: '#6750a4',
              color: '#fff',
              boxShadow: 'none',
              minHeight: '40px',
              '&:hover': {
                backgroundColor: '#53429a',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }
            }}
          >
            {localizedVal(mButton.name, localeCategory)}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
