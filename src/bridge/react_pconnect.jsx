import React, { Children, Component, createElement } from "react";
// import { render, unmountComponentAtNode } from "react-dom";
import PropTypes from "prop-types";
import { connect, shallowEqual } from "react-redux";
// Initial simplification to remove ErrorBoundary
import ErrorBoundary from "../components/ErrorBoundary";
import ComponentMap, { LazyMap as LazyComponentMap } from "../components_map";
import StoreContext from "./Context/StoreContext";

// For now, NOT doing lazy loading - needs some work on the loader to work with TypeScript
// As we add components, we'll need to import them here and add to the switch statement
//    below in getComponent!
import AppAnnouncement from '../components/widgets/AppAnnouncement';
import AppShell from '../components/templates/AppShell';
import Attachment from '../components/Attachment';
import AutoComplete from '../components/forms/AutoComplete';
import CaseHistory from '../components/widgets/CaseHistory';
import CaseSummary from '../components/templates/CaseSummary';
import CaseView from '../components/templates/CaseView';
import CheckboxComponent from '../components/forms/Checkbox';
import Currency from '../components/forms/Currency';
import Date from '../components/forms/Date';
import DateTime from '../components/forms/DateTime';
import Decimal from '../components/forms/Decimal';
import DeferLoad from '../components/DeferLoad';
import Dropdown from "../components/forms/Dropdown";
import Email from '../components/forms/Email';
import FileUtility from "../components/widgets/FileUtility";
import FlowContainer from '../components/FlowContainer';
import Followers from '../components/widgets/Followers';
import Integer from '../components/forms/Integer';
import Percentage from '../components/forms/Percentage';
import Phone from '../components/forms/Phone';
import Pulse from '../components/Pulse';
import RadioButtons from '../components/forms/RadioButtons';
import Reference from '../components/Reference';
import Region from '../components/Region';
import RootContainer from '../components/RootContainer';
import SimpleTable from '../components/templates/SimpleTable';
import Stages from '../components/Stages';
import TextArea from '../components/forms/TextArea';
import TextContent from '../components/forms/TextContent';
import TextInput from '../components/forms/TextInput';
import Time from '../components/forms/Time';
import ToDo from '../components/ToDo';
import URLComponent from '../components/forms/URL';
import View from '../components/View';
import ViewContainer from '../components/ViewContainer';
import ModalViewContainer from '../components/ModalViewContainer';
import SimpleTableSelect from '../components/templates/SimpleTableSelect';
import PromotedFilters from '../components/templates/PromotedFilters';
import DataReference from '../components/templates/DataReference';
import SemanticLink from '../components/forms/SemanticLink';
import UserReference from '../components/forms/UserReference';
import ChangeLink from '../components/forms/ChangeLink';

const connectRedux = (component, c11nEnv) => {

  // console.log(`in connectRedux: ${component.name}`);

  return connect(
    (state, ownProps) => {
      let addProps = {};
      const obj = {};


      // JA - testing
      // const theCompName = c11nEnv.getComponentName();
      // console.log(`in connect mapStateToProps callback for: ${theCompName}`);
      // if ( theCompName === "ViewContainer" || theCompName === "View") {
      //   debugger;
      // }

      if (typeof component.additionalProps === "object") {
        addProps = c11nEnv.resolveConfigProps(component.additionalProps);
      } else if (typeof component.additionalProps === "function") {
        addProps = c11nEnv.resolveConfigProps(
          component.additionalProps(state, ownProps.getPConnect)
        );
      }

      // const obj = c11nEnv.getConfigProps();
      c11nEnv.getConfigProps(obj);

      // debugging/investigation help
      // if (obj.routingInfo) {
      //   console.log( `${theCompName}: BEFORE populateAdditionalProps: obj.routingInfo: ${JSON.stringify(obj.routingInfo)}`);
      // }

      // populate additional props which are component specific and not present in configurations
      // This block can be removed once all these props will be added as part of configs
      c11nEnv.populateAdditionalProps(obj);

      // debugging/investigation help
      // if (obj.routingInfo) {
      //   console.log( `${theCompName}: AFTER populateAdditionalProps: obj.routingInfo: ${JSON.stringify(obj.routingInfo)}`);
      //   // if (theCompName === "ViewContainer") {
      //   //   debugger;
      //   // }
      // }

      return {
        ...obj,
        ...addProps
      };
    },
    null,
    null,
    {
      context: StoreContext,
      areStatePropsEqual: (next,prev) => {
        const allStateProps = c11nEnv.getStateProps();
        for(const key in allStateProps){
          // eslint-disable-next-line no-undef
          if(!shallowEqual(next[key], prev[key]) || (next.routingInfo && !PCore.isDeepEqual(next.routingInfo, prev.routingInfo))){
            return false;
          }
        }
        /* TODO For some rawConfig we are not getting routingInfo under allStateProps */
        // eslint-disable-next-line no-undef
        if('routingInfo' in next && (!shallowEqual(next.routingInfo, prev.routingInfo) || !PCore.isDeepEqual(next.routingInfo, prev.routingInfo))){
          return false;
        }

        // For CaseSummary (when status === ".pyStatusWork"), we need to compare changes in
        //  primaryFields and secondary Fields
        if (allStateProps.status === ".pyStatusWork") {
          for(const key in prev){
            // eslint-disable-next-line no-undef
            if (!PCore.isDeepEqual(next[key], prev[key])) {
              return false;
            }
          }
        }

        return true;
      }
    }
  )(component);
};


