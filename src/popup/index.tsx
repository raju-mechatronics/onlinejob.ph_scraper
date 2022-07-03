import React, { FunctionComponent } from 'react';
import { render } from 'react-dom';
import App from './app';

const Root: FunctionComponent = () => {
  return <App />;
};

render(<Root />, document.getElementById('root'));
