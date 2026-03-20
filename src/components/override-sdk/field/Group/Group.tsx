import { type ReactElement, useMemo } from 'react';
import Grid2 from '@mui/material/Grid2';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface GroupProps extends PConnFieldProps {
  children: ReactElement[];
  heading: string;
  showHeading: boolean;
  instructions?: string;
  collapsible: boolean;
  type: string;
}

export default function Group(props: GroupProps) {
  const FieldGroup = getComponentFromMap('FieldGroup');

  const { children, heading, showHeading, instructions, collapsible, displayMode, type } = props;

  const isReadOnly = displayMode === 'DISPLAY_ONLY';

  const content = useMemo(() => {
    return (
      <Grid2 container spacing={2}>
        {children?.map(child => (
          <Grid2 size={{ xs: 12 }} key={child.key}>
            {child}
          </Grid2>
        ))}
      </Grid2>
    );
  }, [children, type, isReadOnly]);

  if (!children) return null;

  return (
    <FieldGroup name={showHeading ? heading : undefined} collapsible={collapsible} instructions={instructions}>
      {content}
    </FieldGroup>
  );
}
