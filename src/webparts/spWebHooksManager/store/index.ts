import { Store, createStore as reduxCreateStore } from 'redux';
import { rootReducer, IState } from '../reducers';

export { IState } from '../reducers'

export function createStore(initialState?: IState): Store<IState> {
  return reduxCreateStore(rootReducer, initialState);
}
