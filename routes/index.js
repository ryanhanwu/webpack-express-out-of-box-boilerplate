/* eslint no-unused-vars: 0 */
const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  })
})

router.get('/about', function(req, res, next) {
  res.render('about', {
    title: 'About'
  })
})
module.exports = router
