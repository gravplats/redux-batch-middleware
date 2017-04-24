import test from 'tape';
import { isFSA } from 'flux-standard-action';
import { applyMiddleware, combineReducers, createStore } from 'redux';

import { batch, batching, type as batchType } from './index';


const createBatchStore = (middlewares=[]) => {
    const middleware = [
        batch,
        ...middlewares
    ];

    const root = combineReducers({
        actions: (state = [], action = {}) => {
            if (action.type === '@@redux/INIT') {
                return state;
            }

            return [...state, action];
        }
    });

    return createStore(batching(root), applyMiddleware(...middleware));
};

test('can dispatch non-batch action', (t) => {
    const type = 'action type';

    const store = createBatchStore();

    const action = { type };
    const result = store.dispatch(action);

    t.same(result, action);

    const actions = store.getState().actions;
    t.same(actions.map((action) => action.type), [type]);

    t.end();
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

    t.end();
});

test('can handle non-fsa actions', (t) => {
  const customMiddleware = ({ dispatch }) => next => action => {
    if(typeof action === 'function') {
      return action(dispatch);
    }

    next(action);
  };

  const type1 = 'action type 1';
  const type2 = 'action type 2';

  const store = createBatchStore([customMiddleware]);

  const action = [{ type: type1 }, dispatch => dispatch({ type: type2 }) ];
  const result = store.dispatch(action);
  const actions = store.getState().actions;

  t.same(actions.map((action) => action.type), [type1, type2]);
  t.end();
});
