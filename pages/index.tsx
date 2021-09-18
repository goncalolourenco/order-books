import type { NextPage } from 'next';
import Head from 'next/head';
import { MouseEventHandler, useState } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';

import styles from '../styles/Home.module.css';
import { useBookSubscribe } from '../common/orderBook/hooks';
import OrderBook from '../common/orderBook/OrderBook/OrderBook';

export const useStyles = makeStyles({
  toggleSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px',
    marginTop: '5px',
  },
});

const PRODUCTS = {
  PI_XBTUSD: 'PI_XBTUSD',
  PI_ETHUSD: 'PI_ETHUSD',
};

const OrdersHome: NextPage = () => {
  const classes = useStyles();
  const [products, setProducts] = useState([PRODUCTS.PI_XBTUSD]);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const { bookState, subscribe } = useBookSubscribe('book_ui_1', products, {
    unsubscribeOnUnfocus: false,
    onLoseFocus: () => {
      setNotificationOpen(true);
    },
  });

  const closeNotification = () => {
    if (isNotificationOpen) {
      setNotificationOpen(false);
    }
  };

  const handleToggleProduct: MouseEventHandler = () => {
    const newProduct = products.includes(PRODUCTS.PI_XBTUSD)
      ? [PRODUCTS.PI_ETHUSD]
      : [PRODUCTS.PI_XBTUSD];

    setProducts(newProduct);
    closeNotification();
  };

  const handleReconnect: MouseEventHandler = () => {
    subscribe();
    closeNotification();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Order book app</title>
        <meta name="description" content="app with an order book" />
      </Head>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={isNotificationOpen}
        message="To reconnect order books, please click the reconnect button below or just toggle feed in the main screen."
        action={
          <Button
            size="small"
            aria-label="reconnect"
            color="inherit"
            onClick={handleReconnect}
          >
            Reconnect
          </Button>
        }
      />

      <main>
        {bookState && (
          <>
            <OrderBook orders={bookState} />
            <div className={classes.toggleSection}>
              <Button variant="outlined" onClick={handleToggleProduct}>
                Toggle feed
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default OrdersHome;
