import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import './fonts/Adieu-Bold.otf'
import './fonts/WorkSans-Black.ttf'
import './fonts/WorkSans-Regular.ttf'
import './fonts/WorkSans-Bold.ttf'
import './fonts/WorkSans-ExtraLight.ttf'
import './fonts/WorkSans-Italic.ttf'
import './fonts/WorkSans-Light.ttf'
import './fonts/WorkSans-Medium.ttf'
import './fonts/WorkSans-SemiBold.ttf'
import './fonts/WorkSans-Thin.ttf'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
