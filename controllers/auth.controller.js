const {userModel} = require("../models/user");
const {hashString, compareDataWithHash, jwtTokenGenerator} = require("../modules/utils");

async function userRegister(req, res, next) {
    try {
        const {email, mobile, username, password, confirm_password} = req.body

        const mobileRegex = /^09[0-9]{9}/;
        const emailRegex = /^[a-z]+[a-z0-9\_\.]{3,}\@[a-z]{2,8}\.[a-z]{2,8}/;

        if (!mobileRegex.test(mobile)) throw {status: 400, message: "شماره مویابل وارد شده صحیح نمیباشد"}
        if (!emailRegex.test(email)) throw {status: 400, message: "ایمیل وارد شده صحیح نمیباشد"}

        if (password.length < 6 || password.length > 16) throw {
            status: 400,
            message: "رمز عبور شما نمیتوند کمتر از 6 و یا بیشتر از 16 کارکتر باشد"
        }

        if (password !== confirm_password) throw {
            status: 400,
            message: "رمز عبور با تکرار آن یکسان نمیباشد"
        }


        let user = await userModel.findOne({email})
        if (user) throw {status: 400, message: "ایمیل قبلا استفاده شده است"}
        user = await userModel.findOne({username})
        if (user) throw {status: 400, message: "یوزرنیم قبلا استفاده شده است"}
        user = await userModel.findOne({mobile})
        if (user) throw {status: 400, message: "موبایل قبلا استفاده شده است"}

        await userModel.create({
            mobile,
            username,
            email,
            password: hashString(password)
        }).catch(err => {
            return res.status(500).res.json({status: 500, message: "خطایی در ثبت نام رخ داد"})
        })
        return res.status(200).json({
            status: 200,
            success: true,
            message: "حساب کاربری شما ساخته شد لطفا در بخش ورود وارد حساب کاربری خود شوید"
        })
    } catch (err) {
        next(err)
    }
}

async function userLogin(req, res, next) {

    try {
        const {password, username} = req.body
        let user = await userModel.findOne({username})
        if (!user) throw {status: 401, message: "نام کاربری و یا رمز عبور صحیح نمیباشد"}
        if (!compareDataWithHash(password, user.password)) throw {
            status: 401,
            message: "نام کاربری و یا رمز عبور صحیح نمیباشد"
        }
        let token = jwtTokenGenerator(user)
        user.token = token
        user.save()
        return res.status(200).json({status: 200, success: true, message: "ورود موفقیت آمیز بود", token})
    } catch (err) {
        next(err)
    }

}

module.exports = {
    userRegister,
    userLogin
}