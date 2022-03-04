import React from 'react';
import AppSelector from '../AppSelector';

const TopLevelApp = () => {

  return (
    <div>
      <AppSelector />
    </div>
  );
}

// Code that sets up use of Constellation once it's been loaded and ready

document.addEventListener('ConstellationReady', () => {

  // Element with id="pega-here" is where the React SDK React entry point for
  //  the Pega embedded/portal will be placed.
  const replaceMe = document.getElementById('pega-here');

  if (replaceMe === null) {
    // eslint-disable-next-line no-console
    console.error(`No id="pega-here".`);

    // This code was taken from web-components-sdk and needs to be adapted for React SDK

    // shadow root
    // const startingComponent = window.sessionStorage.getItem("startingComponent");

    // const myShadowRoot = document.getElementsByTagName(startingComponent)[0].shadowRoot;
    // const replaceMe = myShadowRoot.getElementById("pega-here");
    // const elPrePegaHdr = myShadowRoot.getElementById("app-nopega");
    // if(elPrePegaHdr) elPrePegaHdr.style.display = "none";

    // let replacement = null;

    // switch (startingComponent) {
    //   case "full-portal-component" :
    //     replacement = document.createElement("app-entry");
    //     break;
    //   case "simple-portal-component":
    //     replacement = document.createElement("simple-main-component");
    //     break;
    //   case "mashup-portal-component":
    //     replacement = document.createElement("mashup-main-component");
    //     break;
    // }

    // if (replacement != null) {
    //   replacement.setAttribute("id", "pega-root");
    //   replaceMe.replaceWith(replacement);
    // }
  } else {
    // Hide the original prepega area
    const elPrePegaHdr = document.getElementById('app-nopega');
    if (elPrePegaHdr) elPrePegaHdr.style.display = 'none';

    // With Constellation Ready, replace <div id="pega-here"></div>
    //  with DOM node with id="pega-root". This element will be used
    //  as the React root in the initial React render

    const replacement = document.createElement('div');

    replacement.setAttribute('id', 'pega-root');
    // NOTE: Need to replace this WC app-entry with React equivalent
    replacement.innerHTML = 'Injecting React root here!';
    replaceMe.replaceWith(replacement);
  }
});


export default TopLevelApp;
