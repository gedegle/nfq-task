import React from 'react';
import ReactDOM from 'react-dom';
import AdminPage from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AdminPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
