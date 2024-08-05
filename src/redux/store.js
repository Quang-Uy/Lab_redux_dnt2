import { createStore, combineReducers } from 'redux';
import expenseReducer from './reducers/expenseReducer';

const rootReducer = combineReducers({
  expenses: expenseReducer,
});

const store = createStore(rootReducer);

export default store;
