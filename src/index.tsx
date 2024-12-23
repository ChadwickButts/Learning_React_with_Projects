import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './Components/App/App';
import reportWebVitals from './reportWebVitals';
import Nav from './Components/Navigation/Nav';
import ToDoList from './Components/To-Do-List/ToDoList';
import Weather from './Components/Weather/Components/Weather';
import Contacts from './Components/PracticalChallenges/Components/ContactList/Contacts';

render (
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="/todolist" element={<Nav component={<ToDoList/>} app={'To-Do List'}/>}></Route>
        <Route path="/weather" element={<Nav component={<Weather/>} app={'Weather App'} />}></Route>
        <Route path="/contacts" element={<Nav component={<Contacts/>} app={'Contact List'} />}></Route>
      </Routes> 
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
