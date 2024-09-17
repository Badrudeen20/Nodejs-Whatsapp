const express = require('express');
module.exports = (callback) => {
  const router = express.Router();
  callback(router);
  return router;
};
