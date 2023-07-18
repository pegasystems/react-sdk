
import React, {useEffect, useState} from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

export default function InstructionComp({htmlString}) {

  const [invalidHTML, setInvalidHTML] = useState(false);

  // The hintText and instructionText are sometimes string and sometimes HTML as the formatting is prone to change as per business requirements. Thus this function checks if the string is a normal string or html and returns value to be rendered accordingly
  function isHTML(){
    const parser = new DOMParser;
    const doc = parser.parseFromString(htmlString, 'text/html');
    const errorExists = doc.querySelector('parsererror');
    if(errorExists){
      setInvalidHTML(true);
    }
  }

  useEffect(()=>{
    isHTML();
  },[])

  if(invalidHTML){
    return htmlString;
  }

  const cleanHTML = DOMPurify.sanitize(htmlString,
    { USE_PROFILES: { html: true } });
  return <>{parse(cleanHTML)}</>;
}
