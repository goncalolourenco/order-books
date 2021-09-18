import '../styles/globals.css';
import type { AppProps } from 'next/app';
import WebSocketProvider from '../common/Websocket';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WebSocketProvider socketUrl="wss://www.cryptofacilities.com/ws/v1">
      <Component {...pageProps} />
    </WebSocketProvider>
  );
}
export default MyApp;
