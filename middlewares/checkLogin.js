const {userModel} = require("../models/user");
const {verifyJwtToken} = require("../modules/utils");

async function autoLogin(req, res, next) {
    try {
        req.user = null
        req.isLogined = false
        const headers = req?.headers
        const token = headers?.authorization?.substring(7);
        if (!token) throw {status: "401", message: "لطفا وارد حساب کاربری خود شوید"}
        const payload = verifyJwtToken(token)
        const user = await userModel.findOne({username: payload.username}, {
            password: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0
        })
        if (!user) throw {status: 401, message: "لطفا مجدد وارد حساب کاربری شوید"}
        req.user = user
        req.isLogined = true
        next()
    } catch (err) {
        next(err)
    }

}

module.exports = {
    autoLogin
}