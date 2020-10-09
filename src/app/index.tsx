import * as React from "react";
import * as ReactDOM from "react-dom";
import 'antd/dist/antd.css';

import { Provider } from 'react-redux';
import Router from './routes';


// if (process.env.NODE_ENV === 'development')
//   middlewares.push(logger);

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <Router />,
    document.getElementById('root'),
  );
});
