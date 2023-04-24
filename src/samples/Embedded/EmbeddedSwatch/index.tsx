/* eslint-disable react/button-has-type */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  swatchHeader: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#333000',
  },
  swatchPackage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '260px',
    height: '70px',
    backgroundColor: '#333000',
    padding: '5px'
  },
  swatchPlay: {
    letterSpacing: 'normal',
    color: 'white',
    fontSize: '25px'
  },
  swatchLevel: {
    letterSpacing: 'normal',
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold'
  },
  swatchChannels: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    letterSpacing: 'normal',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    width: '100px',

  },
  swatchCount: {
    letterSpacing: 'normal',
    color: 'white',
    fontSize: '40px',
    fontWeight: 'bold'
  },
  swatchLabel: {
    letterSpacing: 'normal',
    color: 'white',
    fontSize: '17px',
  },
  swatchBody: {
    letterSpacing: 'normal',
    border: '1px solid lightgray',
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: '20px'
  },
  swatchBanner: {
    letterSpacing: 'normal',
    fontWeight: 'bold',
    fontSize: '15px',
    padding: '5px'
  },
  swatchPrice: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  swatchFromGroup: {
    height: '90px'
  },
  swatchFrom: {
    color: theme.palette.primary.main,
    textAlign: 'right'
  },
  swatchCurrency: {
    letterSpacing: 'normal',
    color: theme.palette.primary.main,
    fontSize: '30px',
    fontWeight: 'bold',
    fontFamily: 'Tahoma'
  },
  swatchDollars: {
    letterSpacing: 'normal',
    color: theme.palette.primary.main,
    fontSize: '90px',
    fontWeight: 'bold',
    fontFamily: 'Tahoma'
  },
  swatchCents: {
    letterSpacing: 'normal',
    color: theme.palette.primary.main,
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: 'Tahoma'
  },
  swatchMonthly: {
    display: 'flex',
    flexDirection: 'column'
  },
  swatchShopButton: {
    color: 'white',
    backgroundColor: theme.palette.warning.main,
    fontSize: '25px',
    fontWeight: 'bold',
    borderRadius: '25px',
    border: '0px',
    margin: '20px',
    padding: '10px 30px'
  }

}));


export default function EmbeddedSwatch(props) {
  const classes = useStyles();

  const { play, level, channels, channels_full: channelsFull, banner, price, internetSpeed, calling, pcore } = props;

  return (
  <div>
    <div className={classes.swatchHeader}>
        <div className={classes.swatchPackage}>
            <div className={classes.swatchPlay}>
              {play}
            </div>
            <div className={classes.swatchLevel}>
              {level}
            </div>
        </div>
        <div className={classes.swatchChannels}>
            <div className={classes.swatchCount}>
                {channels}
            </div>
            <div className={classes.swatchLabel}>
                Channels
            </div>
        </div>
    </div>
    <div className={classes.swatchBody}>
        <div className={classes.swatchBanner}>
            {banner}
        </div>
        <ul>
            <li>{channelsFull} channels plus FREE HD</li>
            <li>Thousands of On Demand choices</li>
            <li>Watch on the { pcore ? pcore.getEnvironmentInfo().getApplicationLabel() : null} App</li>
            <li>Up to {internetSpeed} Internet Speeds</li>
            <li>Unlimited nationwide calling {calling}</li>
        </ul>

        <div className={classes.swatchPrice}>
            <div className={classes.swatchFromGroup}>
                <div className={classes.swatchFrom}>From</div>
                <div className={classes.swatchCurrency}>$</div>
            </div>

            <div className={classes.swatchDollars}>{price.substring(0, price.indexOf("."))}</div>
            <div className={classes.swatchMonthly}>
                <div className={classes.swatchCents}>{price.substring(price.indexOf(".") + 1)}</div>
                <div>for 12 months</div>
                <div>when bundled</div>
            </div>
        </div>
        <div>
            <button className={classes.swatchShopButton} onClick={ () => (props.onClick(level))}>SHOP NOW</button>
        </div>
      </div>
    </div>
  );

}
