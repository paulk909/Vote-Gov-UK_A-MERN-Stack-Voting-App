const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userType: {
        type: String,
        default: "User"
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    forename: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        required: true
    },
    address3: {
        type: String
    },
    postcode: {
        type: String,
        required: true
    },
    polls: [{type: mongoose.Schema.Types.ObjectId, ref: 'Poll'}],
    created: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function(next) {
    try 
    {
        if (!this.isModified('password'))
        {
            return next();
        }
        const hashed = await bcrypt.hash(this.password, 10);
        this.password = hashed;
        return next();
    }
    catch(err) {
        return next(err);
    }
})

userSchema.methods.comparePassword = async function(attempt, next)
{
    try
    {
        return await bcrypt.compare(attempt, this.password);
    }
    catch(err) 
    {
        next(err);
    }
}

module.exports = mongoose.model('User', userSchema);