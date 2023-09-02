const mongoose = require('mongoose');

const Schema = mongoose.Schema

const todoSchema = new Schema(
    {
        title: String,

    }, {timestamps:true}
)

const todoModel = mongoose.model('todo',todoSchema);

module.exports = todoModel;