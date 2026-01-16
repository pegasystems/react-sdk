import { useEffect, useState } from 'react';
import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import { makeStyles } from '@mui/styles';

import { usePegaAuth } from '../context/PegaAuthProvider';
import { usePega } from '../context/PegaReadyContext';

import ShoppingOptionCard from '../ShoppingOptionCard';
import ResolutionScreen from '../ResolutionScreen';
import { shoppingOptions } from '../utils';

const useStyles = makeStyles(theme => ({
  appContainer: {
    backgroundColor: 'var(--app-background-color)',
    fontFamily: "'Poppins', sans-serif",
    color: theme.palette.text.primary,
    minHeight: 'calc(100vh - 50px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  mainContentArea: {
    padding: '4rem 0',
    width: '100%'
  },
  mainContainer: {
    width: '90%',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem',
    marginBottom: '6rem',
    '@media (max-width: 992px)': {
      flexDirection: 'column',
      textAlign: 'center'
    }
  },
  heroText: {
    flexBasis: '50%',
    '& h1': {
      fontSize: '3.5rem',
      lineHeight: 1.2,
      fontWeight: 700,
      color: theme.palette.text.primary
    }
  },
  heroImage: {
    flexBasis: '45%',
    textAlign: 'right',
    '& img': {
      maxWidth: '100%',
      height: 'auto'
    },
    '@media (max-width: 992px)': {
      textAlign: 'center'
    }
  },
  plansSection: {
    display: 'flex',
    gap: '3rem',
    alignItems: 'flex-start',
    '@media (max-width: 1200px)': {
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }
  },
  plansIntro: {
    flexBasis: '25%',
    paddingRight: '2rem',
    '& h2': {
      fontSize: '2.8rem',
      lineHeight: 1.3,
      fontWeight: 700,
      color: theme.palette.text.primary
    },
    '@media (max-width: 1200px)': {
      paddingRight: 0,
      marginBottom: '2rem'
    }
  },
  highlight: {
    color: theme.actionButtons.primary.backgroundColor
  },
  plansContainer: {
    flexBasis: '75%',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
    '@media (max-width: 992px)': {
      gridTemplateColumns: '1fr',
      width: '100%',
      maxWidth: '400px'
    }
  },
  pegaViewContainer: {
    width: '100%'
  },
  pegaForm: {}
}));

export default function MainScreen() {
  const { isAuthenticated } = usePegaAuth();
  const { isPegaReady, PegaContainer, createCase } = usePega();

  const classes = useStyles();

  const [showPega, setShowPega] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [showResolution, setShowResolution] = useState(false);

  useEffect(() => {
    if (isPegaReady) {
      // Subscribe to the EVENT_CANCEL event to handle the assignment cancellation
      PCore.getPubSubUtils().subscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, () => cancelAssignment(), 'cancelAssignment');

      // Subscribe to the END_OF_ASSIGNMENT_PROCESSING event to handle assignment completion
      PCore.getPubSubUtils().subscribe(
        PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.END_OF_ASSIGNMENT_PROCESSING,
        () => assignmentFinished(),
        'endOfAssignmentProcessing'
      );
    }

    return () => {
      // unsubscribe to the events
      PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'cancelAssignment');
      PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.END_OF_ASSIGNMENT_PROCESSING, 'endOfAssignmentProcessing');
    };
  }, [isPegaReady]);

  const cancelAssignment = () => {
    setShowLandingPage(true);
    setShowPega(false);
  };

  const assignmentFinished = () => {
    setShowResolution(true);
    setShowPega(false);
  };

  const onShopNow = async optionClicked => {
    setShowLandingPage(false);
    setShowPega(true);
    const sdkConfig = await getSdkConfig();
    const mashupCaseType = sdkConfig.serverConfig.appMashupCaseType;

    let selectedPhoneGUID = '';
    const phoneName = optionClicked ? optionClicked.trim() : '';
    switch (phoneName) {
      case 'Oceonix 25 Max':
        selectedPhoneGUID = '2455b75e-3381-4a34-b7db-700dba34a670';
        break;
      case 'Oceonix 25 Ultra':
        selectedPhoneGUID = '535f01f3-a702-4655-bcd0-f1d9c1599a9c';
        break;
      case 'Oceonix 25':
      default:
        // Set 'Oceonix 25' as the default/fallback
        selectedPhoneGUID = '0f670ae2-3e61-47d4-b426-edd62558cfb8';
        break;
    }
    // Create options object with default values
    const options: {
      pageName: string;
      startingFields: { [key: string]: any };
    } = {
      pageName: 'pyEmbedAssignment',
      startingFields: {}
    };
    if (mashupCaseType === 'DIXL-MediaCo-Work-PurchasePhone') {
      options.startingFields['PhoneModelss'] = {
        pyGUID: selectedPhoneGUID
      };
    } else {
      console.warn(`Unexpected case type: ${mashupCaseType}. PhoneModelss field not set.`);
    }

    // Call the createCase function from context to create a new case using the mashup API
    createCase(mashupCaseType, options).then(() => {
      console.log('createCase rendering is complete');
    });
  };

  function renderLandingPage() {
    return (
      <div className={classes.mainContentArea}>
        <main className={classes.mainContainer}>
          <section className={classes.hero}>
            <div className={classes.heroText}>
              <h1>
                Keeping you connected
                <br />
                to what matters.
              </h1>
            </div>
            <div className={classes.heroImage}>
              <img src='./assets/img/SDKDevicesImage.png' alt='Smartphone, Tablet, and Laptop' />
            </div>
          </section>
          <section className={classes.plansSection}>
            <div className={classes.plansIntro}>
              <h2>
                {}
                The phones you want at prices you'll <span className={classes.highlight}>love.</span>
              </h2>
            </div>
            <div className={classes.plansContainer}>
              {shoppingOptions.map(option => (
                <ShoppingOptionCard key={option.level} {...option} onClick={() => onShopNow(option.name)} />
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  function renderPegaView() {
    return (
      <div className={classes.pegaViewContainer}>
        <div className={classes.pegaForm} id='pega-part-of-page'>
          <PegaContainer />
          <br />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <div style={{ textAlign: 'center' }}>Loading...</div>;

  return (
    <div className={classes.appContainer}>
      {showLandingPage && renderLandingPage()}
      {showResolution && <ResolutionScreen />}
      {showPega && renderPegaView()}
    </div>
  );
}
