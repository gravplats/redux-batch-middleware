import test from 'ava';
import { applyMiddleware, combineReducers, createStore } from 'redux';

import { batch, batching, type as batchType } from './index';


const createBatchStore = () => {
    const middleware = [
        batch
    ];

    const root = combineReducers({
        actions: (state = [], action = {}) => {
            if (action.type === '@@redux/INIT') {
                return state;
            }

            return [...state, action];
        }
    });

    return applyMiddleware(...middleware)(createStore)(batching(root));
};

test('can dispatch non-batch action', (t) => {
    const type = 'action type';

    const store = createBatchStore();

    const action = { type };
    const result = store.dispatch(action);

    t.same(result, action);

    const actions = store.getState().actions;
    t.same(actions.map((action) => action.type), [type]);
});


test('can dispatch batch action', (t) => {
    const type1 = 'action type 1';
    const type2 = 'action type 2';

    const store = createBatchStore();

    const action = [{ type: type1 }, { type: type2 }];
    const result = store.dispatch(action);

    t.same(result, { type: batchType, payload: action });

    const actions = store.getState().actions;
    t.same(actions.map((action) => action.type), [type1, type2]);
});
