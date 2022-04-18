const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;