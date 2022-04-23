import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MyMapComponent from './components/Map';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Auth0ProviderWithHistory>
        <Routes>
          <Route exact path='/' element={<App/>} />
          <Route path='/:searchLocation' element={<App/>} />
          <Route path='map' element={<MyMapComponent authed={true}/>} />
        </Routes>
      </Auth0ProviderWithHistory>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
