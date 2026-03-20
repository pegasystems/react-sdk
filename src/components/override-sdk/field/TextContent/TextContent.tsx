import { Typography } from '@mui/material';

import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface TextContentProps extends PConnProps {
  // If any, enter additional props that only exist on TextContent here
  content: string;
  displayAs: 'Paragraph' | 'Heading 1' | 'Heading 2' | 'Heading 3' | 'Heading 4';
}

export default function TextContent(props: TextContentProps) {
  type ExpectedDisplayAs = 'Paragraph' | 'Heading 1' | 'Heading 2' | 'Heading 3' | 'Heading 4';
  type ExpectedVariants = 'body1' | 'h1' | 'h2' | 'h3' | 'h4';

  const { content, displayAs }: { content: string; displayAs: ExpectedDisplayAs } = props;

  let theVariant: ExpectedVariants = 'body1';

  switch (displayAs) {
    case 'Paragraph':
      theVariant = 'body1';
      break;

    case 'Heading 1':
      theVariant = 'h1';
      break;

    case 'Heading 2':
      theVariant = 'h2';
      break;

    case 'Heading 3':
      theVariant = 'h3';
      break;

    case 'Heading 4':
      theVariant = 'h4';
      break;

    default:
      console.error(`TextContent got an expected displayAs prop: ${displayAs}`);
      break;
  }

  return <Typography variant={theVariant}>{content}</Typography>;
}
