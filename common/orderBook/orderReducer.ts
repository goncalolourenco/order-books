import { normalize, schema } from 'normalizr';

export type Feed = string;
export type Products = string[];
export type Level = number[][];
export type LevelIds = number[];
export type LevelValues = { [key: number]: { price: number; size: number } };
export type LevelNormalized = {
  values: LevelValues;
  result: LevelIds;
  totalSize: number;
};
export type BookState = {
  numLevels?: number;
  feed: Feed;
  bids: LevelNormalized;
  asks: LevelNormalized;
  product_id: Products;
};
export type OrderUpdate = {
  feed: Feed;
  bids: Level;
  asks: Level;
  product_id: Products;
};
export type OrderSnapshot = OrderUpdate & { numLevels: number };

type BookAction =
  | { type: 'snapshot'; payload: OrderSnapshot }
  | { type: 'update'; payload: OrderUpdate };

type NormalizedOrderLevel = {
  entities: { values: { [key: number]: { price: number; size: number } } };
  result: number[];
};

function formatNormalizedLevel(
  normalizedData: NormalizedOrderLevel
): LevelNormalized {
  return {
    values: normalizedData.entities.values,
    result: normalizedData.result,
    totalSize: normalizedData.result.reduce((acc, levelPrice) => {
      const currentLevel = normalizedData.entities.values[levelPrice];
      const total = currentLevel.size + acc;

      return total;
    }, 0),
  };
}

const updateLevels = (
  levels: LevelNormalized,
  newPartialLevels: Level = []
): LevelNormalized => {
  let newLevels = { ...levels, values: { ...levels.values } };

  newPartialLevels.forEach(([partialPrice, partialSize]) => {
    const previousLevel = newLevels.values[partialPrice];
    const newLevel = {
      price: partialPrice,
      size: partialSize,
    };

    if (previousLevel) {
      // delete previous level
      if (newLevel.size === 0) {
        delete newLevels.values[newLevel.price];
        newLevels.totalSize = newLevels.totalSize - previousLevel.size;
        newLevels.result = newLevels.result.filter(
          (id) => id !== newLevel.price
        );
      }
      // update level
      else {
        newLevels.values[partialPrice] = newLevel;
        newLevels.totalSize =
          newLevels.totalSize + partialSize - previousLevel.size;
      }
      // add new level
    } else {
      if (newLevel.size === 0) return;

      newLevels.values[partialPrice] = newLevel;
      newLevels.result = [...newLevels.result, partialPrice];
      newLevels.totalSize += partialSize;
    }
  });

  return newLevels;
};

const OrdersValuesSchema = new schema.Entity(
  'values',
  {},
  {
    idAttribute: (_value, _parent, key) => _value[0],
    processStrategy: (_value, _parent, key) => ({
      price: _value[0],
      size: _value[1],
    }),
  }
);

const orderBookReducer = (state: BookState, action: BookAction): BookState => {
  switch (action.type) {
    case 'snapshot':
      const normalizedBids = normalize(action.payload.bids, [
        OrdersValuesSchema,
      ]);
      const normalizedAsks = normalize(action.payload.asks, [
        OrdersValuesSchema,
      ]);

      return {
        ...action.payload,
        bids: formatNormalizedLevel(normalizedBids as NormalizedOrderLevel),
        asks: formatNormalizedLevel(normalizedAsks as NormalizedOrderLevel),
      };
    case 'update':
      const { bids, asks } = action.payload;

      return {
        ...state,
        ...action.payload,
        bids:
          bids && bids.length > 0
            ? updateLevels(state?.bids, bids)
            : state?.bids,
        asks:
          asks && asks.length > 0
            ? updateLevels(state?.asks, asks)
            : state?.asks,
      };
    default:
      return state;
  }
};

export default orderBookReducer;
