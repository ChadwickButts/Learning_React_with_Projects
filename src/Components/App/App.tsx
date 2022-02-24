import { Link } from "react-router-dom";
import logo from '../../../src/logo.svg';
import './App.css';

function App() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          
        </header>
        <h2>Components</h2>
          <ul id="componentList">
            <li>
              <Link to="/todolist">W3 To-Do List</Link>
            </li>
            <li>
              <Link to="/weather">Weather App</Link>
            </li>
          </ul>
      </div>
    );
}


export default App;