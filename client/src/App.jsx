import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import add from './assets/add.png'
// import info from '../info'

const App = () => {

  const apiurl = "http://localhost:8001/api/v1/todos";

  const date = new Date();
  const dt ={
    d : date.getDate(),
    m : date.getMonth(),
    y : date.getFullYear()
}


  const [todo, setTodo] = useState([]);
  const [title, setTitle] = useState("");

  const [checked, setChecked] = useState([]);
  // const styles = { textDecorationLine: checked ? "line-through" : "none" };
  // const handlecheck = () => setChecked(!checked);

// Add/Remove checked item from list
const handlecheck = (event) => {
  var updatedList = [...checked];
  if (event.target.checked) {
    updatedList = [...checked, event.target.value];
  } else {
    updatedList.splice(checked.indexOf(event.target.value), 1);
  }
  setChecked(updatedList);
};

// const checkedItems = checked.length
//     ? checked.reduce((total, item) => {
//         return total + ", " + item;
//       })
//     : "";

    var isChecked = (title) =>
    checked.includes(title) ? "line-through" : "none";

  const submitHandler = async(e)=>{
    e.preventDefault();
    const todoData = title

    try{
      const response = await fetch(apiurl, {
        method:'POST',
        body : JSON.stringify(todoData)
      })

      const json = await response.json();
      console.log(json);
      if(!response.ok){
        alert("Enter todo");
        setEmptyFields(json.emptyFields)
      }

      if(response.ok){
        setTitle('')
        setEmptyFields([])
        alert("Added Successfully");
      }
    }catch (error) {
      toast.error(error);
      console.log(error);
  }
}

// fetching data from db
useEffect( ()=>{
  const fetchtodos = async()=>{
    try{
      const response = await fetch(apiurl);
      const json = await response.json();

      if(response.ok){
        setTodo(json);
      }
    } catch (error) {
      console.log(error);
    }
  }
  fetchtodos();
},[])


  return (
    <div className="body">
      <div className="header">
        <h1>Tasks Manager</h1>
        <div className="date">Date: 
        {dt.d}/{dt.m+1}/{dt.y} 
        </div>
      </div>

  <div className="todo-container" >

    {todo && todo.map((todo)=>(
      <div className="todo" key={todo._id}>
        <div className="check">
          <input type="checkbox" name="check" onChange={handlecheck}
          value={todo._id}
          />
        </div>
        <div className="desc">
          <div className={`title ${isChecked(todo._id)}`}>{todo.title}</div>
          <div className="time">
            {formatDistanceToNow(new Date(todo.updatedAt), {
            addSuffix: true,
          })}
          </div>
        </div>
        <button className="delete">
          <img
            alt="svgImg"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIKc3R5bGU9ImZpbGw6I0ZBNTI1MjsiPgo8cGF0aCBkPSJNIDEwLjgwNjY0MSAyIEMgMTAuMjg5NjQxIDIgOS43OTU2ODc1IDIuMjA0MzEyNSA5LjQyOTY4NzUgMi41NzAzMTI1IEwgOSAzIEwgNCAzIEEgMS4wMDAxIDEuMDAwMSAwIDEgMCA0IDUgTCAyMCA1IEEgMS4wMDAxIDEuMDAwMSAwIDEgMCAyMCAzIEwgMTUgMyBMIDE0LjU3MDMxMiAyLjU3MDMxMjUgQyAxNC4yMDUzMTIgMi4yMDQzMTI1IDEzLjcxMDM1OSAyIDEzLjE5MzM1OSAyIEwgMTAuODA2NjQxIDIgeiBNIDQuMzY1MjM0NCA3IEwgNS44OTI1NzgxIDIwLjI2MzY3MiBDIDYuMDI0NTc4MSAyMS4yNTM2NzIgNi44NzcgMjIgNy44NzUgMjIgTCAxNi4xMjMwNDcgMjIgQyAxNy4xMjEwNDcgMjIgMTcuOTc0NDIyIDIxLjI1NDg1OSAxOC4xMDc0MjIgMjAuMjU1ODU5IEwgMTkuNjM0NzY2IDcgTCA0LjM2NTIzNDQgNyB6Ij48L3BhdGg+Cjwvc3ZnPg=="
          />
        </button>
      </div>
    ))}

  </div>
 

      <div className="footer">
        <div className="input">
          <input
            type="text"
            name="input"
            placeholder="Start writing..."
            value={title}
            onChange={(e)=>{
              setTitle(e.target.value);
            }}
           
          />
        </div>
        <div className="addbtn">
          <button 
          className="add"
          onSubmit={submitHandler}
          >
            {" "}
            <img src={add}
              width="50"
              height="50"
              alt="add--v2"
            />{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
