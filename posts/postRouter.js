const express = 'express';
const router = express.Router();
const Posts = require('./postDb');

router.get('/', (req, res) => {
    Posts.get(req.query)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving the hubs',
            });
        });
});

router.get('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

// custom middleware

function validatePostId(req, res, next) {

};

module.exports = router;