const getComponent = (c11nEnv, declarative) => {
  // PCore is defined in pxBootstrapShell - eventually will be exported in place of constellationCore
  // eslint-disable-next-line no-undef
  const ComponentsRegistry = PCore.getComponentsRegistry();
  const type = c11nEnv.getComponentName();

  const componentObj = ComponentsRegistry.getComponent(type);
  const componentType = (componentObj && componentObj.component) || type;

  // JEA - modifying logic before bailing to RootContainer logic to work around async loading problem
  let component =
    LazyComponentMap[componentType] /* || window[componentType] */;

  // NOTE: Until we get lazy loading working, maintain this for each component we add
  if (component === undefined) {
    // eslint-disable-next-line sonarjs/max-switch-cases
    switch (type) {
      case 'AppAnnouncement':
        component = AppAnnouncement;
        break;

      case 'AppShell':
        component = AppShell;
        break;

      case 'Attachment':
        component = Attachment;
        break;

      case 'AutoComplete':
        component = AutoComplete;
        break;

      case 'CaseHistory':
        component = CaseHistory;
        break;

      case 'CaseSummary':
        component = CaseSummary;
        break;

      case 'CaseView':
        component = CaseView;
        break;

      case 'Checkbox':
        component = CheckboxComponent;
        break;

      case 'Currency':
        component = Currency;
        break;

      case 'Date':
        component = Date;
        break;

      case 'DateTime':
        component = DateTime;
        break;

      case 'Decimal':
        component = Decimal;
        break;

      case 'DeferLoad':
        component = DeferLoad;
        break;

      case 'Dropdown':
        component = Dropdown;
        break;

      case 'Email':
        component = Email;
        break;

      case 'FileUtility':
        component = FileUtility;
        break;

      case 'FlowContainer':
        component = FlowContainer;
        break;

      case 'Followers':
        component = Followers;
        break;

      case 'Integer':
        component = Integer;
        break;

      case 'ModalViewContainer':
        component = ModalViewContainer;
        break;

      case 'Percentage':
        component = Percentage;
        break;

      case 'Phone':
        component = Phone;
        break;

      case 'Pulse':
        component = Pulse;
        break;

      case 'RadioButtons':
        component = RadioButtons;
        break;

      case 'reference':
      case 'Reference':
        component = Reference;
        break;

      case 'Region':
        component = Region;
        break;

      case 'RootContainer':
        component = RootContainer;
        break;

      case 'SimpleTable':
        component = SimpleTable;
        break;

      case 'SimpleTableSelect':
        component = SimpleTableSelect;
        break;

      case 'DataReference':
        component = DataReference;
        break;

      case 'UserReference':
        component = UserReference;
        break;

      case 'PromotedFilters':
        component = PromotedFilters;
        break;

      case 'Stages':
        component = Stages;
        break;

      case 'TextArea':
        component = TextArea;
        break;

      case 'TextContent':
        component = TextContent;
        break;

      case 'TextInput':
        component = TextInput;
        break;

      case 'RichText':
      component = TextInput;
      break;

      case 'Time':
        component = Time;
        break;

      case 'ToDo':
      case 'Todo':
        component = ToDo;
        break;

      case 'URL':
        component = URLComponent;
        break;

      case 'View':
        component = View;
        break;

      case 'ViewContainer':
        component = ViewContainer;
        break;

      case 'SemanticLink':
        component = SemanticLink;
        break;

      case 'HMRC_ODX_ChangeLink':
        component = ChangeLink;
        break;

      case 'HMRC_ODX_PhoneNumber':
        component = Phone;
        break;

      default:
        // eslint-disable-next-line no-console
        console.log(`getComponent doesn't have an entry for type ${type}`);
        component = ErrorBoundary;
        break;
    }
  } else {
    // eslint-disable-next-line no-console
    console.log( `getComponent doesn't have an entry for component ${component}`);
    component = ErrorBoundary;
  }

  // Declarative components already connected to redux so return without connect.
  if (declarative) {
    return component;
  }

  if (c11nEnv.isConditionExist()) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    component = connectRedux(createPConnectComponent(true), c11nEnv);
  } else {
    component = connectRedux(component, c11nEnv);
  }
  return component;
};


