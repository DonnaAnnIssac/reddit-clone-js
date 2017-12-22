const UserModel = require('./../models').user
const userController = {}

userController.post = (req, res) => {
  if(validateName(req)) {
    const user = new UserModel(req.body)
    req.app.db.collection('users').insertOne(user, (err, result) => {
      if (err) throw err
      console.log('Document inserted')
      res.json(result)
    })
  }
  else res.json("This user name exists. Enter another name")
}

const validateName = (req) => {
  req.app.db.collection('users')
  .find({"userName" : req.body.userName})
  .toArray((err, result) => {
    if (err) throw err
    if(result.length === 0) return false
    else return true
  })
}

userController.login = (req, res) => {
  req.app.db.collection('users')
  .find({"userName" : req.body.userName})
  .toArray((err, result) => {
    if (err) throw err
    if (result.length === 0) res.json("Invalid User Name")
    else if (result[0].password !== req.body.password) res.json("Password incorrect")
    else res.json(result)
  })
}

module.exports = userController
