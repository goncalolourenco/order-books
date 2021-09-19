import { FunctionComponent, memo, MouseEventHandler } from 'react';
import ProgressBar from '@ramonak/react-progress-bar';
import { useStyles } from './OrderBookLevels.styles';
import { LevelIds, LevelValues } from '../orderReducer';
import OrderBookLevelValues from './OrderBookLevelValues';
import { SortDirection } from '../../utils';

type OrderLevelsProps = {
  levelsIds: LevelIds;
  levelValues: LevelValues;
  progressBarDirection?: 'rtl' | 'ltr';
  totalLevelsSize: number;
  progressBarColorCompleted?: string;
  progressBarColorNonCompleted?: string;
  priceColumnColor?: string;
  onChangeSort?: MouseEventHandler;
  sortDirection: SortDirection;
};

const OrderBookLevels: FunctionComponent<OrderLevelsProps> = memo(
  ({
    levelsIds,
    levelValues,
    totalLevelsSize,
    progressBarDirection = 'ltr',
    progressBarColorCompleted = 'red',
    progressBarColorNonCompleted = '#0a1929',
    priceColumnColor = 'white',
    sortDirection,
    onChangeSort,
  }) => {
    let accumulateLevelTotal = 0;
    const classes = useStyles({ progressBarDirection });
    const classSort = sortDirection === 'ASC' ? classes.sortAsc : classes.sortDesc;

    return (
      <div role="table" className={classes.root}>
        <div
          role="row"
          className={classes.orderHeader}
          style={{
            direction: progressBarDirection,
          }}
        >
          <span role="columnheader" className={`${classes.orderItemValue} ${classSort}`} onClick={onChangeSort}>
            Price
          </span>
          <span role="columnheader" className={classes.orderItemValue}>
            Size
          </span>
          <span role="columnheader" className={classes.orderItemValue}>
            Total
          </span>
        </div>

        {levelsIds &&
          levelsIds.map((levelPrice) => {
            const { price, size } = levelValues[levelPrice] || {};
            accumulateLevelTotal = accumulateLevelTotal + size;
            const percentageCompleted = (accumulateLevelTotal / totalLevelsSize) * 100;

            return (
              !!price && (
                <div
                  role="row"
                  className={classes.orderItemRow}
                  key={price}
                  style={{ direction: progressBarDirection }}
                >
                  <OrderBookLevelValues
                    className={classes.orderItemValue}
                    price={price}
                    size={size}
                    levelTotal={accumulateLevelTotal}
                    priceColumnColor={priceColumnColor}
                  />
                  <ProgressBar
                    className={classes.progressBar}
                    completed={percentageCompleted}
                    height="100%"
                    borderRadius="0px"
                    bgColor={progressBarColorCompleted}
                    baseBgColor={progressBarColorNonCompleted}
                    isLabelVisible={false}
                    dir={progressBarDirection}
                  />
                </div>
              )
            );
          })}
      </div>
    );
  }
);

export default OrderBookLevels;
