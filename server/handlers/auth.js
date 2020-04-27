const jwt = require('jsonwebtoken');

const db = require('../models');

exports.register = async (req, res, next) => 
{
    try 
    {
        const user = await db.User.create(req.body);
        const { id, username, forename, surname, email, address1, address2, address3, postcode } = user;

        const token = jwt.sign({id, username}, process.env.SECRET);
        
        res.status(201).json({
            id, 
            username, 
            forename,
            surname,
            email,
            address1,
            address2,
            address3,
            postcode,
            token
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
        const {id, username} = user;
        const valid = await user.comparePassword(req.body.password);

        if(valid)
        {
            const token = jwt.sign({id, username}, process.env.SECRET);

            res.json({
                id,
                username,
                token
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

exports.adminRegister = async (req, res, next) => 
{
    try 
    {
        const admin = await db.Admin.create(req.body);
        const { id, username, forename, surname, email } = admin;

        const token = jwt.sign({id, username}, process.env.SECRET);
        
        res.status(201).json({
            id, 
            username, 
            forename,
            surname,
            email,
            token
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

exports.adminLogin = async (req, res, next) => 
{
    try
    {
        const admin = await db.Admin.findOne({username: req.body.username });
        const {id, username} = admin;
        const valid = await admin.comparePassword(req.body.password);

        if(valid)
        {
            const token = jwt.sign({id, username}, process.env.SECRET);

            res.json({
                id,
                username,
                token
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