import React, {useState, useEffect, createElement} from "react";
import PropTypes from "prop-types";
import createPConnectComponent from "../../bridge/react_pconnect";


export default function CaseCreateStage( props ) {

  const { getPConnect } = props;

  // We expect the getPConnect that's passed in to be the View that
  //  should be used
  const pConn = getPConnect();
  const children = pConn.getChildren();
  const [latestStageView, setLatestStageView] = useState({stageID: "", caseTypeID: "", theView: {}});
  const [viewAsReact, setViewAsReact] = useState<any>(null);

  // Utility to determine if a JSON object is empty
  function isEmptyObject(inObj: Object): Boolean {
    let key: String;
    // eslint-disable-next-line guard-for-in
    for (key in inObj) { return false; }
    return true;
  }


  useEffect(() => {
    if (children.length !== 1) {
      // eslint-disable-next-line no-console
      console.error(`CaseCreateStage did not receive exactly 1 child: ${children.length}`);
    } else {
      const theChild = children[0]
      const theChildPConn = theChild.getPConnect();
      const childType = theChildPConn.getComponentName();

      if (childType === "View") {

        // console.log(`CaseCreateStage received a child PConnect that is a View.`);
        const theCaseSummary = theChildPConn.getCaseSummary();
        const theStageID = theCaseSummary?.stageID;
        const theCaseTypeID = theCaseSummary?.caseTypeID;

        if ((theStageID !== latestStageView.stageID) || (theCaseTypeID !== latestStageView.caseTypeID)) {
          setLatestStageView( {stageID: theStageID, caseTypeID: theCaseTypeID, theView: theChild});
        }
      } else {
        // eslint-disable-next-line no-console
        console.error(`CaseCreateStage did NOT receive a child PConnect that is a View: ${childType}`);
      }
    }
  });

  useEffect(() => {
    if (!isEmptyObject(latestStageView.theView)) {
      setViewAsReact( createElement( createPConnectComponent(), latestStageView.theView ));
    }

  }, [latestStageView])


  return (
      <React.Fragment>
        {viewAsReact}
      </React.Fragment>
    );
}

CaseCreateStage.propTypes = {
  getPConnect: PropTypes.func.isRequired
};
