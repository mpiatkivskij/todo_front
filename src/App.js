import React, { Component } from "react";
import "./App.css";
import TasksContainer from "./components/TasksContainer";
import Paper from '@mui/material/Paper';

class App extends Component {
  render() {
    return (
      <div className="mainContainer">
        <div className="topHeading">
          <h1>Мої задачі</h1>
        </div>
        <Paper elevation={10}>
        <TasksContainer />
        </Paper>
      </div>
    );
  }
}

export default App;
