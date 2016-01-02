import test from 'ava';
import { applyMiddleware, combineReducers, createStore } from 'redux';

import { batch, batching } from '../lib/index';


function createBatchStore() {
    let middleware = [
        batch
    ];

    let root = combineReducers({
        actions: function(state = [], action = {}) {
            if (action.type === '@@redux/INIT') {
                return state;
            }

            return [...state, action];
        }
    });

    return applyMiddleware(...middleware)(createStore)(batching(root));
}


test('can dispatch non-batch action', (t) => {
    let type = 'action type';

    let store = createBatchStore();
    store.dispatch({ type });

    let actions = store.getState().actions;
    t.same(actions.map((action) => action.type), [type]);
});


test('can dispatch batch action', (t) => {
    let type1 = 'action type 1';
    let type2 = 'action type 2';

    let store = createBatchStore();
    store.dispatch([{ type: type1 }, { type: type2 }]);

    let actions = store.getState().actions;
    t.same(actions.map((action) => action.type), [type1, type2]);
});
