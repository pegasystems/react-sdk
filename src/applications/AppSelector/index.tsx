import React from "react";
import { Routes, Route } from 'react-router-dom';
import ChildBenefitsClaim from '../ChildBenefitsClaim'

// NOTE: You should update this to be the same value that's in
//  the src/index.html <base href="value"> to allow the React Router
//  to identify the paths correctly.

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const AppSelector = () => {

  return (
    <Routes>
      <Route path="*" element={<ChildBenefitsClaim />} />
    </Routes>
  )

};

export default AppSelector;
