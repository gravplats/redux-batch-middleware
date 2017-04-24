import { isFSA } from 'flux-standard-action';

export const type = '@@redux-batch-middleware/BATCH';

export const batch = ({ dispatch }) => (next) => (action) =>
  Array.isArray(action)
    ? action.every(isFSA)
      ? dispatch({ type: type, payload: action })
      : action.filter(Boolean).map(dispatch)
    : next(action);

export const batching = (reducer) => {
    return function batcher(state, action) {
        return action.type === type
            ? action.payload.reduce(batcher, state)
            : reducer(state, action);
    };
};
