import React from "react";
import { Switch, Route } from 'react-router-dom';
import EmbeddedTopLevel from "../Embedded/EmbeddedTopLevel";
import FullPortal from "../FullPortal";

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const AppSelector = () => {

  return (
      <div>
        <Switch>
          <Route exact path="/" component={EmbeddedTopLevel} />
          <Route path="/index.html" component={EmbeddedTopLevel} />
          <Route path="/embedded" component={EmbeddedTopLevel} />
          <Route path="/embedded.html" component={EmbeddedTopLevel} />
          <Route path="/portal" component={FullPortal} />
          <Route path="/portal.html" component={FullPortal} />
          <Route path="*" component={EmbeddedTopLevel} />
        </Switch>
    </div>
  )

};

export default AppSelector;
