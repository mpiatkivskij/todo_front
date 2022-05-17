import React, { Component } from "react";
import "./App.css";
import TasksContainer from "./components/TasksContainer";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'

class App extends Component {
  render() {
    return (
      <Grid container>
        <Grid item xs={0} sm={3} md={3} lg={4} xl={5}></Grid>
        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <div className="topHeading">
            <h1>Мої задачі</h1>
          </div>
          <Paper elevation={10}>
          <TasksContainer />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default App;
