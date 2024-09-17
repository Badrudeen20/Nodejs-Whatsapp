const passport = require('passport');
const { validationResult } = require('express-validator');
const {User,Contact,Chat} = require('../models');
const { Sequelize, Op, where } = require('sequelize');
module.exports = {
    view: async function (req, res) {
        res.render("index");
    },
    add:async function(req,res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.json({
            status:400,
            msg:errors
          })
        } else {

            let exist = await Contact.findOne({
              where: {
                user_mobile: req.user.mobile,
                friend_mobile:req.body.mobile
              }
            });
            if(exist){
              exist.username = req.body.username;
              await exist.save();
            }else{
              await Contact.create({
                user_mobile:req.user.mobile,
                username:req.body.username,
                friend_mobile:req.body.mobile
              })
            }
            
            
            return res.json({
                status:200,
                msg:"Add Successfully"
            }) 
        }
        
    },
    contact:async function(req,res){
          const contact = await Contact.findAll({
            where: {
              user_mobile:req.user.mobile
            }
          })

          const contMobile = contact.map(item=>item.friend_mobile)
          const newContact = await Chat.findAll({
            attributes: ['user_mobile'],
            group: ['user_mobile'],
            where:{
              user_mobile:{
                [Op.notIn]: contMobile
              },
              friend_mobile:req.user.mobile,
              status:'view'
            }
          })
          
          const newContactMobile = newContact.map(item=>item.user_mobile)
          if(newContactMobile.length){
              const newContact = newContactMobile.map(function(item){
                      return {
                                    user_mobile:req.user.mobile,
                                    username:item,
                                    friend_mobile:item
                            }
              })
              await Contact.bulkCreate(newContact);
          }
         return res.json({
            status:200,
            data:contact,
            room:req.user.mobile
         })
    },
    login:function(req,res,next){
        
        if(req.method=='GET'){
            res.render("login");
        }else{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            errors.array().forEach((error) => req.flash('error', error.msg));
            return res.redirect('back');
            } else {
                
                passport.authenticate('custom', {
                    successRedirect: '/',
                    failureRedirect: '/login',
                    failureFlash: true,
                })(req, res, next);
            }
        }
    },
    register:async function(req,res){
       if(req.method=='GET'){
        res.render("register");
       }else{
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            errors.array().forEach((error) => req.flash('error', error.msg));
            return res.redirect('back');
          } else {
            const user = await User.create({
                username: req.body.username,
                mobile: req.body.mobile,
            });
            return res.redirect('/login')
          }
       }
        
    },
    chat:async function(req,res) {


      /* const after = await Chat.findOne({
        attributes: ['id'],
        where:{
          user_mobile:req.user.mobile,
          friend_mobile:req.query.friend,
          status:'drop'
        }
      }) */
      
      const msg = await Chat.findAll({
        where:{
          user_mobile:{
            [Op.in]:[req.user.mobile,req.query.friend]
          },
          friend_mobile:{
            [Op.in]:[req.user.mobile,req.query.friend]
          },
          status:'view'
        }
      })


    
      return res.json({
        status:200,
        msg:msg
      })
    },


    /* deleteContact:function(req,res) {
      let json = {}
      Contact.destroy({
        where: {
          friend_mobile: req.query.friend,
        },
      }).then(async () => {
        await Chat.destroy({
          where:{
            user_mobile:req.user.mobile,
            friend_mobile:req.query.friend,
            status:'drop',
          }
        })
        await Chat.create({
          user_mobile:req.user.mobile,
          friend_mobile:req.query.friend,
          status:'drop',
          msg:''
        })
        json['status'] = 200
      }).catch((error) => {
        json['status'] = 400
        json['error'] = error
      });

      return res.json(json)
    }, */
    

  };
