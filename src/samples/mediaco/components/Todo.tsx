import { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getImageSrc } from '../utils/helpers';
import { usePortal } from '../context/PortalContext';
import { fetchMyWorkList } from '../utils/helpers';
import { SdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';

interface TodoProps {
  getPConnect: () => typeof PConnect;
  caseInfoID?: string;
  datasource?: any;
  headerText?: string;
  showTodoList?: boolean;
  target?: string;
  type?: string;
  context?: string;
  myWorkList?: any;
  isConfirm?: boolean;
}

export default function Todo(props: TodoProps) {
  const {
  getPConnect,
  caseInfoID,
  datasource: datasourceProp,
  headerText: headerTextProp,
  showTodoList = true,
  context: contextProp,
  myWorkList: myWorkListProp,
  isConfirm
} = props;
  const pConn = getPConnect();
  const [surveyCase, setSurveyCase] = useState<any>(null);
  const [arAssignments, setArAssignments] = useState<any[]>([]);
  const [isMyWorklistChecked, setIsMyWorklistChecked] = useState(false);
  const { portalContent, setPortalContent, clearPortal } = usePortal();

  const img = getImageSrc('message-circle');

  const updateList = useCallback(() => {
    const {
      WORK_BASKET: {
        DATA_PAGES: { D__PY_MY_WORK_LIST }
      }
    } = PCore.getConstants() as any;
    const mappedValue = PCore.getEnvironmentInfo().getKeyMapping(D__PY_MY_WORK_LIST);
    const dp = mappedValue === null ? D__PY_MY_WORK_LIST : mappedValue;
    // Trigger worklist update
    try {
      PCore.getDataPageUtils().getDataAsync(dp, pConn.getContextName(), {}, {}, {}, { invalidateCache: true });
    } catch {
      // silently fail
    }
  }, [pConn]);

  const clickGo = useCallback(
    (assignment: any) => {
      const id = assignment.ID || assignment.id;
      let classname = assignment.classname || '';
      const sTarget = pConn.getContainerName();
      const options: any = { containerName: sTarget, channelName: '' };

      if (!classname) {
        classname = pConn.getCaseInfo().getClassName();
      }

      if (sTarget === 'workarea') {
        options.isActionFromToDoList = true;
        options.target = '';
        options.context = null;
        options.isChild = assignment.isChild;
      } else {
        options.isActionFromToDoList = false;
        options.target = sTarget;
      }

      pConn
        .getActionsApi()
        .openAssignment(id, classname, options)
        .then(() => console.log('openAssignment completed'))
        .catch(() => console.error('Failed to open assignment'));
    },
    [pConn]
  );

  const updateToDo = useCallback(() => {
    const configProps: any = pConn.resolveConfigProps(pConn.getConfigProps());
    setIsMyWorklistChecked(!!configProps?.isMyWorklistChecked);

    const localHeaderText = headerTextProp || configProps?.headerText;
    const localDatasource = datasourceProp || configProps?.datasource;
    const localMyWorkList = myWorkListProp || configProps?.myWorkList;
    const assignmentsSource = localDatasource?.source || localMyWorkList?.source;

    if (showTodoList) {
      if (assignmentsSource) {
        // Look for survey case
        const [first] = assignmentsSource || [];
        if (first?.classname === 'DIXL-MediaCo-Work-SatisfactionSurvey') {
          setSurveyCase(first);
        } else {
          setSurveyCase(null);
        }
      } else if (localMyWorkList?.datapage) {
        const fields = pConn.getComponentConfig()?.myWorkList?.fields;
        fetchMyWorkList(localMyWorkList.datapage, fields, 3, true, contextProp || '').then((responseData: any) => {
          setArAssignments(responseData.data);
          const [first] = responseData.data || [];
          if (first?.classname === 'DIXL-MediaCo-Work-SatisfactionSurvey') {
            setSurveyCase(first);
          } else {
            setSurveyCase(null);
          }
        });
      } else {
        setArAssignments([]);
        setSurveyCase(null);
      }
    } else if (caseInfoID && assignmentsSource) {
      const result = assignmentsSource
        .filter((s: any) => s.ID?.indexOf(caseInfoID) >= 0)
        .map((s: any) => ({ ...s, priority: s.urgency, id: s.ID }));
      setArAssignments(result);
    }
  }, [pConn, headerTextProp, datasourceProp, myWorkListProp, showTodoList, caseInfoID, contextProp]);

  // Set up the portal content for the survey banner
  useEffect(() => {
    if (surveyCase) {
      setPortalContent(
        <Box
          sx={{
            width: 670,
            background: 'linear-gradient(135deg, rgb(103,80,164) 0%, rgb(248,20,227) 50%, rgb(0,201,255) 100%) 0% 0% / 200% 200%',
            borderRadius: '24px',
            p: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            color: '#fff',
            boxShadow: '0 8px 20px rgba(94,75,159,0.25)',
            '@media (max-width: 768px)': { flexDirection: 'column', textAlign: 'center', p: '32px 24px' }
          }}
        >
          <Box sx={{ flexShrink: 0 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)'
              }}
            >
              <Box component='img' src={img} sx={{ height: 35, filter: 'brightness(0) saturate(100%) invert(100%)' }} />
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography sx={{ m: '0 0 6px 0', fontSize: 22, fontWeight: 400 }}>Share Your Experience</Typography>
            <Typography sx={{ m: 0, fontSize: 15, opacity: 0.9, fontWeight: 400, lineHeight: 1.4 }}>
              Take a quick survey about your recent experience with MediaCo.
            </Typography>
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <Box
              component='button'
              onClick={() => clickGo(surveyCase)}
              sx={{
                backgroundColor: '#fff',
                color: '#5c4498',
                border: 'none',
                p: '12px 28px',
                borderRadius: '50px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: 14,
                fontWeight: 500,
                lineHeight: '20px'
              }}
            >
              Start
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>
        </Box>
      );
    } else {
      clearPortal();
    }
    return () => clearPortal();
  }, [surveyCase, clickGo, img, setPortalContent, clearPortal]);

  // Init and subscribe to events
  useEffect(() => {
    updateToDo();

    const { CREATE_STAGE_SAVED, CREATE_STAGE_DELETED } = PCore.getEvents().getCaseEvent();
    PCore.getPubSubUtils().subscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, () => updateToDo(), 'updateToDo');
    PCore.getPubSubUtils().subscribe(CREATE_STAGE_SAVED, () => updateList(), CREATE_STAGE_SAVED);
    PCore.getPubSubUtils().subscribe(CREATE_STAGE_DELETED, () => updateList(), CREATE_STAGE_DELETED);

    return () => {
      const { CREATE_STAGE_SAVED: saved, CREATE_STAGE_DELETED: deleted } = PCore.getEvents().getCaseEvent();
      PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'updateToDo');
      PCore.getPubSubUtils().unsubscribe(saved, saved);
      PCore.getPubSubUtils().unsubscribe(deleted, deleted);
    };
  }, [updateToDo, updateList]);

  // If isMyWorklistChecked, render nothing (OOTB Todo handles it)
  if (!isMyWorklistChecked) {
    const pegaMap = SdkComponentMap?.getPegaProvidedComponentMap?.();
        const OOTBTodo = pegaMap?.['Todo'];
        if (OOTBTodo) {
          return <OOTBTodo {...props} />;
        }
        return null;
  }

  // The main rendering is handled by the portal content being projected to the Banner.
  // This component primarily manages the data and portal projection.
  return null;
}
