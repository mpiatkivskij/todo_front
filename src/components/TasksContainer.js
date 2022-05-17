import React, { Component } from "react";
import axios from "axios";
import update from "immutability-helper"
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Grid from "@mui/material/Grid";


class TasksContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
          tasks: [],
          inputValue: ''
        }

      }

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
        if (e.key === 'Enter' && !(e.target.value === '')) {
          axios.post('/api/v1/tasks', {task: {body: e.target.value}})
          .then(response => {
            const tasks = update(this.state.tasks, {
              $splice: [[0, 0, response.data]]
            })
            this.setState({
              tasks: tasks,
              inputValue: ''
            })
            
          })
          .catch(error => console.log(error)) 
             
        }   
        
        } 
        handleChange = (e) => {
          this.setState({inputValue: e.target.value});
        }

        updateTask = (e, id) => {
          axios.put(`/api/v1/tasks/${id}`, {task: {done_mark: e.target.checked}})
          .then(response => {
            const taskIndex = this.state.tasks.findIndex(x => x.id === response.data.id)
            const tasks = update(this.state.tasks, {
              [taskIndex]: {$set: response.data}
            })
            this.setState({
              tasks: tasks
            })
          })
          .catch(error => console.log(error))      
        }

        deleteTask = (id) => {
          axios.delete(`/api/v1/tasks/${id}`)
          .then(response => {
            const taskIndex = this.state.tasks.findIndex(x => x.id === id)
            const tasks = update(this.state.tasks, {
              $splice: [[taskIndex, 1]]
            })
            this.setState({
              tasks: tasks
            })
          })
          .catch(error => console.log(error))
        }
      
      

      render() {
        return (
        
          <div>
          
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
                    <li className="item" task={task} key={task.id}>
                      <Checkbox className="itemCheckbox" type="checkbox" 
                      checked={task.done_mark}
                      onChange={(e) => this.updateTask(e, task.id)}
                      />
                      <label className="itemDisplay">{task.body}</label>
                      <span 
                          className="removeItemButton" 
                          onClick={(e) => this.deleteTask(task.id)}>
                            <DeleteIcon/>
                       </span>
                    </li>
                  );
                })}
                </ul>
                </div>    
            
      </div>
      
      
    );
  }
}

export default TasksContainer;