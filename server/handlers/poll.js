const db = require('../models');

exports.showPolls = async (req, res, next) => {
    try
    {
        const polls = await db.Poll.find().populate('admin', ['username', 'id']);

        res.status(200).json(polls);
    }
    catch(err)
    {
        err.status = 400;
        next(err);
    }
};

exports.adminsPolls = async (req, res, next) => {
    try
    {
        const {id} = req.decoded;

        const admin = await db.Admin.findById(id)
        .populate('polls');

        res.status(200).json(admin.polls);
    }
    catch (err)
    {
        err.status = 400;
        next(err);
    }
};

exports.createPoll = async (req, res, next) => {
    try
    {
        const {id} = req.decoded;
        const admin = await db.Admin.findById(id);

        const { title, constituency, date, options} = req.body;
        const poll = await db.Poll.create({
            title,
            constituency,
            date,
            admin,
            options: options.map(option => ({ 
                candidateName: option.candidateName,
                candidateAddress: option.candidateAddress,
                candidateParty: option.candidateParty,         
                votes: 0 }))
        });
        admin.polls.push(poll._id);
        await admin.save();

        res.status(201).json({ ...poll._doc, admin: admin._id });
    }
    catch (err)
    {
        err.status = 400;
        next(err);
    }
};

exports.getPoll = async (req, res, next) => {
    try
    {
        const {id} = req.params;

        const poll = await db.Poll.findById(id)
        .populate('admin', ['username', 'id']);

        if (!poll) throw new Error('No poll found');

        res.status(200).json(poll);
    }
    catch (err)
    {
        err.status = 400;
        next(err);
    }
};

exports.deletePoll = async (req, res, next) => {
    try
    {
        const {id: pollId} = req.params;
        const {id: adminId} = req.decoded;

        const poll = await db.Poll.findById(pollId);
        if (!poll) throw new Error('No poll found');
        if (poll.admin.toString() !== adminId) 
        {
            throw new Error('Unauthorized access');
        }

        await poll.remove();
        res.status(202).json(poll);
    }
    catch (err)
    {
        err.status = 400;
        next(err);
    }
};

exports.vote = async (req, res, next) => {
    try
    {
        const {id: pollId} = req.params;
        const {id: userId} = req.decoded;
        const {answer} = req.body;

        if (answer)
        {
            const poll = await db.Poll.findById(pollId);
            if (!poll) throw new Error('No poll found');

            const vote = poll.options.map(
                option => {
                    if (option.id === answer)
                    {
                        return {
                            candidateName: option.candidateName,
                            candidateAddress: option.candidateAddress,
                            candidateParty: option.candidateParty,
                            _id: option._id,
                            votes: option.votes + 1
                        };
                    }
                    else
                    {
                        return option;
                    }
                }
            );

            if (poll.voted.filter( user => user.toString() === userId).length <= 0)
            {
                poll.voted.push(userId);
                poll.options = vote;
                await poll.save();

                res.status(202).json(poll);
            }
            else
            {
                throw new Error('Already voted');
            }
        }
        else
        {
            throw new Error('No answer provided');
        }
    }
    catch (err)
    {
        err.status = 400;
        next(err);
    }
}