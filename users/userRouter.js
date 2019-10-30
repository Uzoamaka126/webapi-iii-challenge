const express = 'express';
const router = express.Router();
const Users = require('./userDb');

router.post('/', validateUser, (req, res) => {
    Users.insert(req.body)
    .then(user => {
        res.status(201).json(user);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: 'Error adding new user: ' + error.message ,
        });
    });
});

router.post('/:id/posts', validatePost, (req, res) => {
    
});
// /api/users
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

// /api/user/:id
router.get('/:id', [isValidParamId, validateUserId],(req, res) => {
    res.json(req.user);
});

router.get('/:id/posts', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

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
};

function validateUser(req, res, next) {
    const fullRequestBody = Object.keys(req.body).length;
    const fullRequestBodyName = Object.keys(req.body.name).length;
    if (!fullRequestBody) {
        res.status(400).json({
            message: 'Missing user data'
        })
    } else if(!fullRequestBodyName) {
        res.status(400).json({
            message: 'Missing required name field'
        })
    } else {
        next();
    }    
};

function validatePost(req, res, next) {
    const fullRequestBody = Object.keys(req.body).length;
    const fullRequestBodyText = Object.keys(req.body.text).length;
    if (!fullRequestBody) {
        res.status(400).json({
            message: 'Missing post data'
        })
    } else if(!fullRequestBodyText) {
        res.status(400).json({
            message: 'Missing required text field'
        })
    } else {
        next();
    }
};

module.exports = router;
