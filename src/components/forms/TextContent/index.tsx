import React from 'react';
import { Typography } from '@material-ui/core';

export default function TextContent(props) {
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
      // eslint-disable-next-line no-console
      console.error(`TextContent got an expected displayAs prop: ${displayAs}`);
      break;
  }

  return <Typography variant={theVariant}>{content}</Typography>;
}