/**
 *
 * @param {*} declarative
 * @returns {React.FunctionComponent<Props, State>}
 * return type of React.FunctionComponent inspired by:
 * https://stackoverflow.com/questions/64890278/argument-of-type-function-is-not-assignable-to-parameter-of-type-componenttyp
 */
 const createPConnectComponent = (declarative=false) => {
  /**
   * Add TypeScript hinting info via JSdoc syntax...
   * @extends {React.FunctionComponent<Props, State>}
   * createPConnectComponent - Class to create/initialize a PConnect (c11nEnv) object
   * to pre-process meta data of each componnet.
   * - Wraps each child in a component with PConnect
   * - Process all actions and make them avaiable in props
   * - Filters all properties in metadata and keeps them
   * __internal for re-render process through connect
   */
  class PConnect extends Component {
    constructor(props) {
      super(props);
      this.children = [];
      this.c11nEnv = this.props.getPConnect();
      this.initialize();
      this.state = { hasError: false };
      this.Control = getComponent(this.c11nEnv, declarative);
      this.actionsAPI = this.c11nEnv.getActionsApi();

      let theDisplayName = this.Control.displayName;
      if (theDisplayName === undefined) {
        // In some case (ex: RadioButtons), displayName isn't defined. So,
        //  When this happens, use getComponentName() instead
        theDisplayName = this.c11nEnv.getComponentName();
      }

      // console.log( `PConnect constructor: ${theDisplayName}`);
    }

    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return {
        hasError: true,
        error
      };
    }

    componentDidMount() {
      this.c11nEnv.addFormField();
    }

    componentDidCatch(error, info) {
      // eslint-disable-next-line no-console
      console.error(
        `Error while Rendering the component ${this.componentName} : `,
        error,
        info.componentStack
      );
    }

    componentWillUnmount() {
      if (this.c11nEnv.removeFormField) {
        this.c11nEnv.removeFormField();
      }
    }

    /*
     *  processActions to see all actions in meta and adds event in props.
     *  Attaches common handler (eventHandler) for all actions.
     */
    processActions() {
      if (this.c11nEnv.isEditable()) {
        this.c11nEnv.setAction("onChange", this.changeHandler);
        this.c11nEnv.setAction("onBlur", this.eventHandler);
      }
    }

    // Using separate handle for change as in case of dropdown, native click is mapped to react change
    changeHandler(event) {
      this.actionsAPI.changeHandler(this.c11nEnv, event);
      //      getActionProcessor().changeHandler(this.c11nEnv, event);
    }

    eventHandler(event) {
      this.actionsAPI.eventHandler(this.c11nEnv, event);
      //      getActionProcessor().eventHandler(this.c11nEnv, event);
    }

    addChildren(child) {
      this.configProps.children.push(createElement(createPConnectComponent(), child));
    }

    /* This should be called only once per component instance
     *  this.props.__internal is to have info like propertiesMap, isExpressionExist, isWhenExist
     *  which would be used to call redux connect for re-render purpose on state change
     */
    initialize() {
      const { getPConnect } = this.props;
      this.c11nEnv = getPConnect();
      this.configProps = {};
      this.eventHandler = this.eventHandler.bind(this);
      this.changeHandler = this.changeHandler.bind(this);
      this.processActions(this.c11nEnv);
      this.propsToChild = {};

      this.configProps.children = [];

      if (this.c11nEnv.hasChildren()) {
        const children = this.c11nEnv.getChildren() || [];
        children.forEach((child) => this.addChildren(child));
        this.configProps.children = Children.toArray(
          this.configProps.children
        );
      }
    }

    render() {
      const { hasError } = this.state;
      const {
        getPConnect,
        visibility,
        additionalProps,
        ...otherProps
      } = this.props;

      if (visibility === false) {
        return null;
      }
      if (hasError) {
        // You can render any custom fallback UI
        // console.log(`react_pconnect error: used to return: <ErrorBoundary getPConnect={() => this.c11nEnv} isInternalError />`);
        return <ErrorBoundary getPConnect={() => this.c11nEnv} isInternalError />;
      }

      const props = this.c11nEnv.getConfigProps();
      const actions = this.c11nEnv.getActions();
      const finalProps = {
        ...props,
        getPConnect,
        ...this.configProps,
        ...actions,
        additionalProps,
        ...otherProps
      };

      // console.log(`react_pconnect: used to return: <this.Control {...finalProps} />`);

      return <this.Control {...finalProps} />;
    }
  }

  // eslint-disable-next-line react/static-property-placement
  PConnect.propTypes = {
    // __internal: PropTypes.object.isRequired,
    // meta: PropTypes.object.isRequired,
    // configObject: PropTypes.object.isRequired,
    getPConnect: PropTypes.func.isRequired,
    visibility: PropTypes.bool/* .isRequired */,
    additionalProps: PropTypes.shape({
      noLabel: PropTypes.bool,
      readOnly: PropTypes.bool
    }),
    validatemessage: PropTypes.string
  };

  // eslint-disable-next-line react/static-property-placement
  PConnect.defaultProps = {
    additionalProps: {},
    validatemessage: ""
  };

  return PConnect;
};


