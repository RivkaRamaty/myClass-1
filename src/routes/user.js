let UserModel = require('../models/user.model')
let express = require('express')
let router = express.Router()
let multer = require('multer')

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })

let fileFilter = (req, file, cb) => {
    if (file.mimetype.includes('image/'))
        cb(null, true)
    else
        cb(null, false)
}
   
let upload = multer({ 
    storage: storage,
    limits: {
        filesize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
 })

// Get all users
// GET localhost:3000/users
router.get('/users', (req, res) => {
    UserModel.find({})
    .then(doc => {
        res.json(doc)
    })
    .catch(err => {
        res.status(500),json(err)
    })
})

// Get a user
// GET localhost:3000/user?email=kobi@gmail.com
router.get('/user', (req, res) => {
    if (!req.query.email){
        return res.status(400).send('Missing URL parameter: email')
    }

    UserModel.findOne({
        email: req.query.email
    })
    .then(doc => {
        res.json(doc)
    })
    .catch(err => {
        res.status(500),json(err)
    })
})


// Update a user
// PUT localhost:3000/user?email=kobi@gmail.com
router.put('/user', (req, res) => {
    if (!req.query.email){
        return res.status(400).send('Missing URL parameter: email')
    }
    
    UserModel.findOneAndUpdate({
        email: req.query.email
    }, req.body, {
        new: true
    })
    .then(doc => {
        res.json(doc)
    })
    .catch(err => {
        res.status(500),json(err)
    })
})


// Update a specific user field
// PATCH localhost:3000/user?email=kobi@gmail.com
router.patch('/user', (req, res) => {
    if (!req.query.email){
        return res.status(400).send('Missing URL parameter: email')
    }
    
    UserModel.findOneAndUpdate({
        email: req.query.email
    }, req.body, {
        new: true
    })
    .then(doc => {
        res.json(doc)
    })
    .catch(err => {
        res.status(500),json(err)
    })
})

// Delete a user
// DELETE localhost:3000/user?email=kobi@gmail.com
router.delete('/user', (req, res) => {
    if (!req.query.email){
        return res.status(400).send('Missing URL parameter: email')
    }
    
    UserModel.findOneAndRemove({
        email: req.query.email
    })
    .then(doc => {
        res.json(doc)
    })
    .catch(err => {
        res.status(500),json(err)
    })
})


// Create a new user
// POST localhost:3000/user
router.post('/user', upload.single('picture'), (req, res) => {
    if (!req.body) {
        return res.status(400).send('Request body is missing')
    }
    let model = new UserModel(req.body)

    model.set({picture: req.file.path})
    model.save()
    .then(doc => {
        if (!doc || doc.length === 0) {
            return res.status(500).send(doc)
        }
        res.status(201).send(doc)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

module.exports = router