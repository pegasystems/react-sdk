/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useMemo, useState } from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';

import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';

import ShoppingOptionCard from '../ShoppingOptionCard';
import ResolutionScreen from '../ResolutionScreen';
import { shoppingOptions } from '../utils';

function RootComponent(props) {
  const PegaConnectObj = createPConnectComponent();
  const thePConnObj = <PegaConnectObj {...props} />;

  /**
   * NOTE: For Embedded mode, we add in displayOnlyFA to our React context
   * so it is available to any component that may need it.
   * VRS: Attempted to remove displayOnlyFA but it presently handles various components which
   * SDK does not yet support, so all those need to be fixed up before it can be removed.
   * To be done in a future sprint.
   */
  const contextValue = useMemo(() => {
    return { store: PCore.getStore(), displayOnlyFA: true };
  }, [PCore.getStore()]);

  return <StoreContext.Provider value={contextValue}>{thePConnObj}</StoreContext.Provider>;
}

const useStyles = makeStyles(() => ({
  embedMainScreen: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  embedBanner: {
    textAlign: 'center',
    width: '100%',
    padding: '20px'
  },
  embedShoppingOptions: {
    display: 'flex',
    justifyContent: 'space-evenly'
  },
  pegaPartInfo: {
    display: 'flex',
    flexDirection: 'row'
  },
  pegaPartPega: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column'
  },
  pegaPartText: {
    paddingLeft: '50px'
  },
  pegaPartAccompaniment: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  pegaPartAccompanimentText: {
    fontSize: '30px',
    lineHeight: '40px',
    padding: '20px 20px',
    color: 'darkslategray'
  },
  pegaPartAccompanimentImage: {
    width: '100%',
    borderRadius: '10px'
  }
}));

interface MainScreenProps {}

export default function MainScreen(props: MainScreenProps) {
  const classes = useStyles();

  const [showPega, setShowPega] = useState(false);
  const [showTriplePlayOptions, setShowTriplePlayOptions] = useState(true);
  const [showResolution, setShowResolution] = useState(false);

  useEffect(() => {
    // Subscribe to the EVENT_CANCEL event to handle the assignment cancellation
    PCore.getPubSubUtils().subscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, () => cancelAssignment(), 'cancelAssignment');

    // Subscribe to the END_OF_ASSIGNMENT_PROCESSING event to handle assignment completion
    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.END_OF_ASSIGNMENT_PROCESSING,
      () => assignmentFinished(),
      'endOfAssignmentProcessing'
    );

    return () => {
      // unsubscribe to the events
      PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'cancelAssignment');
      PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.END_OF_ASSIGNMENT_PROCESSING, 'endOfAssignmentProcessing');
    };
  });

  const cancelAssignment = () => {
    setShowTriplePlayOptions(true);
    setShowPega(false);
  };

  const assignmentFinished = () => {
    setShowResolution(true);
    setShowPega(false);
  };

  /**
   * Handles the 'Shop Now' event by creating a new case using the mashup API.
   *
   * @param {Event} event - The event object triggered by the 'Shop Now' action.
   */
  const onShopNow = async (optionClicked: string) => {
    const sLevel = optionClicked;

    // Update the UI state to show pega container
    setShowTriplePlayOptions(false);
    setShowPega(true);

    // Get the SDK configuration
    const sdkConfig = await getSdkConfig();
    let mashupCaseType = sdkConfig.serverConfig.appMashupCaseType;

    // If mashupCaseType is null or undefined, get the first case type from the environment info
    if (!mashupCaseType) {
      const caseTypes = PCore?.getEnvironmentInfo()?.environmentInfoObject?.pyCaseTypeList;
      mashupCaseType = (caseTypes?.[0] as any).pyWorkTypeImplementationClassName;
    }

    // Create options object with default values
    const options: any = {
      pageName: 'pyEmbedAssignment',
      startingFields: {}
    };

    // If mashupCaseType is 'DIXL-MediaCo-Work-NewService', add Package field to startingFields
    if (mashupCaseType === 'DIXL-MediaCo-Work-NewService') {
      options.startingFields.Package = sLevel;
    }

    // Create a new case using the mashup API
    PCore.getMashupApi()
      .createCase(mashupCaseType, PCore.getConstants().APP.APP, options)
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('createCase rendering is complete');
      });
  };

  function getShowTriplePlayOptionsMarkup() {
    const theBanner = (
      <div className={classes.embedMainScreen}>
        <div className={classes.embedBanner}>
          <Typography variant='h5'>Combine TV, Internet, and Voice for the best deal</Typography>
        </div>
      </div>
    );

    const theOptions = shoppingOptions.map((option, index) => {
      return <ShoppingOptionCard key={option.level} {...shoppingOptions[index]} onClick={onShopNow} />;
    });

    return (
      <>
        {theBanner}
        <div className={classes.embedShoppingOptions}>{theOptions}</div>
      </>
    );
  }

  return (
    <>
      {showTriplePlayOptions ? getShowTriplePlayOptionsMarkup() : null}
      {showResolution ? <ResolutionScreen /> : null}
      {showPega ? (
        <div className={classes.pegaPartInfo}>
          <div className={classes.pegaPartPega} id='pega-part-of-page'>
            <RootComponent {...props} />
            <br />
            <div className={classes.pegaPartText}> * - required fields</div>
          </div>
          <div className={classes.pegaPartAccompaniment}>
            <div className={classes.pegaPartAccompanimentText}>We need to gather a little information about you.</div>
            <div>
              <img src='../../../assets/img/cableinfo.jpg' className={classes.pegaPartAccompanimentImage} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
