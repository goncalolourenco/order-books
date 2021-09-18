import {
  FunctionComponent,
  memo,
  MouseEventHandler,
  useMemo,
  useState,
} from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useStyles } from './OrderBook.styles';
import { BookState, LevelIds } from '../orderReducer';
import OrderBookLevels from '../OrderBookLevels/OrderBookLevels';
import colors from '../../theme/colors';
import {
  sortFunctions,
  getMax,
  applyThousandSeparator,
  SortDirection,
} from '../../utils';

type OrderBookProps = {
  orders: BookState;
  initialSortDirection?: SortDirection;
  thresholdPerLevel?: number;
};

const title = 'Order Books';
const getSortedLevels = (
  levels: LevelIds | undefined,
  sortDirection: SortDirection,
  threshold: number = 20
) =>
  levels ? levels.sort(sortFunctions[sortDirection]).slice(0, threshold) : [];

// const getTotalLevels = (ids: LevelIds, values: LevelValues) =>
//   ids.reduce((acc, levelPrice) => {
//     const currentLevel = values[levelPrice];
//     const total = currentLevel.size + acc;

//     return total;
//   }, 0);

// doubt if the total size needs to be only the ones being showed on screen
// const biggestLevelTotalSize = getMax(
//   getTotalLevels(sortedBidsIds, bids?.values),
//   getTotalLevels(sortedAsksIds, asks?.values)
// );

const OrderBook: FunctionComponent<OrderBookProps> = memo(
  ({ orders, initialSortDirection = 'ASC', thresholdPerLevel = 20 }) => {
    const [sortDirection, setSortDirection] =
      useState<SortDirection>(initialSortDirection);
    const theme = useTheme();
    const classes = useStyles();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const { bids, asks } = orders;

    const sortedBidsIds = useMemo(
      () => getSortedLevels(bids?.result, sortDirection, thresholdPerLevel),
      [bids?.result, sortDirection, thresholdPerLevel]
    );
    const sortedAsksIds = useMemo(
      () => getSortedLevels(asks?.result, sortDirection, thresholdPerLevel),
      [asks?.result, sortDirection, thresholdPerLevel]
    );

    const biggestLevelTotalSize = getMax(bids?.totalSize, asks?.totalSize);

    const handleChangeSortDirection: MouseEventHandler = () => {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    };

    const renderSpread = () => {
      const firstBidPrice = sortedBidsIds?.[0];
      const firstAskPrice = sortedAsksIds?.[0];
      const spread = firstBidPrice - firstAskPrice;
      const spreadPercentage = ((spread / firstBidPrice) * 100).toFixed(2);

      return (
        <div className={classes.spread}>
          {!isSmallScreen && <h3> {title} </h3>}
          {!!spread &&
            `Spread: ${applyThousandSeparator(spread.toFixed(1))} (
        ${spreadPercentage}%)`}
        </div>
      );
    };

    return (
      <div className={classes.container}>
        {isSmallScreen ? (
          <div className={classes.header}>
            <h3> {title} </h3>
          </div>
        ) : (
          renderSpread()
        )}
        <div className={classes.levelsContainer}>
          <OrderBookLevels
            levelsIds={sortedAsksIds}
            levelValues={asks?.values}
            totalLevelsSize={biggestLevelTotalSize}
            progressBarColorCompleted={colors.greens[100]}
            progressBarDirection={isSmallScreen ? 'ltr' : 'rtl'}
            priceColumnColor={colors.greens[200]}
            sortDirection={sortDirection}
            onChangeSort={handleChangeSortDirection}
          />
          {isSmallScreen && renderSpread()}
          <OrderBookLevels
            levelsIds={sortedBidsIds}
            levelValues={bids?.values}
            totalLevelsSize={biggestLevelTotalSize}
            progressBarColorCompleted={colors.reds[100]}
            progressBarDirection="ltr"
            priceColumnColor={colors.reds[200]}
            sortDirection={sortDirection}
            onChangeSort={handleChangeSortDirection}
          />
        </div>
      </div>
    );
  }
);

export default OrderBook;
