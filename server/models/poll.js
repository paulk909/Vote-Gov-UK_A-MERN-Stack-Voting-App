const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    candidateName: {
        type: String,
        required: true 
    },
    candidateAddress: String,
    candidateParty: {
        type: String,
        required: true 
    },
    votes: {
        type: Number,
        default: 0
    }
});

const pollSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    constituency: String,
    date: Date,
    options: [optionSchema],
    postcodes: [String],
    voted: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Poll', pollSchema);