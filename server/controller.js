const { default: mongoose } = require("mongoose");
const todo = require('./todoModel');

//get all todos
const getTodos = async(req, res)=>{
    const todoData = await todo.find({}).sort({createdAt:-1})
    res.status(200).json(todoData);//gives json response from db
}

//get single todo
const getTodo = async(req, res)=>{
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json("not found");
    }

    const todoData = await todo.findById(id);
    if(!todoData){
        return res.status(404).json({error})
    }
    res.status(200).json(todoData);
}

//Create todo
const createTodo = async(req, res)=>{
    const {title,category,image} = req.body;
    try{
        const todoData = await todo.create({title,category,image});
        res.status(200).json(todoData);
    }catch (error) {
        res.status(400).json({error})
    }
}


// delete a Todo /:id
const deleteTodo = async (req, res)=>{
    const {id} = req.params;

    const todoData = await todo.findByIdAndDelete(id);
    if(!todoData){
        return res.status(404).json({"error":"invalid id , could not found"})
    }
    res.status(200).json({msg:"deleted"})
}

// update a Todo /:id
const updateTodo = async (req, res)=>{
    const {id} = req.params;

    const todoData = await todo.findOneAndUpdate({_id:id}, {...req.body})
    if(!todoData){
        return res.status(404).json({"error":"invalid id , could not found"})
    }
    res.status(200).json(todoData)
}

module.exports = {createTodo, 
    getTodos, 
    getTodo, 
    deleteTodo, 
    updateTodo,
 }