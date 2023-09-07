import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import EmojiPicker from 'emoji-picker-react';
import InputEmoji from 'react-input-emoji'
import add from './assets/add.png'
import camera from './assets/camera.png'
import deletebtn from './assets/delete.png'
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'



const App = () => {

  // const apiurl = "https://mern-todo-app-backend-five.vercel.app/api/v1/todos/";
  const apiurl = "http://localhost:8001/api/v1/todos/";
  const noimg = "https://firebasestorage.googleapis.com/v0/b/add-images-b4898.appspot.com/o/giffffff.gif?alt=media&token=34fd337a-ac8a-403e-a1eb-b700857e91a8";
  const loadgif = 'https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif';

  const date = new Date();
  const dt ={
    d : date.getDate(),
    m : date.getMonth(),
    y : date.getFullYear(),
}
  const [todo, setTodo] = useState([]);
  const [title, setTitle] = useState('');
  // const [style,setStyle]=useState('')
  const [image, setImg]= useState(noimg);
  const [load, setLoad]= useState(add);
  const [category,setCategory]=useState('⚫')

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


 const handleupload = async(e)=>{
    const selectedFile = e.target.files[0];
    if(selectedFile){
      const storageRef =  firebase.storage().ref()
      const fileRef = storageRef.child(selectedFile.name)

      await fileRef.put(selectedFile)
      .then((snapshot)=>{
        snapshot.ref.getDownloadURL()
        .then((downloadURL)=>{
          console.log(downloadURL);
          setImg(downloadURL);
          setLoad(add);
        })
      })
    }else{
      toast.error("Please select image to upload")
    }
 }

  //****************fuction to add new todo*******************************
const submitHandler = async(e)=>{
    e.preventDefault();

    //create object to send data
    const todoData = {
      title,
      category,
      image, 
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
        // alert("Enter todo.. ");
         toast.error("Please write a task..");
        setTitle('')
        // setImg('https://media.tenor.com/qrkH_HRRRmgAAAAC/ashish-chanchlani.gif')
     
      }

      if(response.ok){
        setTitle('')
       
       
      
        // alert("Added Successfully");
        toast.success("Task added successfully");
        
      }
      fetchtodos();
    }catch (error) {
      console.log(error);
  }
}

// *********** Image upload func ******************



// ********************fetching data from db***************************
    const fetchtodos = async()=>{
    try{
      const response = await fetch(apiurl);
      const json = await response.json();

      if(response.ok){
        setTodo(json);
        setImg(noimg);
      }
    } catch (error) {
      console.log(error);
    }
  }
useEffect( ()=>{ fetchtodos();},[])

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
      // alert(`successfully deleted`);
        toast.warn("Task deleted successfully");
      
      // Remove the deleted todo from the state
      setTodo(
        (prevTodos) => {
            prevTodos.filter((todo) => todo._id !== id)
        }    
        );
    }
    fetchtodos();
  } catch (error) {
    console.log(error);
  }
};


  return (
    <div className="body">
 <ToastContainer />
  <div className="header downAnimation">
        <h1>Tasks Manager</h1>
        <div className="date">Date: 
        {dt.d}/{dt.m+1}/{dt.y} 
        </div>

  </div>


  <div className="todo-container upanimation" >

    {todo && todo.map((todo)=>(
      <div className="card" key={todo._id}>
  
      <div className="img">
          <img src={todo.image} alt="img" />
      </div>

      <div className="todo" >
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
          <img src={deletebtn} alt="" height='30px' />
      </button>
          
      </div>
      </div>
    ))}

  </div>
 
      <form className="footer" onSubmit={submitHandler} >

      <div className="category">
          <span style={{marginLeft:"6px", color:"rgb(115, 59, 248)",fontFamily:"Manrope", fontWeight:"650"}}>Tag</span> 
      <select

        name="category"
        onChange={(e) => {
          setCategory(e.target.value);
        }}
        value={category}
        >
        <option value="🌟🌟🌟">🌟🌟🌟</option>
        <option value="⭐⭐">⭐⭐</option>
        <option value="⭐">⭐</option>
        <option value="⚫">⚫</option>
    </select>


     </div>
     
     <div className="img-input">
        <label> <img src={camera } alt="" width='30px' height='30px' />
          <input 
            type="file" 
            name="image"  
            text='muted' 
            style={{display:"none"}}
            onChange={handleupload}
            onClick={()=>{setLoad(loadgif)}}
            
           
          />
        </label>
     </div>

      <div className="input">

        <InputEmoji
              name="input"
              className="input"
              value={title}
              onChange={ setTitle}
              // cleanOnEnter
              // onEnter={ }
              height={50}
              buttonElement
              fontFamily={'Manrope'}
              placeholder="Start writing..."
        />

          {/* <input
            type="text"
            name="input"
            className="input"
            placeholder="Start writing..."
            onChange={(e)=>{
              setTitle(e.target.value);
            }}
            value={title}   
          /> */}
        
      </div>

        <div className="addbtn">
          <button className="add" type='submit' >
            {" "}
            <img src={load}
              width="50"
              height="50"
              alt="add--v2"
            />{" "}
          </button>
        </div>
        
        {/* add images using paste link */}
          {/* <div className="img">
            <input 
              type="text" 
              placeholder="enter link here" 
              onChange={(e)=>{setImg(e.target.value)}}
              value={image} 
              required={true}
            />
          </div> */}

      </form>
    
    </div>
  );
};

export default App;
