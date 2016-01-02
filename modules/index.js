export const type = '@@redux-batch-middleware/BATCH';

export const batch = ({ dispatch }) => {
    return (next) => (action) => {
        Array.isArray(action)
            ? dispatch({ type: type, payload: action })
            : next(action);
    };
};

export const batching = (reducer) => {
    return function batcher(state, action) {
        return action.type === type
            ? action.payload.reduce(batcher, state)
            : reducer(state, action);
    };
};
