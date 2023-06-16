import React, { useContext } from 'react';
import { connect, Provider, shallowEqual } from 'react-redux';
import ReactReduxContext from '../bridge/Context/StoreContext';

declare const PCore: any;

const connectToState = (mapStateToProps = () => {}) => {
  return (Component: any) => {
    const ConnectedComponent = connect(mapStateToProps, null, null, {
      areStatePropsEqual: (next, prev: any) => {
        // Compare visibility
        const prevWasVisible = prev.visibility !== false;
        if (next.visibility !== undefined && next.visibility !== prevWasVisible) {
          return false;
        }
        // Compare start props
        const c11nEnv = next.getPConnect();
        const allStateProps = c11nEnv.getStateProps();
        for (const key in allStateProps) {
          if (
            !shallowEqual(next[key], prev[key]) ||
            // eslint-disable-next-line no-undef
            (next.routingInfo && !PCore.isDeepEqual(next.routingInfo, prev.routingInfo))
          ) {
            return false;
          }
        }
        /* TODO For some rawConfig we are not getting routingInfo under allStateProps */
        return !(
          'routingInfo' in next &&
          (!shallowEqual(next.routingInfo, prev.routingInfo) ||
            !PCore.isDeepEqual(next.routingInfo, prev.routingInfo))
        );
      }
    })(Component);

    return (ownProps = {}) => {
      const { store } = useContext(ReactReduxContext);

      return (
        <Provider store={store}>
          <ConnectedComponent {...ownProps} />
        </Provider>
      );
    };
  };
};

export default connectToState;
