const router = require('express').Router()
const {userRegister, userLogin} = require("../controllers/auth.controller");


router.post('/register', userRegister)
router.post('/login',userLogin)

router.post('/rest-password', async (req, res, next) => {
    try {

    } catch (err) {
        next(err)
    }
})

module.exports = router

