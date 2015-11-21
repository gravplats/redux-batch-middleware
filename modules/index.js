const BatchActionType = '@@redux-batch-middleware/BATCH';


export function batch({ dispatch }) {
    return (next) => (action) => {
        Array.isArray(action)
            ? dispatch({ type: BatchActionType, payload: action })
            : next(action);
    };
}


export function batching(reducer) {
    return function batcher(state, action) {
        return action.type === BatchActionType
            ? action.payload.reduce(batcher, state)
            : reducer(state, action);
    };
}
