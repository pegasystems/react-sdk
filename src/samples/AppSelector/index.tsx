import React from "react";
import { Switch, Route } from 'react-router-dom';
// import EmbeddedTopLevel from "../Embedded/EmbeddedTopLevel";
import EmbeddedTopLevel from '../ChildBenefitsClaim/index';

// NOTE: You should update this to be the same value that's in
//  the src/index.html <base href="value"> to allow the React Router
//  to identify the paths correctly.
const baseURL = "/";

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const AppSelector = () => {

  return (
    <>
      <Switch>
        <Route exact path={baseURL} component={EmbeddedTopLevel} />
        <Route path="*" component={EmbeddedTopLevel} />
      </Switch>
    </>
  )

};

export default AppSelector;
