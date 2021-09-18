import { useEffect, useReducer, useContext, useMemo } from 'react';
import {
  WebSocketContext,
  useSubscribe,
  SubscriptionOptions,
  SubscriptionResponse,
} from '../Websocket';
import { useThrottle, useHardwareConcurrency } from '../utils';
import { getThrottleBasedOnCPUS } from './orderBookUtils';
import orderBookReducer, {
  BookState,
  Feed,
  Products,
  OrderUpdate,
  OrderSnapshot,
} from './orderReducer';

type SubscribeBookPayload = {
  feed: Feed;
  product_ids: Products;
};

type BookSubscriptionResponse = {
  bookState: BookState;
} & SubscriptionResponse;

const defaultTime = 200;

export function useBookSubscribe(
  feed: Feed,
  productIds: Products,
  subscriptionOptions?: SubscriptionOptions
): BookSubscriptionResponse {
  if (!feed || !productIds)
    throw 'Please provide needed properties for book subscription';

  const socket = useContext(WebSocketContext);
  const [bookState, dispatch] = useReducer(orderBookReducer, null);
  const { numberOfLogicalProcessors, unsupported } = useHardwareConcurrency();
  const throttleTime = unsupported
    ? defaultTime
    : getThrottleBasedOnCPUS(numberOfLogicalProcessors);
  const bookThrottledState = useThrottle<BookState>(bookState, throttleTime);

  const jsonPayload: SubscribeBookPayload = useMemo(
    () => ({ feed, product_ids: productIds }),
    [feed, productIds]
  );

  useEffect(() => {
    if (socket) {
      const handleBookChanges = (message: MessageEvent<string>) => {
        const { data } = message;
        const bookData = JSON.parse(data);

        // only take care of the messages that are important for this subscription
        if (bookData?.feed === jsonPayload.feed) {
          dispatch({ type: 'update', payload: bookData as OrderUpdate });
        } else if (bookData?.feed === `${jsonPayload.feed}_snapshot`) {
          dispatch({ type: 'snapshot', payload: bookData as OrderSnapshot });
        } else {
          console.warn('message not known');
        }
      };

      socket.addEventListener('message', handleBookChanges);

      return () => {
        socket.removeEventListener('message', handleBookChanges);
      };
    }
  }, [socket, jsonPayload]);

  const { subscribe, unsubscribe } = useSubscribe<SubscribeBookPayload>(
    jsonPayload,
    subscriptionOptions
  );

  return { bookState: bookThrottledState, subscribe, unsubscribe };
}
