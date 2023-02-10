const bcrypt = require('bcrypt')
const multer = require('multer')
const fs = require('fs')
const path = require("path");
const jwt = require('jsonwebtoken')
const {secretKey, expiresIn} = require("../configs/constant");

function hashString(data) {
    const salt = bcrypt.genSaltSync(13)
    const hashed = bcrypt.hashSync(data, salt)
    return hashed
}

function compareDataWithHash(data, hashString) {
    return bcrypt.compareSync(data, hashString)
}

function jwtTokenGenerator(payload, day = 6) {
    // new Date().getDate() + (1000 * 60 * 60 * 24 * day)
    const {username} = payload
    return jwt.sign({username}, secretKey, {expiresIn: expiresIn})
}

function verifyJwtToken(token) {
    try {
        const result = jwt.verify(token, secretKey)
        if (!result?.username) throw {status: 401, message: "ورود به حساب کاربری انجام نشد مجدد وارد شوید"}
        return result
    } catch (err) {
        throw {status: 401, message: "ورود به حساب کاربری با خطا مواجه شد"}
    }
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const year = new Date().getFullYear()
        const month = new Date().getMonth()
        const day = new Date().getDate()
        const fileAddress = `${__dirname}/../public/uploads/image/${year}/${month}/${day}`

        fs.mkdirSync(fileAddress, {recursive: true})
        callback(null, fileAddress)
    },
    filename: (req, file, callback) => {
        const type = path.extname(file.originalname)
        callback(null, String(Date.now()) + type)
    }
})
const upload = multer({storage: storage})


module.exports = {
    hashString,
    upload,
    compareDataWithHash,
    jwtTokenGenerator,
    verifyJwtToken
}