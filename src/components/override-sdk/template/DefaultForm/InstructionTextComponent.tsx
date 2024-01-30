import React from 'react';
import ParsedHTML from '../../../helpers/formatters/ParsedHtml';
import getFormattedInstructionText from './DefaultFormUtils';

export default function InstructionTextComponent({ instructionText }) {
  return (
    <div id='instructions' className='govuk-body'>
      <ParsedHTML htmlString={getFormattedInstructionText(instructionText)} />
    </div>
  );
}
