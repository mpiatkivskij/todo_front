import React, { Component } from "react";
import "./App.css";
import TasksContainer from "./components/TasksContainer";

class App extends Component {
  render() {
    return (
      <div className="mainContainer">
        <div className="topHeading">
          <h1>Мої задачі</h1>
        </div>
        <TasksContainer />
      </div>
    );
  }
}

export default App;
