import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import add from './assets/add.png'
// import info from '../info'

const App = () => {

  const apiurl = "https://mern-todo-app-backend-five.vercel.app/api/v1/todos/";

  const date = new Date();
  const dt ={
    d : date.getDate(),
    m : date.getMonth(),
    y : date.getFullYear()
}
  const [todo, setTodo] = useState([]);
  const [title, setTitle] = useState('');
  // const [style,setStyle]=useState('')
  const [category,setCategory]=useState('Normal')

  const [checked, setChecked] = useState([]);

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
  var isChecked = (title) =>
  checked.includes(title) ? "line-through" : "none";

  //****************fuction to add new todo*******************************
const submitHandler = async(e)=>{
    e.preventDefault();
  
    //create object to send data
    const todoData = {
      title,
      category, 
    };

    try{
      //post api
      const response = await fetch(apiurl, {
        method:'POST',
        body : JSON.stringify(todoData),
        headers:{
          'Content-Type': 'application/json',
        }
      })
     
      const json = await response.json();
      console.log(json);
      if(!response.ok){
        alert("Enter todo.. ");
        setTitle('')
      }

      if(response.ok){
        setTitle('')
        alert("Added Successfully");
      }
      
    }catch (error) {
      console.log(error);
  }
}


// ********************fetching data from db***************************
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

//************************delete todo***************************/
const handleDelete = async (id) => {
  
  try {
    //fetching api to delete by id
    const response = await fetch(apiurl + id, {
      method: "DELETE",
      headers: {
        'Content-type': 'application/json',
      },
    });

    const json = await response.json();
    if (response.ok) {
      alert(`successfully deleted`);
      
      // Remove the deleted todo from the state
      setTodo(
        (prevTodos) => {
            prevTodos.filter((todo) => todo._id !== id)
        }    
        );
    }
  } catch (error) {
    console.log(error);
  }
};


  return (
    <div className="body">

  <div className="header downAnimation">
        <h1>Tasks Manager</h1>
        <div className="date">Date: 
        {dt.d}/{dt.m+1}/{dt.y} 
        </div>
  </div>

  <div className="todo-container upanimation" >

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
          <div >
            <span className={`${todo.category} tag`}>
            {todo.category}
            </span>
            </div>
        </div>
        <button className="delete" onClick={() => handleDelete(todo._id)}>
            ❌
        </button>

      </div>
    ))}

  </div>
 
      <form className="footer" onSubmit={submitHandler} >
        <div className="input">
          <input
            type="text"
            name="input"
            className="input"
            placeholder="Start writing..."
            onChange={(e)=>{
              setTitle(e.target.value);
            }}
            value={title}   
          />
      </div>

      <div className="category">
      <select
        name="category"
        onChange={(e) => {
          setCategory(e.target.value);
        }}
        value={category}
      >
        <option value="SSR">SSR</option>
        <option value="SR">SR</option>
        <option value="R">R</option>
        <option value="Normal">Normal</option>
    </select>

     </div>

        <div className="addbtn">
          <button className="add" type='submit' >
            {" "}
            <img src={add}
              width="50"
              height="50"
              alt="add--v2"
            />{" "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;
