const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
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
    created: {
        type: Date,
        default: Date.now
    },
    polls: [{type: mongoose.Schema.Types.ObjectId, ref: 'Poll'}]
});

adminSchema.pre('save', async function(next) {
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

adminSchema.methods.comparePassword = async function(attempt, next)
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

//module.exports = mongoose.model('Admin', adminSchema);