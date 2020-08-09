const csv = require("csvtojson");

const db = require('../models');

exports.showPolls = async (req, res, next) => {
    try
    {
        const {id} = req.decoded;
        const user = await db.User.findById(id);
        
        const polls = await db.Poll.find({"postcodes": user.postcode}).populate('user', ['username', 'id']);

        if(polls.length > 0)
        {
            res.status(200).json(polls);
        }
        else{
            res.status(200).json([]);
        }
    }
    catch(err)
    {
        err.status = 400;
        next(err);
    }
};

exports.usersPolls = async (req, res, next) => {
    try
    {
        const {id} = req.decoded;

        const user = await db.User.findById(id)
        .populate('polls');

        if(user.polls.length > 0)
        {
            res.status(200).json(user.polls);
        }
        else{
            res.status(200).json([]);
        }
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
        const user = await db.User.findById(id);

        const { title, constituency, date, options} = req.body;
        const poll = await db.Poll.create({
            title,
            constituency,
            date,
            user,
            options: options.map((options, i) => ({ 
                candidateName: options[i].candidateName,
                candidateAddress: options[i].candidateAddress,
                candidateParty: options[i].candidateParty,         
                votes: 0 }))
        });

        await csv()
          .fromFile("../postcodes/" + poll.constituency + " postcodes.csv")
          .then (function(jsonArrayObj){           
            poll.postcodes = jsonArrayObj.map(a => a.Postcode)
          });

        user.polls.push(poll._id);
        await user.save();

        res.status(201).json({ ...poll._doc, user: user._id });
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
        .populate('user', ['username', 'id']);

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
        const {id: userId} = req.decoded;

        const poll = await db.Poll.findById(pollId);
        if (!poll) throw new Error('No poll found');
        if (poll.user.toString() !== userId) 
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