import { Link } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

import semanticUtils from './utils';

// eslint-disable-next-line
const useStyles = makeStyles(theme => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  fieldMargin: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  fieldLabel: {
    fontWeight: 400,
    color: theme.palette.text.secondary
  },
  fieldValue: {
    fontWeight: 400,
    color: theme.palette.text.primary
  }
}));

interface SemanticLinkProps extends PConnFieldProps {
  // If any, enter additional props that only exist on SemanticLink here
  text: string;
  resourcePayload: any;
  resourceParams: any;
  previewKey: string | null;
  onClick: (event: any) => void;
  testId: string;
  referenceType: string | null;
  dataRelationshipContext: string | null;
  contextPage: any;
}

export default function SemanticLink(props: SemanticLinkProps) {
  const {
    text,
    resourcePayload = {},
    resourceParams = {},
    getPConnect,
    previewKey,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onClick,
    testId = '',
    referenceType,
    dataRelationshipContext = null,
    contextPage,
    ...restProps
  } = props;
  const { ACTION_OPENWORKBYHANDLE, ACTION_SHOWDATA }: any = PCore.getSemanticUrlUtils().getActions();
  const pConnect = getPConnect();
  const dataResourcePayLoad = resourcePayload?.resourceType === 'DATA' ? resourcePayload : null;

  const {
    RESOURCE_TYPES: { DATA },
    WORKCLASS,
    CASE_INFO: { CASE_INFO_CLASSID }
  } = PCore.getConstants();

  let linkURL = '';
  let payload = {};
  let dataViewName;
  let linkComponentProps = {
    href: linkURL
  };
  if (text) {
    (linkComponentProps as any).href = linkURL;
  }
  let isData = false;
  const shouldTreatAsDataReference = !previewKey && resourcePayload.caseClassName;
  if (contextPage?.classID) {
    resourcePayload.caseClassName = contextPage.classID;
  }
  /* TODO : In case of duplicate search case the classID is Work- need to set it to
  the current case class ID */
  if (resourcePayload.caseClassName === WORKCLASS) {
    resourcePayload.caseClassName = pConnect.getValue(CASE_INFO_CLASSID);
  }

  function showDataAction() {
    if (dataResourcePayLoad && dataResourcePayLoad.resourceType === 'DATA') {
      const { content } = dataResourcePayLoad;
      const lookUpDataPageInfo = PCore.getDataTypeUtils().getLookUpDataPageInfo(dataResourcePayLoad?.className);
      const lookUpDataPage = PCore.getDataTypeUtils().getLookUpDataPage(dataResourcePayLoad?.className);
      if (lookUpDataPageInfo) {
        const { parameters }: any = lookUpDataPageInfo;
        payload = Object.keys(parameters).reduce((acc, param) => {
          const paramValue = parameters[param];
          return {
            ...acc,
            [param]: PCore.getAnnotationUtils().isProperty(paramValue) ? content[PCore.getAnnotationUtils().getPropertyName(paramValue)] : paramValue
          };
        }, {});
      }
      getPConnect()
        .getActionsApi()
        .showData('pyDetails', lookUpDataPage, {
          ...payload
        });
    }
    if ((referenceType && referenceType.toUpperCase() === DATA) || shouldTreatAsDataReference) {
      getPConnect()
        .getActionsApi()
        .showData('pyDetails', dataViewName, {
          ...payload
        });
    }
  }

  function openLinkClick(e) {
    if (!e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      if (
        (dataResourcePayLoad && dataResourcePayLoad.resourceType === 'DATA') ||
        (referenceType && referenceType.toUpperCase() === DATA) ||
        shouldTreatAsDataReference
      ) {
        showDataAction();
      } else if (previewKey) {
        getPConnect().getActionsApi().openWorkByHandle(previewKey, resourcePayload.caseClassName);
      }
    }
  }

  if ((referenceType && referenceType.toUpperCase() === DATA) || shouldTreatAsDataReference) {
    try {
      isData = true;
      // @ts-expect-error
      const dataRefContext = semanticUtils.getDataReferenceInfo(pConnect, dataRelationshipContext, contextPage);
      dataViewName = dataRefContext.dataContext;
      payload = dataRefContext.dataContextParameters as any;
    } catch (error) {
      console.log('Error in getting the data reference info', error);
    }
  } else if (resourcePayload && resourcePayload.resourceType === 'DATA') {
    isData = true;
    dataViewName = PCore.getDataTypeUtils().getLookUpDataPage(resourcePayload.className);
    const lookUpDataPageInfo = PCore.getDataTypeUtils().getLookUpDataPageInfo(resourcePayload.className);
    const { content } = resourcePayload;
    if (lookUpDataPageInfo) {
      const { parameters }: any = lookUpDataPageInfo;
      payload = Object.keys(parameters).reduce((acc, param) => {
        const paramValue = parameters[param];
        return {
          ...acc,
          [param]: PCore.getAnnotationUtils().isProperty(paramValue) ? content[PCore.getAnnotationUtils().getPropertyName(paramValue)] : paramValue
        };
      }, {});
    } else {
      const keysInfo = PCore.getDataTypeUtils().getDataPageKeys(dataViewName) ?? [];
      payload = keysInfo.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.keyName]: content[curr.isAlternateKeyStorage ? curr.linkedField : curr.keyName]
        };
      }, {});
    }
  }

  if (isData && dataViewName && payload) {
    linkURL = PCore.getSemanticUrlUtils().getResolvedSemanticURL(
      ACTION_SHOWDATA,
      { pageName: 'pyDetails', dataViewName },
      {
        ...payload
      }
    );
  } else {
    // BUG-678282 fix to handle scenario when workID was not populated.
    // Check renderParentLink in Caseview / CasePreview
    resourceParams.objectID = resourceParams.workID === '' && typeof previewKey === 'string' ? previewKey.split(' ')[1] : resourceParams.workID;
    if (previewKey) {
      resourceParams.id = previewKey;
    }
    linkURL = PCore.getSemanticUrlUtils().getResolvedSemanticURL(ACTION_OPENWORKBYHANDLE, resourcePayload, resourceParams);
  }

  if (text) {
    linkComponentProps = {
      ...linkComponentProps,
      href: linkURL
    };
  }

  return (
    <Link component='button' {...linkComponentProps} {...restProps} onClick={openLinkClick} data-testid={testId}>
      {text || '--'}
    </Link>
  );
}