// Move these into SdkConstellationReady so PCore is available
document.addEventListener("SdkConstellationReady", () => {

  // eslint-disable-next-line no-undef
  PCore.registerComponentCreator((c11nEnv, additionalProps = {}) => {
    const PConnectComp = createPConnectComponent();
    return (
        <PConnectComp {
          ...{
            ...c11nEnv,
            ...c11nEnv.getPConnect().getConfigProps(),
            ...c11nEnv.getPConnect().getActions(),
            additionalProps
          }}
        />
      );
  });

  // eslint-disable-next-line no-undef
  PCore.getAssetLoader().register(
    "component-loader",
    async (componentNames = []) => {
      const promises = [];
      componentNames.forEach((comp) => {
        if (/^[A-Z]/.test(comp) && !LazyComponentMap[comp]) {
          if (!ComponentMap[comp]) {
            // eslint-disable-next-line no-undef
            const srcUrl = `${PCore.getAssetLoader().getConstellationServiceUrl()}/v860/${PCore.getAssetLoader().getAppAlias()}/component/${comp}.js`;
            // eslint-disable-next-line no-undef
            promises.push(PCore.getAssetLoader().getLoader()(srcUrl, "script"));
          } else {
            if (ComponentMap[comp].modules && ComponentMap[comp].modules.length) {
              ComponentMap[comp].modules.forEach((module) => {
                LazyComponentMap[comp] = module;
              });
            }
            if (ComponentMap[comp].scripts && ComponentMap[comp].scripts.length) {
              ComponentMap[comp].scripts.forEach((script) => {
                promises.push(
                  // eslint-disable-next-line no-undef
                  PCore.getAssetLoader().getLoader()(script, "script")
                );
              });
            }
          }
        }
      });
      /* Promise.all rejects or accepts all or none. This causes entire component loader to fail
      in case there is a single failure.
      Using allSettled to allow Promise to be resolved even if there are failed components
      Note : This is a liberty taken at component loader and unwise to be used at
      asset loader which will still use Promise.all
      */
      await Promise.allSettled(promises);
    }
  );
});

export default createPConnectComponent;

/* These APIs need to be exposed for authoring bridge
Will be removed when pxbootstrap and constellation_bridge is cleaned up
to use single bootstrap file from constellation  */
// window.authoringUtils = {
//   createElement,
//   render,
//   unmountComponentAtNode,
//   LazyComponentMap
// };
