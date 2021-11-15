import './App.css';
import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import TestDetails from "./components/TestDetails";
import TestList from "./components/TestList";
import NotFound from "./components/NotFound";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <NotFound/>
          </Route>
          <Route exact path="/:jobUuid">
            <TestList/>
          </Route>
          <Route exact path="/:jobUuid/test/:testName">
            <TestDetails/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
