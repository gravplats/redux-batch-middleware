export const type = '@@redux-batch-middleware/BATCH';

export const batch = ({ dispatch }) => {
    return (next) => (action) => {
        if (Array.isArray(action)) {
            const actions = action.reduce((memo, act) => {
                const { plain, others } = memo;
                return act.type !== undefined
                    ? { plain: [...plain, act], others }
                    : { plain: plain, others: [...others, act] };
            }, { plain: [], others: [] });

            actions.others.forEach(next);
            return dispatch({ type, payload: actions.plain });
        } else {
            return next(action);
        }
    };
};

export const batching = (reducer) => {
    return function batcher(state, action) {
        return action.type === type
            ? action.payload.reduce(batcher, state)
            : reducer(state, action);
    };
};
