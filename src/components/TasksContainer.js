import React, { Component } from "react";
import axios from "axios";
import update from "immutability-helper";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class TasksContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      inputValue: "",
      toastOpen: false,
      toastMessage: "",
      toastColor: "",
    };
  }

  handleClose = () => {
    this.setState({ toastOpen: false });
  };

  loadTasks() {
    axios
      .get("/api/v1/tasks")
      .then((res) => {
        this.setState({ tasks: res.data });
      })
      .catch((error) => console.log(error));
  }
  componentDidMount() {
    this.loadTasks();
  }

  createTask = (e) => {
    if (e.key === "Enter" && !(e.target.value === "")) {
      axios
        .post("/api/v1/tasks", { task: { body: e.target.value } })
        .then((response) => {
          const tasks = update(this.state.tasks, {
            $splice: [[0, 0, response.data]],
          });
          this.setState({
            tasks: tasks,
            inputValue: "",
            toastOpen: true,
            toastMessage: "Задачу додано",
            toastColor: "info",
          });
        })
        .catch((error) => console.log(error));
    }
  };
  handleChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  updateTask = (newvalue, id) => {
    axios
      .put(`/api/v1/tasks/${id}`, { task: { done_mark: newvalue } })
      .then((response) => {
        const taskIndex = this.state.tasks.findIndex(
          (x) => x.id === response.data.id
        );
        const tasks = update(this.state.tasks, {
          [taskIndex]: { $set: response.data },
        });
        this.setState({
          tasks: tasks,
          
        });
        newvalue && this.setState({
          toastOpen: true,
          toastMessage: "Задачу виконано",
          toastColor: "success",
        })
      })
      .catch((error) => console.log(error));
  };

  deleteTask = (id) => {
    axios
      .delete(`/api/v1/tasks/${id}`)
      .then((response) => {
        const taskIndex = this.state.tasks.findIndex((x) => x.id === id);
        const tasks = update(this.state.tasks, {
          $splice: [[taskIndex, 1]],
        });
        this.setState({
          tasks: tasks,
          toastOpen: true,
          toastMessage: "Задачу видалено",
          toastColor: "error",
        });
      })
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <div>
        <Snackbar
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={this.state.toastOpen}
          onClose={this.handleClose}
            
        >
          <Alert
            onClose={this.handleClose}
            severity={this.state.toastColor}
            sx={{ width: "100%" }}
          >
            {this.state.toastMessage}
          </Alert>
        </Snackbar>
        <div>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Введіть нову задачу і тицніть ENTER"
            variant="outlined"
            type="text"
            onKeyPress={this.createTask}
            value={this.state.inputValue}
            onChange={this.handleChange}
          />
        </div>
        <div className="wrapItems">
          <ul className="listItems">
            {this.state.tasks.map((task) => {
              return (
                <ListItem
                  dense
                  task={task}
                  key={task.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon onClick={(e) => this.deleteTask(task.id)} />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton
                    role={undefined}
                    onClick={(e) => this.updateTask(!task.done_mark, task.id)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={task.done_mark}
                        disableRipple
                        // onChange={(e) => this.updateTask(e.target.value, task.id)}
                      />
                    </ListItemIcon>
                    <label className={task.done_mark && "task-done"}>{task.body}</label>
                    
                  </ListItemButton>
                </ListItem>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default TasksContainer;
