import { useEffect, useRef, useState, type FormEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
import SdkGenAICoach from '@pega/react-sdk-components/lib/components/widget/GenAICoach';
import useGenAICoachObj from '@pega/react-sdk-components/lib/hooks/useGenAICoachObj';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';

import { localize, useCockpit } from '../../context/CockpitContext';

interface GenAICoachProps {
  getPConnect: () => typeof PConnect;
  coaches?: any[];
  isPortalAgent?: boolean;
}

// Same context ID rules as the SDK GenAICoach for a landing page (non-portal) agent.
function getContextID(pConn: typeof PConnect) {
  let classID: string = pConn.getValue('pyPortal.classID') ?? '';
  if (PCore.isNamespaceEnabled() && classID) {
    const namespaces: string[] = (PCore.getEnvironmentInfo()?.getFeatureMap() as any)?.namespaceList ?? [];
    const match = namespaces.find(ns => classID.startsWith(`${ns}__`));
    if (match) classID = classID.slice(match.length + 2);
  }
  return `${classID}!PAGE!${pConn.getCurrentView()}`.toUpperCase();
}

let messageCounter = 0;
const nextMessageId = () => {
  messageCounter += 1;
  return `ck-msg-${Date.now()}-${messageCounter}`;
};

export default function CockpitGenAICoach(props: GenAICoachProps) {
  const { enabled } = useCockpit();
  const { getPConnect, isPortalAgent } = props;
  const pConn = getPConnect();
  const isLandingPage = !pConn.getCaseSummary().ID && !pConn.getValue(PCore.getConstants().DATA_INFO.DATA_INFO_CONTENT);

  // The Cockpit AI box replaces the coach on the Cockpit landing page only.
  if (!enabled || isPortalAgent || !isLandingPage) {
    return <SdkGenAICoach {...(props as any)} />;
  }

  return <CockpitAIBox {...props} />;
}

function CockpitAIBox({ getPConnect, coaches = [] }: GenAICoachProps) {
  const GenAIMessage = getComponentFromMap('GenAIMessage');
  const pConn = getPConnect();
  const isInfinityRuntime = !!(PCore.getEnvironmentInfo() as any).isInfinityRuntime?.();
  const coach: any = useGenAICoachObj(isInfinityRuntime ? coaches : undefined, getContextID(pConn), pConn, false, false);
  const [draft, setDraft] = useState('');
  const conversationEnd = useRef<HTMLLIElement>(null);
  const opened = useRef(false);

  const agentName = coaches[0]?.config?.coach?.label ?? localize('AI assistant');
  const messages: any[] = coach?.messages ?? [];
  const latest = messages[messages.length - 1];
  const isResponding = latest?.from === 'coach' && (latest.loading || (latest.enableStreaming && !latest.allChunksReceived));

  useEffect(() => {
    // Like the SDK coach panel: opening starts the conversation, which also loads the suggested questions.
    if (coach?.onOpen && !opened.current) {
      opened.current = true;
      coach.onOpen();
    }
  }, [coach?.onOpen]);

  useEffect(() => {
    conversationEnd.current?.scrollIntoView({ block: 'nearest' });
  }, [messages.length, latest?.message]);

  useEffect(() => {
    if (coach?.draftMessage) setDraft(coach.draftMessage);
  }, [coach?.draftMessage]);

  if (!coach) return null;

  const send = (message: string, fromComposer: boolean) => {
    const text = message.trim();
    if (!text || isResponding) return;
    coach.onSend({ id: nextMessageId(), message: text, fromComposer });
    setDraft('');
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    send(draft, true);
  };

  const suggestions: any[] = messages.length === 0 ? (coach.initialSuggestedMessages ?? []) : [];

  return (
    <div className='ck-ai'>
      {suggestions.length > 0 && (
        <div className='ck-ai-suggestions'>
          <span className='ck-ai-suggestions-label'>{localize('Try asking')}</span>
          {suggestions.map(suggestion => (
            <button key={suggestion.id} type='button' className='ck-chip' onClick={() => send(suggestion.message, false)}>
              {suggestion.message}
            </button>
          ))}
        </div>
      )}

      {messages.length > 0 && (
        <div className='ck-ai-conversation' aria-live='polite'>
          <div className='ck-ai-conversation-header'>
            <span>{agentName}</span>
            {coach.onNewChat && (
              <button type='button' className='ck-link-button' onClick={coach.onNewChat}>
                {localize('New chat')}
              </button>
            )}
          </div>
          <ul aria-label={localize('Conversation')}>
            {messages.map((item, index) => (
              <GenAIMessage
                key={item.id || `message-${index}`}
                {...item}
                {...(item.from === 'coach' ? { suggestions: item === latest ? item.suggestions : undefined, onSend: coach.onSend } : {})}
              />
            ))}
            <li ref={conversationEnd} aria-hidden />
          </ul>
        </div>
      )}

      {(coach.error || coach.conversationError) && (
        <div className='ck-ai-status' role='alert'>
          {coach.error || coach.conversationError}
        </div>
      )}

      <form className='ck-ai-composer' onSubmit={onSubmit}>
        <span className='ck-ai-badge'>
          <AutoAwesomeIcon />
          {localize('AI')}
        </span>
        <input
          value={draft}
          onChange={event => setDraft(event.target.value)}
          placeholder={coach.loading ? localize('Connecting…') : localize('Ask a question about your spend, suppliers, contracts, or tasks...')}
          aria-label={localize('Ask a question')}
          disabled={!!coach.loading}
        />
        {isResponding && coach.onStop ? (
          <IconButton type='button' aria-label={localize('Stop')} onClick={coach.onStop}>
            <StopIcon fontSize='small' />
          </IconButton>
        ) : (
          <IconButton type='submit' aria-label={localize('Send question')} disabled={!draft.trim() || !!coach.loading}>
            <SendIcon fontSize='small' />
          </IconButton>
        )}
      </form>

      <div className='ck-ai-meta'>
        {localize('Connected to')} <strong>{agentName}</strong>
      </div>
    </div>
  );
}
