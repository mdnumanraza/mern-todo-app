const mongoose = require('mongoose');

const Schema = mongoose.Schema

const todoSchema = new Schema(
    {
        title: {
            type:String,
            required:true
        },
        category: {
            type:String,
            required:true
        },
        
        image: {
            type:String,
            required:true
        }
       

    }, {timestamps:true}
)

const todoModel = mongoose.model('todo',todoSchema);

module.exports = todoModel;