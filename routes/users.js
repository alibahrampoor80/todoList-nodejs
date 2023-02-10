const {Router} = require('express')
const {
    createUser,
    listOfUser,
    updateUser,
    deleteUserById,
    getUserId,
    updateProfile
} = require("../controllers/user.controller");
const {upload} = require("../modules/utils");
const {autoLogin} = require("../middlewares/checkLogin");
const router = Router()

router.get('/', listOfUser)
router.get('/profile',autoLogin, (req, res, next) => {

    return res.json({user:req.user})
})
router.get('/:id', getUserId)
router.post('/create', createUser)
router.delete('/:id', deleteUserById)
router.put('/:id', updateUser)
router.put('/profile/:id', upload.single("images"), updateProfile)
module.exports = router