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
    admin: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    title: String,
    constituency: String,
    date: Date,
    options: [optionSchema],
    voted: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Poll', pollSchema);