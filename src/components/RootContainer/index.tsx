import React, { useMemo, useRef, useState, useEffect, useContext, createElement } from "react";
// import { Banner, ModalManager } from "@pega/cosmos-react-core";
import PropTypes, { object } from "prop-types";
import isEqual from 'lodash.isequal';
// import ReAuthMessageModal from "../ReAuthenticationModal";
import { Box, CircularProgress } from "@material-ui/core";
import createPConnectComponent from "../../bridge/react_pconnect";
import { LazyMap as LazyComponentMap } from "../../components_map";
import StoreContext from "../../bridge/Context/StoreContext";
import { isEmptyObject } from '../../helpers/common-utils';

declare const PCore;

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//


const renderingModes = ["portal", "view"];

function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function getItemView(routingInfo, renderingMode) {
  const viewConfigs: any = [];
  if (routingInfo && renderingModes.includes(renderingMode)) {
    const { accessedOrder, items }: {accessedOrder: any, items:any } = routingInfo;
    if (accessedOrder && items) {
      const key = accessedOrder[accessedOrder.length - 1];
      if (
        items[key] &&
        items[key].view &&
        !isEmptyObject(items[key].view)
      ) {
        viewConfigs.push(items[key]);
      }
    }
  }
  return viewConfigs;
}

const RootContainer = (props) => {
  const {
    getPConnect,
    renderingMode,
    children,
    skeleton,
    httpMessages,
    routingInfo
  } = props;

  const { displayOnlyFA, isMashup } = useContext(StoreContext);


  const pConn = getPConnect();

  const options = { "context": "app" };
  if (isMashup) {
    options["context"] = "root";
  }

  const [componentName, setComponentName] = useState("");

  useEffect( () => {
    // debugging/investigation help
    // console.log(`componentName change: ${componentName} triggering a re-render`);
  }, [componentName] );

  // debugging/investigation help
  // console.log(`RootContainer props.routingInfo: ${JSON.stringify(routingInfo)}`);

  let hasBanner = false;
  let banners: any = null;
  const messages = httpMessages
    ? httpMessages.map((msg) => msg.message)
    : httpMessages;

  hasBanner = messages && messages.length > 0;
  banners = hasBanner && (<div>RootContainer: trying to emit Banner with {messages}</div>);

  const MemoizedModalViewContainer = useMemo(() => {
    return createElement(
      createPConnectComponent(),
      PCore.createPConnect({
        meta: {
          type: "ModalViewContainer",
          config: {
            name: "modal"
          }
        },
        options
      })
    );
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const MemoizedPreviewViewContainer = useMemo(() => {
    return createElement(
      createPConnectComponent(),
      PCore.createPConnect({
        meta: {
          type: "PreviewViewContainer",
          config: {
            name: "preview"
          }
        },
        options
      })
    );
  }, []);


  //
  function getNoPortalContent() {
    let noPortalContent: any;

    switch (componentName) {
      case "View":
        noPortalContent = <div>getNoPortalContent: RootContainer wants to render View in noPortal mode</div>
        break;

      case "ViewContainer": {
        const configProps = pConn.getConfigProps();
        const viewContConfig = {
          "meta": {
            "type": "ViewContainer",
            "config": configProps
          },
        options
        };
        const theViewCont = PCore.createPConnect(viewContConfig);
        // Add in displayOnlyFA if prop is on RootContainer
        if (displayOnlyFA) {
          theViewCont["displayOnlyFA"] = true;
        }

        const theViewContainerAsReact = createElement(createPConnectComponent(), theViewCont);

        noPortalContent = theViewContainerAsReact;
        break;
      }

      default:
        noPortalContent = <div>getNoPortalContent: RootContainer wants to render NO componentName in noPortal mode</div>
        break;

    }

    return noPortalContent;
  }


  let rootView : any;
  let rootViewConfig: any = null;

  useEffect(() => {
    const { containers } = PCore.getStore().getState();
    const items = Object.keys(containers).filter((item) =>
      item.includes("root")
    );
    PCore.getContainerUtils().getContainerAPI().addContainerItems(items);
  }, [routingInfo]);

  const items: any = getItemView(routingInfo, renderingMode);

  if (items.length > 0) {
    rootViewConfig = {
      meta: items[0].view,
      options: {
        context: items[0].context
      }
    };
  }
  const prevRootConfig = usePrevious(rootViewConfig);

  if (
    renderingModes.includes(renderingMode) &&
    messages &&
    routingInfo &&
    routingInfo?.accessedOrder.length === 0
  ) {
    return <div id="root-container">{banners}</div>;
  }

  if (items.length > 0) {
    const itemView = items[0].view;
    const currentRootConfig = {
      meta: itemView,
      options: {
        context: items[0].context
      }
    };

    if (!isEqual(currentRootConfig, prevRootConfig)) {
      rootView = createElement(
          createPConnectComponent(),
          PCore.createPConnect(currentRootConfig)
        );
    }

    // debugging/investigation help
    // console.log(`rootView.props.getPConnect().getComponentName(): ${rootView.props.getPConnect().getComponentName()}`);

    return (
      <div id="ModalManager">
          {rootView}
          {MemoizedModalViewContainer}
          <div id="MemoizedPreviewViewContainer"></div>
          <div id="ReAuthMessageModal"></div>
      </div>
    );

  }
  else if (renderingMode === "noPortal") {
    // eslint-disable-next-line no-console
    console.log(`RootContainer rendering in noPortal mode`);

    const theChildren = pConn.getChildren();
    if (theChildren && (theChildren.length === 1)) {
      const localPConn = theChildren[0].getPConnect();
      const localCompName = localPConn.getComponentName()
      if (componentName !== localCompName) {
        setComponentName(localCompName);
      }
    }

    const noPortalContent = getNoPortalContent();

    return noPortalContent;
  }
  else if (children && children.length > 0) {
    return (
      <React.Fragment>
        <div>RootContainer: Has children. Trying to show ModalManager with children, etc.</div>
        {children}
        {MemoizedModalViewContainer}
      </React.Fragment>

    );
  } else if (skeleton) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const LoadingComponent = LazyComponentMap[skeleton];

    return (
      <div id="root-container">
        {/* <div>RootContainer: Trying to show skeleton</div> */}
        <Box textAlign="center"><CircularProgress /></Box>
      </div>
    );
  } else {
    return (
      <div id="root-container">
        <div>RootContainer: Should be ModalManager, etc.</div>
      </div>
    );
  }
};

RootContainer.defaultProps = {
  getPConnect: null,
  renderingMode: null,
  children: null,
  routingInfo: object
};

RootContainer.propTypes = {
  getPConnect: PropTypes.func,
  renderingMode: PropTypes.string,
  routingInfo: PropTypes.shape({
    type: PropTypes.string,
    accessedOrder: PropTypes.array,
    items: PropTypes.object
  }),
  children: PropTypes.arrayOf(PropTypes.oneOfType( [PropTypes.object, PropTypes.string ]))
};

export default RootContainer;
