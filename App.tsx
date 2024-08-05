import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import ExpenseScreen from './src/screens/ExpenseScreen';

export default function App() {
  return (
    <Provider store={store}>
      <ExpenseScreen />
    </Provider>
  );
}
