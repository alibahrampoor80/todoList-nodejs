const {Schema, model, Types} = require('mongoose')

const TaskSchema = new Schema({
    title: {type: String, required: true},
    text: {type: String, required: true},
    image: {type: String, default: undefined},
    user: {type: Types.ObjectId, required: true},
    status: {type: String, default: "pending"},
    category: {type: String, default: "work"},
    expiresIn: {type: Date, default: new Date()}
},{
    timestamps: true,
})

const TaskModel = model("task", TaskSchema)
module.exports = {TaskModel}