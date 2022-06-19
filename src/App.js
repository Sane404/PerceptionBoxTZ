import { HashRouter as Router, Route, Link, Routes } from "react-router-dom";
import Homepage from "./homepage/Homepage";
import Character from "./character/Character";

import "./App.css";
import HomeIcon from "@mui/icons-material/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/" className="homelink">
                  <HomeIcon fontSize="large" color="white"></HomeIcon>
                </Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/character/:id" element={<Character />} />
            <Route exact path="/" element={<Homepage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
