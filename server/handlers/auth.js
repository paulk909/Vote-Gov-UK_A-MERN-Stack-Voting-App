const jwt = require('jsonwebtoken');

const db = require('../models');

exports.register = async (req, res, next) => 
{
    try 
    {
        const user = await db.User.create(req.body);
        const { id, username, userType } = user;

        const token = jwt.sign({id, username, userType}, process.env.SECRET);
        
        res.status(201).json({
            id, 
            username, 
            userType
        });
    }
    catch(err)
    {
        if(err.code == 11000)
        {
            err.message = 'Sorry, that username is already taken';
        }
        next(err);
    }
}

exports.login = async (req, res, next) => 
{
    try
    {
        const user = await db.User.findOne({username: req.body.username });
        const {id, username, userType, postcode} = user;
        const valid = await user.comparePassword(req.body.password);

        if(valid)
        {
            const token = jwt.sign({id, username, userType, postcode}, process.env.SECRET);

            res.json({
                id,
                username,
                userType,
                postcode,
                token,
            });
        }
        else
        {
            throw new Error('Invalid Username/Password');
        }
    }
    catch(err)
    {
        err.message = 'Invalid Username/Password';
        next(err);
    }
}