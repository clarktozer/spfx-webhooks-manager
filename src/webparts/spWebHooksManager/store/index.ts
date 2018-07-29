import { Store, createStore as reduxCreateStore, compose, applyMiddleware } from 'redux';
import { rootReducer, IState } from '../reducers';
import thunk from 'redux-thunk';
export { IState } from '../reducers';

export function createStore(initialState?: IState): Store<IState> {
  const middlewares = [
    thunk
  ];

  return reduxCreateStore(rootReducer, initialState, compose(
    applyMiddleware(...middlewares)
  ));
}
