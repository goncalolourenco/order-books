import React, {
  createContext,
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import { useFocus } from './utils';

type ProviderProps = {
  children: ReactNode;
  socketUrl: string;
};

type SocketIo = WebSocket | null;

export const WebSocketContext = createContext<SocketIo>(null);

const WebSocketProvider: FunctionComponent<ProviderProps> = ({
  children,
  socketUrl,
}) => {
  const [socket, setSocket] = useState<SocketIo>(null);

  useEffect(() => {
    const ws = new WebSocket(socketUrl);
    ws.onopen = () => setSocket(ws);

    return () => {
      if (ws.readyState === 1) ws.close();
    };
  }, [socketUrl]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;

export function useSendMessage<SendPayload>() {
  const socket = useContext(WebSocketContext);

  const sendMessage = useCallback(
    (jsonPayload: SendPayload) => {
      if (socket && socket.readyState === 1) {
        const payload: string = JSON.stringify(jsonPayload);
        socket.send(payload);
      }
    },
    [socket]
  );

  return sendMessage;
}

export type SubscriptionOptions = {
  unsubscribeOnUnfocus?: boolean;
  onLoseFocus?: () => void;
};

export type SubscriptionResponse = {
  subscribe: () => void;
  unsubscribe: () => void;
};

export function useSubscribe<SubscriptionPayload>(
  subscriptionPayload: SubscriptionPayload,
  options: SubscriptionOptions = {
    unsubscribeOnUnfocus: true,
  }
): SubscriptionResponse {
  const sendWsMessage = useSendMessage<
    SubscriptionPayload & { event: string }
  >();
  const isTabFocused = useFocus();
  const { unsubscribeOnUnfocus, onLoseFocus } = options;

  const subscribe = () => {
    sendWsMessage({ ...subscriptionPayload, event: 'subscribe' });
  };
  const unsubscribe = () => {
    sendWsMessage({ ...subscriptionPayload, event: 'unsubscribe' });
  };

  useEffect(() => {
    subscribe();

    return unsubscribe;
  }, [subscriptionPayload, sendWsMessage]);

  useEffect(() => {
    if (unsubscribeOnUnfocus && !isTabFocused) {
      unsubscribe();

      if (onLoseFocus) onLoseFocus();
    }
  }, [isTabFocused, unsubscribeOnUnfocus]);

  return {
    subscribe,
    unsubscribe,
  };
}
