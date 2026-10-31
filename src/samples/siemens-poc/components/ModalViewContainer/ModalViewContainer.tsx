import { useMemo } from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import SdkModalViewContainer from '@pega/react-sdk-components/lib/components/infra/Containers/ModalViewContainer';

import { useCockpitState } from '../../context/cockpitStore';
import { createCockpitTheme } from '../../styles/cockpitTheme';

/**
 * The SDK renders modals from the RootContainer, outside the Cockpit AppShell, so they don't inherit its theme.
 * This only wraps the SDK ModalViewContainer in the Cockpit theme; all container logic stays in the SDK component.
 */
export default function CockpitModalViewContainer(props: any) {
  const { active, mode } = useCockpitState();
  const outerTheme = useTheme();
  // Always render the provider (with the app theme when inactive) so toggling never remounts the container.
  const theme = useMemo(() => (active ? createCockpitTheme(outerTheme, mode) : outerTheme), [active, mode, outerTheme]);

  return (
    <ThemeProvider theme={theme}>
      <SdkModalViewContainer {...props} />
    </ThemeProvider>
  );
}
