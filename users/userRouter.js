const express = require('express');
const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

// Create a new user
router.post('/', (req, res) => {
    Users.insert(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error adding a new user' + error.message,
            })
        })
});
// /api/users: Get all users
router.get('/', (req, res) => {
    Users.get(req.query)
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving all users'
            });
        });
});

// /api/user/:id: Get a particular user
router.get('/:id', [isValidParamId, validateUserId],(req, res) => {
    res.json(req.user);
});

// Get all Posts from a particular user
router.get('/:id/posts',[isValidParamId, validateUserId], (req, res) => {

});

// Delete a user
router.delete('/:id', [isValidParamId, validateUserId], (req, res) => {

});

// Edit details of a particular user
router.put('/:id', (req, res) => {

});

//custom middleware
function isValidParamId(req, res, next) {
    const { id } = req.params;
    if(parseInt(id) > 0) {
        next();
    } else {
        res.status(400).json({
            message: 'This has to be a vaild id'
        })
    }
}

function validateUserId(req, res, next) {
    const { id } = req.params;
    Users.getById(id)
        .then(user => {
            if(user) {
                req.user = user;
                next()
            } else {
                res.status(400).json({
                    message: 'Invalid user id'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Something came up when we were checking the user id' + error.message,
            });
        });
}

function validateUser(req, res, next) {
    if (!Object.keys(req.body).length) {
        res.status(400).json({
            message: 'Missing user data!'
        })
    } else if(!req.body.name.length) {
        res.status(400).json({
            message: 'Missing required name field!'
        })
    } else {
        next();
    }    
}

module.exports = router;
