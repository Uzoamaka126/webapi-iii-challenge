const express = require('express');
const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

// Create a new user
router.post('/', validateUser, (req, res) => {
    Users
        .insert(req.body)
        .then(user => {
            return res.status(201).json(user);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error adding a new user' + error.message,
            })
        })
});

// Create a new post if user id is verified
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    // const postInfo = { 
    //     ...req.body, 
    //     user_id: req.params.id 
    // };
    
    Posts
        .insert({ 
            ...req.body, 
            user_id: req.params.id 
        })
        .then(post => {
            return res.status(201).json(post);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error adding a new user' + error.message,
            })
        })
})

// /api/users: Get all users --done!
router.get('/', (req, res) => {
    Users
        .get(req.query)
        .then(users => {
            return res.status(200).json(users);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving all users'
            });
        });
});

// /api/user/:id: Get a particular user --done!
router
    .get('/:id', validateUserId, (req, res) => {
        return res.status(200).json(req.user);
});

// Get all Posts from a particular user --done!
router
    .get('/:id/posts', validateUserId, (req, res) => {
    Users.getUserPosts(req.user.id)
        .then(posts => {
            return res.status(200).json(posts);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error getting the posts from the user' + error.message
            });
        });
});

// Delete a user
router
    .delete('/:id', validateUserId, (req, res) => {
        Users.remove(req.user.id)
            .then(() => {
                // throw new Error
                res.status(200).json({
                    message: "This user has been deleted"
                });
            })
            .catch(error => {
                res.status(500).json({
                    message: "Error deleting user" + error.message
                });
            })
});

// Edit details of a particular user
router
    .put('/:id', validateUserId, (req, res) => {
        Users.update(req.hub.id, req.body)
            .then(user => {
                res.status(200).json(user);
            })
            .catch(error => {
                res.status(500).json({
                    message: 'Error updating user data' + error.message
                })
            })
});

//custom middleware
// function isValidParamId(req, res, next) {
//     const { id } = req.params;
//     if(parseInt(id) > 0) {
//         next();
//     } else {
//         res.status(400).json({
//             message: 'This has to be a vaild id'
//         })
//     }
// }

function validateUserId(req, res, next) {
    const { id } = req.params;
    if(Number(id) == id) {
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
    } else {
        return res.status(400).json({
            message: 'This id is wrong'
        })
    }
}

function validateUser(req, res, next) {
    if (!Object.keys(req.body).length) {
        res.status(400).json({
            message: 'Missing user data!'
        })
    } if(!req.body.name) {
        res.status(400).json({
            message: 'Missing required name field!'
        })
    }
        next();    
}

function validatePost(req, res, next) {
    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            message: 'Missing post data'
        })
    } if(!req.body.text) {
        res.status(400).json({
            message: 'Missing required text field'
        })
    } 
        next();
}

module.exports = router;
