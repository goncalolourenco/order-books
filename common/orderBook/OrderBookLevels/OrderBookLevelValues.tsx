import { FunctionComponent, memo } from 'react';
import { applyThousandSeparator } from '../../utils';

type OrderBookLevelValuesProps = {
  className?: string;
  price: number;
  size: number;
  levelTotal: number;
  priceColumnColor?: string;
};

const OrderBookLevelValues: FunctionComponent<OrderBookLevelValuesProps> = memo(
  ({ className, price, size, levelTotal, priceColumnColor }) => {
    return (
      <>
        <span className={className} style={{ color: priceColumnColor }}>
          {applyThousandSeparator(price)}
        </span>
        <span className={className}>{applyThousandSeparator(size)}</span>
        <span className={className}>{applyThousandSeparator(levelTotal)}</span>
      </>
    );
  }
);

export default OrderBookLevelValues;
