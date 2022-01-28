import React from "react";
import { Switch, Route } from 'react-router-dom';
import { authSetEmbedded } from "../../helpers/authWrapper";
import EmbeddedTopLevel from "../Embedded/EmbeddedTopLevel";
import FullPortal from "../FullPortal";
import AuthPage from "../AuthPage";

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const AppSelector = () => {

  const bHasToken = !!sessionStorage.getItem("rsdk_TI");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get("code");

  if(!bHasToken && !code) {
    // eslint-disable-next-line no-restricted-globals
    authSetEmbedded( location.pathname.includes("/embedded") );
  }

  return (
      <div>
        <Switch>
          {(!bHasToken && code &&
            <Route path="/" component={AuthPage} />
          )}
          <Route exact path="/" component={EmbeddedTopLevel} />
          <Route path="/embedded" component={EmbeddedTopLevel} />
          <Route path="/portal" component={FullPortal} />
        </Switch>
    </div>
  )

};

export default AppSelector;
