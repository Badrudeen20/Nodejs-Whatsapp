const express = require('express');
const app = express();
const path = require('path')
const rootDir = path.resolve(__dirname, '../../');
module.exports = {
      url:function(req,res){
           return `https://${req.get('host')}/`; 
      },
      rootPath:(function(path){
          return path
      })(rootDir)
     
}