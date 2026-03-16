import { useEffect, useState, useCallback } from 'react';
import Todo from '@pega/react-sdk-components/lib/components/widget/ToDo';
import { useTodoPortal } from '../../utils/TodoPortalContext';

interface TodoProps {
  getPConnect: () => typeof PConnect;
  caseInfoID?: string;
  datasource?: any;
  headerText?: string;
  itemKey?: string;
  showTodoList?: boolean;
  type?: string;
  context?: string;
  myWorkList?: any;
  isConfirm?: boolean;
}

const SURVEY_CLASSNAME = 'DIXL-MediaCo-Work-SatisfactionSurvey';

export default function MediaCoTodo(props: TodoProps) {
  const { getPConnect, datasource, myWorkList } = props;
  const pConn = getPConnect();
  const [isMyWorklistChecked, setIsMyWorklistChecked] = useState(false);
  const [surveyCase, setSurveyCase] = useState<any>(null);
  const { setSurveyCase: setPortalSurveyCase, clickGoRef } = useTodoPortal();

  const fetchMyWorkList = useCallback((): Promise<any> => {
    return PCore.getDataPageUtils().getDataAsync(
      'D_pyMyWorkList',
      pConn.getContextName(),
      {},
      {
        pageNumber: 1,
        pageSize: 10
      }
    );
  }, [pConn]);

  const surveyAssignment = useCallback((assignments: any[]) => {
    const [firstAssignment] = assignments || [];
    if (firstAssignment?.classname === SURVEY_CLASSNAME) {
      return firstAssignment;
    }
    return null;
  }, []);

  const updateToDo = useCallback(() => {
    const checked = !!(props as any)?.isMyWorklistChecked;
    setIsMyWorklistChecked(checked);

    if (!checked) return;

    // Determine assignments source
    const assignmentsSource = datasource?.source || myWorkList?.source;
    if (assignmentsSource) {
      const survey = surveyAssignment(assignmentsSource);
      setSurveyCase(survey);
    } else {
      fetchMyWorkList().then((response: any) => {
        const assignments = response?.data || [];
        const survey = surveyAssignment(assignments);
        setSurveyCase(survey);
      });
    }
  }, [pConn, datasource, myWorkList, fetchMyWorkList, surveyAssignment]);

  // Keep clickGoRef.current always pointing to the latest handler
  useEffect(() => {
    clickGoRef.current = () => {
      if (!surveyCase) return;
      const id = surveyCase.id || surveyCase.ID;
      let classname = surveyCase.classname || '';
      const sTarget = pConn.getContainerName();
      const options: any = { containerName: sTarget, channelName: '' };

      if (!classname) {
        classname = pConn.getCaseInfo().getClassName();
      }

      if (sTarget === 'workarea') {
        options.isActionFromToDoList = true;
        options.target = '';
        options.context = null;
        options.isChild = !!surveyCase.isChild;
      } else {
        options.isActionFromToDoList = false;
        options.target = sTarget;
      }

      pConn.getActionsApi().openAssignment(id, classname, options);
    };
  }, [surveyCase, pConn, clickGoRef]);

  // Subscribe to events that should refresh the todo
  useEffect(() => {
    updateToDo();

    const pubSub = PCore.getPubSubUtils();
    const events = PCore.getConstants().PUB_SUB_EVENTS;

    pubSub.subscribe(events.EVENT_CANCEL, () => updateToDo(), 'todoUpdateCancel');
    pubSub.subscribe('CREATE_STAGE_SAVED', () => updateToDo(), 'todoUpdateSaved');
    pubSub.subscribe('CREATE_STAGE_DELETED', () => updateToDo(), 'todoUpdateDeleted');

    return () => {
      pubSub.unsubscribe(events.EVENT_CANCEL, 'todoUpdateCancel');
      pubSub.unsubscribe('CREATE_STAGE_SAVED', 'todoUpdateSaved');
      pubSub.unsubscribe('CREATE_STAGE_DELETED', 'todoUpdateDeleted');
    };
  }, [updateToDo]);

  useEffect(() => {
    setPortalSurveyCase(surveyCase);
    return () => setPortalSurveyCase(null);
  }, [surveyCase, setPortalSurveyCase]);

  // If not worklist-checked, delegate to SDK Todo
  if (!isMyWorklistChecked) {
    return <Todo {...props} />;
  }

  return null;
}
