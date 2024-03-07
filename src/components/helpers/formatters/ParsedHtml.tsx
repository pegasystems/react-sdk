import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

/*
  Accepts optional prop of DOMSanitiseHooks to allow customisation of the sanitise call, 
  Can be used, for example, to inject required class into <p> tags
  Expects a list of DomPurify hook callbacks, which will be called with 'beforeSanitizeAttributes' option
*/
export default function InstructionComp({
  htmlString,
  DOMSanitiseHooks
}: {
  htmlString: string;
  DOMSanitiseHooks?: Array<any>;
}) {
  const [invalidHTML, setInvalidHTML] = useState(false);

  // The hintText and instructionText are sometimes string and sometimes HTML as the formatting is prone to change as per business requirements. Thus this function checks if the string is a normal string or html and returns value to be rendered accordingly
  function isHTML() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const errorExists = doc.querySelector('parsererror');
    if (errorExists) {
      setInvalidHTML(true);
    }
  }

  useEffect(() => {
    isHTML();
  }, []);

  if (invalidHTML) {
    return <>{htmlString}</>;
  }

  const appendSecureRelValue = rel => {
    const attributes = new Set(rel ? rel.toLowerCase().split(' ') : []);

    attributes.add('noopener');
    attributes.add('noreferrer');

    return Array.from(attributes).join(' ');
  };

  const TEMPORARY_ATTRIBUTE = 'data-temp-href-target';

  DOMPurify.addHook('beforeSanitizeAttributes', node => {
    if (node.tagName === 'A' && node.hasAttribute('target')) {
      // @ts-ignore
      node.setAttribute(TEMPORARY_ATTRIBUTE, node.getAttribute('target'));
      const temporaryAttribute = node.getAttribute('target');

      if (temporaryAttribute !== null) {
        node.setAttribute(TEMPORARY_ATTRIBUTE, temporaryAttribute);
      }
    }
  });

  DOMPurify.addHook('afterSanitizeAttributes', node => {
    if (node.tagName === 'A' && node.hasAttribute(TEMPORARY_ATTRIBUTE)) {

      // @ts-ignore
      node.setAttribute('target', node.getAttribute(TEMPORARY_ATTRIBUTE));
      const temporaryAttribute = node.getAttribute('target');

      if (temporaryAttribute !== null) {
        node.setAttribute(TEMPORARY_ATTRIBUTE, temporaryAttribute);
      }
      node.removeAttribute(TEMPORARY_ATTRIBUTE);
      if (node.getAttribute('target') === '_blank') {
        const rel = node.getAttribute('rel');
        node.setAttribute('rel', appendSecureRelValue(rel));
      }
    }
  });

  DOMSanitiseHooks?.forEach(hook => {
    DOMPurify.addHook('beforeSanitizeAttributes', hook);
  });

  const cleanHTML = DOMPurify.sanitize(htmlString, { USE_PROFILES: { html: true } });

  return <>{parse(cleanHTML)}</>;
}
