
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";
import Homepage from './homepage/Homepage';
import Character from './character/Character';
import './App.css';
function App() {
  
  
  return (
    <div className="App">
      <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/character/:id" element={<Character />}/>
          <Route path="/" element={<Homepage />}/>
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
