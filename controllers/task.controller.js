const {TaskModel} = require("../models/tasks");

async function createTask(req, res, next) {
    try {
        const {title, text, category, user = req.user._id, status = "pending"} = req.body
        const result = await TaskModel.create({
            title,
            text,
            category,
            user,
            status,
            expiresIn: Date.now() + (1000 * 60 * 60 * 24 * 30),

        })
        // console.log(result)
        if (!result) throw {status: 500, message: "آیتم ثبت نشد"}

        return res.status(201).json({
            status: 201,
            success: true,
            message: "ذخیره و ثبت تسک با موفیقت انجام شد"
        })


    } catch (err) {
        next(err)
    }
}

async function getAllTask(req, res, next) {
    try {
        const userID = req.user._id
        const tasks = await TaskModel.find({user: userID}).sort({_id: -1})
        return res.status(200).json({
            status: 200,
            success: true,
            tasks
        })
    } catch (err) {
        next(err)
    }
}

async function getTaskById(req, res, next) {
    try {
        const userID = req.user._id
        const taskID = req.params.id
        const task = await TaskModel.findOne({user: userID, _id: taskID})

        if (!task) throw {status: 404, message: "تسک مورد نظر یافت نشد"}

        return res.status(200).json({
            status: 200,
            success: true,
            task
        })
    } catch (err) {
        next(err)
    }
}

async function taskUpdate(req, res, next) {
    try {
        const {id: _id} = req.params
        const user = req.user._id
        const task = TaskModel.findOne({_id, user})
        if (!task) throw {status: 404, message: "تسکی یافت نشد"}
        const data = {...req.body}


        Object.entries(data).forEach(([key, value]) => {
            if (!value || ["", " ", ".", null, undefined].includes(value) || value.length < 3) {
                delete data[key]
            }
            if (!["title", "text", "category"].includes(key)) {
                delete data[key]
            }
        })
        const updateTaskResult = await TaskModel.updateOne({_id}, {$set: data})
        if (updateTaskResult.modifiedCount > 0) {
            return res.status(200).json({status: 200, success: true, message: "بروز رسانی باموفقیت انجام شد"})
        }
        throw {status: 400, message: "به روزرسانی انجام نشد"}
    } catch (err) {
        next(err)
    }
}

async function removeTaskById(req, res, next) {
    try {
        const {id: _id} = req.params
        const userID = req.user._id
        const task = await TaskModel.findOne({_id, userID})
        if (!task) throw {status: 404, message: "تسک یافت نشد"}
        const removeResult = await TaskModel.deleteOne({_id})
        if (removeResult.deletedCount > 0) {
            return res.status(200).json({
                status: 200,
                success: true,
                message: "حذف تسک با موفقیت انجام شد"
            })
        }
        throw {status: 500, message: "حذف تسک انجام نشد"}
    } catch (err) {
        next(err)
    }
}

module.exports = {createTask, getAllTask, removeTaskById, taskUpdate,getTaskById}