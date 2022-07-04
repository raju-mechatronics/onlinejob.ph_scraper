import React, { FunctionComponent } from 'react';
import { render } from 'react-dom';
import App from './app';

const Root: FunctionComponent = () => {
  return <App />;
};

const el = document.createElement('div');
el.id = 'root';
document.body.append(el);

render(<Root />, document.getElementById('root'));
