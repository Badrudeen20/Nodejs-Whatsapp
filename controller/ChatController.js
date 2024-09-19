const passport = require('passport');
const { validationResult } = require('express-validator');
const {User,Contact,Chat,Status} = require('../models');
const { Sequelize, Op, where } = require('sequelize');
const path = require('path');
const { rootPath } = require('../module/url');
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
          let contact = await Contact.findAll({
            where: {
              user_mobile:req.user.mobile
            }
          })

          const contMobile = contact.map(item=>item.friend_mobile)
          const newContact = await Chat.findAll({
            attributes: ['friend_mobile'],
            group: ['friend_mobile'],
            where:{
              user_mobile:req.user.mobile,
              friend_mobile:{
                [Op.notIn]: contMobile
              },
              status:'receive'
            }
          })
          
          const newContactMobile = newContact.map(item=>item.friend_mobile)
          if(newContactMobile.length){
              const newContact = newContactMobile.map(function(item){
                     return {
                              user_mobile:req.user.mobile,
                              username:item,
                              friend_mobile:item 
                            }
              })
              await Contact.bulkCreate(newContact);
              contact = await Contact.findAll({
                where: {
                  user_mobile:req.user.mobile
                }
              })
            
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

      const msg = await Chat.findAll({
        where:{
          user_mobile:req.user.mobile,
          friend_mobile:req.query.friend
        }
      })

      return res.json({
        status:200,
        msg:msg
      })
    },
    status:async function(req,res) {
      let status = await Status.findAll({
        where:{
          mobile:{
            [Op.in]: req.body.contact
          }
        }
      })
      return res.json({
        status:200,
        data:status
      })
    },
    deleteContact:async function(req,res) {
     
      await Contact.destroy({
        where: {
          friend_mobile: req.query.friend,
        },
      })
      await Chat.destroy({
        where:{
          user_mobile:req.user.mobile,
          friend_mobile:req.query.friend,
        }
      })

      return res.json({
        status:200,
        msg:"Remove Successfully!"
      })
    },
    uploadStatus:function(req,res){
        try {
          if (!req.files || Object.keys(req.files).length === 0) {
              return res.status(400).send({ message: 'No file uploaded' });
          }
          let uploadedFile = req.files.file;
          const uploadPath = path.join(process.cwd(), 'public/uploads', uploadedFile.name);
        
          uploadedFile.mv(uploadPath, (err) => {
              if (err) {
                  return res.status(500).send(err);
              }

              res.send({
                  message: 'File uploaded successfully!',
                  fileName: uploadedFile.name,
                  filePath: `/uploads/${uploadedFile.name}`
              });
          });
      } catch (err) {
          res.status(500).send(err);
      }
    }

  };
