import { useEffect, useState, useCallback } from 'react';
import { SdkComponentMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';

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

export default function Todo(props: TodoProps) {
  const { getPConnect } = props;
  const pConn = getPConnect();
  const [isMyWorklistChecked, setIsMyWorklistChecked] = useState(false);

  const updateToDo = useCallback(() => {
    const configProps: any = pConn.resolveConfigProps(pConn.getConfigProps());
    setIsMyWorklistChecked(!!configProps?.isMyWorklistChecked);
  }, [pConn]);

  useEffect(() => {
    updateToDo();

    PCore.getPubSubUtils().subscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, () => updateToDo(), 'updateToDo');

    return () => {
      PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'updateToDo');
    };
  }, [updateToDo]);

  // If not worklist-checked, delegate to OOTB Todo
  if (!isMyWorklistChecked) {
    const pegaMap = SdkComponentMap?.getPegaProvidedComponentMap?.();
    const OOTBTodo = pegaMap?.['Todo'];
    if (OOTBTodo) {
      return <OOTBTodo {...props} />;
    }
    return null;
  }

  return null;
}
