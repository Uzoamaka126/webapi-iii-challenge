const express = 'express';
const router = express.Router();
const Posts = require('./postDb');

// Get all Posts
router.get('/', (req, res) => {
    Posts.get(req.query)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving all posts' + error.message,
            });
        });
});

// Get a single post
router.get('/:id', [validatePostId], (req, res) => {
    Posts.getById(req.params.id)
        .then(post => {
            if(post) {
                res.status(200).json(user);
            } else {
                res.status(404).json({
                    message: "User not found"
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving all posts' + error.message,
            });
        });
});

// Delete a selected post
router.delete('/:id', [validatePostId], (req, res) => {
    const { id } = req/params;
    Posts.remove(id)
        .then(count => {
            if(count > 0) {
                res.status(200).json({
                    message: 'The Post has been removed!'
                })
            } else {
                res.status(404).json({
                    message: 'The post could not be found'
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving all posts' + error.message,
            });
        });
});

router.put('/:id', [validatePostId], (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    Posts.update(id, updates)
        .then(post => {
            if(post) {
                res.status(200).json({
                    message: 'Post has been successfully updated',
                    post
                });
            } else {
                res.status(404).json({
                    message: 'The Post could not be found' + err.message
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Error updating the post' + err.message
            });
        });
});

// custom middleware
function validatePostId(req, res, next) {
    const { id } = req.params;
    Posts.getById(id)
        .then(post => {
            if(post) {
                req.post = post;
                next()
            } else {
                res.status(400).json({
                    message: 'Invalid post id'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Something came up when we were checking for the post id' + error.message,
            });
        });
};

module.exports = router;