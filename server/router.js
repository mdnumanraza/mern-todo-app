const express = require('express');
const { createTodo, 
        getTodos, 
        getTodo, 
        deleteTodo, 
        updateTodo
} = require('./controller');

// router object 
const router = express.Router();

//Get method all
router.get('/',getTodos);

//Get one todo
router.get('/:id',getTodo);

//Create todo
router.post('/',createTodo);

//Delete todo
router.delete('/:id',deleteTodo);

//Patch method to update a todo
router.patch('/:id', updateTodo);

module.exports =router;