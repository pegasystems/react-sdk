// How to add welsh translation to this file, for Opens in new tab and warning etc.

function replaceWarningText(finalText, textToBeReplaced, textToBeFormatted) {
  const textToBeInserted = `<div class="govuk-warning-text">
          <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
          <strong class="govuk-warning-text__text">
            <span class="govuk-warning-text__assistive">WARNING</span>
            ${textToBeFormatted}
          </strong>
        </div>`;
  return finalText.replaceAll(textToBeReplaced, textToBeInserted);
}

function replaceInsetText(finalText, textToBeReplaced, textToBeFormatted) {
  const textToBeInserted = `<div class="govuk-inset-text">${textToBeFormatted}</div>`;
  return finalText.replaceAll(textToBeReplaced, textToBeInserted);
}

function formatter(finalText, stringWithTag, endtag, replace) {
  const startOfMarkedSpan = finalText.indexOf(stringWithTag); // e.g. abjhfds*<strong>WARNING!!jkgkjhhlk</strong>abjkk
  const endOfMarkedSpan = finalText.indexOf(endtag, startOfMarkedSpan) + endtag.length; // e.g. abjhfds<strong>WARNING!!jkgkjhhlk</strong>*abjkk
  const textToReplace = finalText.substring(startOfMarkedSpan, endOfMarkedSpan); // e.g. <strong>WARNING!!jkgkjhhlk</strong>

  const startOfTextToExtract = finalText.indexOf(stringWithTag) + stringWithTag.length; // e.g. abjhfds<strong>WARNING!!*jkgkjhhlk</strong>abjkk
  const endOfTextToExtract = finalText.indexOf(endtag, startOfTextToExtract); // e.g. abjhfds<strong>WARNING!!jkgkjhhlk*</strong>abjkk
  const textToExtract = finalText.substring(startOfTextToExtract, endOfTextToExtract); // e.g. jkgkjhhlk
  return replace(finalText, textToReplace, textToExtract);
}

export default function getFormattedInstructionText(instructionText) {
  if (instructionText === undefined || instructionText === '') {
    return null;
  }
  let finalText = instructionText.replaceAll('\n<p>&nbsp;</p>\n', '');
  const stringWithTagForWarning = `<strong>WARNING!!!`;
  const endtagForWarning = '</strong>';
  const stringWithTagForInset = `<p>INSET!!`;
  const endtagForInset = '</p>';
  // if the required text exists
  if (finalText.indexOf(stringWithTagForWarning) !== -1) {
    finalText = formatter(finalText, stringWithTagForWarning, endtagForWarning, replaceWarningText);
  }
  if (finalText.indexOf(stringWithTagForInset) !== -1) {
    finalText = formatter(finalText, stringWithTagForInset, endtagForInset, replaceInsetText);
  }

  return finalText;
}
