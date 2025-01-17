const express = require("express");
// Middlewares
const guest = require('../middleware/guest');
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const ChatController = require("../controller/ChatController");
const group = require('../module/group');
const {User,Contact,Chat} = require('../models');
const router = express.Router();

router.get('/trunkcate/:id', async function(req,res){
  Chat.truncate({ force: true }) // 'force: true' is used to bypass foreign key constraints
  .then(() => {
    res.send('Table truncated successfully.')
  }).catch((error) => {
    res.send('Error occurred while truncating the table:', error)
  });
})


router.all("/login", guest, [
    check('mobile', 'Mobile required valid number').isMobilePhone('any').withMessage('Invalid mobile number').isLength({
      min: 10,
      max: 10,
    }).matches(/^\d+$/).withMessage('Mobile number must contain only digits'),
  ], ChatController.login)


router.all("/register", guest, [
    check('username', 'Username required').isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters long')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must contain only letters, numbers, and underscores'),
    check('mobile', 'Mobile number not valid').isMobilePhone('any').withMessage('Invalid mobile number').isLength({
      min: 10,
      max: 10,
    }).matches(/^\d+$/).withMessage('Mobile number must contain only digits').custom(async (value) => {
     
      const user = await User.findOne({ 
        where:{
          mobile:value
        }
       });
      
      if (user) {
        return Promise.reject('Mobile already in use');
      }
    })
  ], ChatController.register)

router.use(
    '/',
    auth,
    group((route) => {
      route.get("/", ChatController.view)
      route.post("/add-user", [
        check('mobile', 'Mobile required valid number').isMobilePhone('any').withMessage('Invalid mobile number').isLength({
          min: 10,
          max: 10,
        }).matches(/^\d+$/).withMessage('Mobile number must contain only digits').custom(async (value, { req }) => {
        
          if (req.user && req.user.mobile == value) {
            return Promise.reject('Mobile already in use');
          }

        }),
      ], ChatController.add)
      route.get("/contact-list", ChatController.contact)
      route.get("/chat-list", ChatController.chat)
      route.post("/load-status", ChatController.status)
      route.get("/delete-user", ChatController.deleteContact)
      route.post("/check-status", ChatController.uploadStatus)
      
    })
); 



module.exports = router