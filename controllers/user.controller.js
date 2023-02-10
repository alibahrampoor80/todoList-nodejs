const {userModel} = require("../models/user");
const {hashString} = require("../modules/utils");
const {isValidObjectId} = require("mongoose");
const path = require("path");

async function createUser(req, res, next) {
    try {
        const {username, password, email, mobile} = req.body
        let user;

        const mobileRegex = /^09[0-9]{9}/;
        const emailRegex = /^[a-z]+[a-z0-9\_\.]{3,}\@[a-z]{2,8}\.[a-z]{2,8}/;

        if (!mobileRegex.test(mobile)) throw {status: 400, message: "شماره مویابل وارد شده صحیح نمیباشد"}
        if (!emailRegex.test(email)) throw {status: 400, message: "ایمیل وارد شده صحیح نمیباشد"}

        if (password.length < 6 || password.length > 16) throw {
            status: 400,
            message: "رمز عبور شما نمیتوند کمتر از 6 و یا بیشتر از 16 کارکتر باشد"
        }

        user = await userModel.findOne({username: username})
        if (user) throw {status: 400, message: "نام کاربری تکراری میباشد"}

        user = await userModel.findOne({mobile: mobile})
        if (user) throw {status: 400, message: "موبایل تکراری میباشد"}

        user = await userModel.findOne({email: email})
        if (user) throw {status: 400, message: "ایمیل تکراری میباشد"}

        const hashedPassword = hashString(password)

        const userCreateResult = await userModel.create({
            username, password: hashedPassword, email, mobile
        })
        if (userCreateResult) {
            return res.json({message: "کاربر جدید در دیتابیس ایجاد شد ", userCreateResult})
        }
        throw {status: 500, message: "ایجاد کاربر انجام نشد"}
    } catch (err) {
        next(err)
    }
}

async function listOfUser(req, res, next) {
    try {
        const users = await userModel.find({}, {password: 0, createdAt: 0, updatedAt: 0, __v: 0}).sort({_id: -1})
        res.json({users})
    } catch (error) {
        next(error)
    }
}

async function getUserId(req, res, next) {
    try {
        const {id} = req.params

        if (!isValidObjectId(id)) throw {status: 400, message: "شناسه کاربر را به درستی ارسال کنید"}
        const user = await userModel.findOne({_id: id}, {password: 0, createdAt: 0, updatedAt: 0, __v: 0})
        if (!user) throw {status: 404, message: "کاربر یافت نشد"}
        console.log(req.protocol)
        user.profile_image = req.protocol + "://" + req.get("host") + user.profile_image.replace(/[\\\\]/gm, "/")
        return res.json(user)
    } catch (error) {
        next(error)
    }

}

async function deleteUserById(req, res, next) {
    try {
        const {id} = req.params
        if (!isValidObjectId(id)) throw {status: 400, message: "شناسه کاربری نامعتبر میباشد"}
        const user = await userModel.findById(id)
        if (!user) throw {status: 404, message: "کاربر یافت نشد."}

        const result = await userModel.deleteOne({_id: id})
        if (result.deletedCount > 0) return res.json({status: 200, message: "کاربر با موفقیت حذف شد"})
        throw {status: 500, message: "کاربر حذف نشد"}
    } catch (err) {
        next(err)
    }
}

async function updateUser(req, res, next) {
    try {
        const {id} = req.params

        if (!isValidObjectId(id)) throw {status: 400, message: "شناسه کاربری نامعتبر میباشد"}
        const userFindResult = await userModel.findById(id)
        if (!userFindResult) throw {status: 404, message: "کاربر یافت نشد."}

        const {username, email, mobile} = req.body
        let data = {...req.body}
        let user;
        const mobileRegex = /^09[0-9]{9}/;
        const emailRegex = /^[a-z]+[a-z0-9\_\.]{3,}\@[a-z]{2,8}\.[a-z]{2,8}/;
        if (mobile && !mobileRegex.test(mobile)) throw {status: 400, message: "شماره مویابل وارد شده صحیح نمیباشد"}
        if (email && !emailRegex.test(email)) throw {status: 400, message: "ایمیل وارد شده صحیح نمیباشد"}
        if (username) user = await userModel.findOne({username: username})
        if (user) throw {status: 400, message: "نام کاربری تکراری میباشد"}
        if (mobile) user = await userModel.findOne({mobile: mobile})
        if (user) throw {status: 400, message: "موبایل تکراری میباشد"}
        user = await userModel.findOne({email: email})
        if (user) throw {status: 400, message: "ایمیل تکراری میباشد"}

        Object.entries(data).forEach(([key, value]) => {
            if (!value || ["", " ", ".", null, undefined].includes(value) || value.length < 3) {
                delete data[key]
            }
            if (!["username", "email", "mobile"].includes(key)) {
                delete data[key]
            }
        })

        const result = await userModel.updateOne({_id: id}, {
            ...data
        })

        if (result.modifiedCount > 0) return res.json({status: 200, message: "کاربر با موفقیت بروزرسانی شد"})
        throw {status: 500, message: "کاربر بروزرسانی نشد"}
    } catch (err) {
        next(err)
    }
}

async function updateProfile(req, res, next) {
    const {id} = req.params
    if (!isValidObjectId) throw {status: 400, message: "شناسه ارسال شده صحیح نمیباشد"}
    try {
        const prefixPath = path.join(__dirname, "../", "public")
        let image;
        if (req.file) {
            image = req.file.path.substring(prefixPath.length)

        } else {
            throw {status: 400, message: "لطفا یک فایل انتخاب کنید"}
        }
        const result = await userModel.updateOne({_id: id}, {$set: {profile_image: image}})
        if (result.modifiedCount <= 0) throw {status: 400, message: "به روز رسانی اتفاق نیافتاد"}
        return res.json({
            file: JSON.stringify(req.files)
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {createUser, deleteUserById, listOfUser, updateUser, getUserId, updateProfile}