import { Switch, Route } from 'react-router-dom';

import EmbeddedTopLevel from '../Embedded/EmbeddedTopLevel';
import FullPortal from '../FullPortal';

// NOTE: You should update this to be the same value that's in
//  the src/index.html <base href="value"> to allow the React Router
//  to identify the paths correctly.
const baseURL = '/';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const AppSelector = () => {
  return (
    <div>
      <Switch>
        <Route exact path={`${baseURL}`} component={EmbeddedTopLevel} />
        <Route path={`${baseURL}index.html`} component={EmbeddedTopLevel} />
        <Route path={`${baseURL}embedded`} component={EmbeddedTopLevel} />
        <Route path={`${baseURL}embedded.html`} component={EmbeddedTopLevel} />
        <Route path={`${baseURL}portal`} component={FullPortal} />
        <Route path={`${baseURL}portal.html`} component={FullPortal} />
        <Route path='*' component={EmbeddedTopLevel} />
      </Switch>
    </div>
  );
};

export default AppSelector;
