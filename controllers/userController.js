const UserModel = require('./../models').user
const ObjectId = require('mongodb').ObjectID
const userController = {}

userController.create = (req, res) => {
  validateName(req, (err, available) => {
    if (err) throw err
    if (available) {
      const user = new UserModel(req.body)
      req.app.db.collection('users').insertOne(user, (err, result) => {
        if (err) throw err
        res.json({'status': 'success', 'data': 'Done. Sign In to continue'})
      })
    } else res.json({'status': 'fail', 'data': 'This user name exists. Enter another name'})
  })
}

const validateName = (req, cb) => {
  req.app.db.collection('users')
  .find({'userName': req.body.userName})
  .toArray((err, result) => {
    if (err) throw err
    if (result.length === 0) cb(err, true)
    else cb(err, false)
  })
}

userController.login = (req, res) => {
  req.app.db.collection('users')
  .find({'userName': req.body.userName})
  .toArray((err, result) => {
    if (err) throw err
    if (result.length === 0) res.json({'status': 'fail', 'data': 'User does not exist. Sign up to continue.'})
    else if (result[0].userName !== req.body.userName) res.json({'status': 'fail', 'data': 'Invalid User Name'})
    else if (result[0].userName === req.body.userName && result[0].password !== req.body.password) {
      res.json({'status': 'fail', 'data': 'Password incorrect'})
    } else {
      req.session.userName = result[0].userName
      req.session.userID = ObjectId(result[0]._id)
      res.json({'status': 'success', 'data': {'userName': result[0].userName, 'id': result[0]._id}})
    }
  })
}

userController.logout = (req, res) => {
  req.session.destroy()
  res.json({'status': 'success', 'data': 'Logout successful'})
}
module.exports = userController
