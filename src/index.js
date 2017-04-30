import React from 'react';
import ReactDOM from 'react-dom';
import DashboardHeader from './DashboardHeader.js'
import DashboardBody from './DashboardBody.js'

require('bootstrap/dist/css/bootstrap.min.css')

// Main Root Component
ReactDOM.render(
  <div>
    <DashboardHeader/>
    <DashboardBody url='http://localhost:3001/api/'/>
  </div>,
  document.getElementById('root')
);
