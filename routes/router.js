const router = require('express').Router()
const {autoLogin} = require("../middlewares/checkLogin");

const userRoutes = require("./users");
const authRoutes = require("./auth");
const taskRoutes = require("./tasks");

router.use('/users', userRoutes)
router.use('/auth', authRoutes)
router.use('/tasks', autoLogin, taskRoutes)

module.exports = router
