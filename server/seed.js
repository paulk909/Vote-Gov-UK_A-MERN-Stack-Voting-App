require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE);

const db = require('./models');

const admin = [
  { username: 'admin', forename: 'Bob', surname: 'Hoskins', email: 'email@email.com', password: 'password' },
  { username: 'nextadmin', forename: 'Admin', surname: 'McAdmin', email: 'email@email.com', password: 'password' },
];

const user = [
  { username: 'paul', forename: 'Paul', surname: 'Kerr', email: 'pkerr205@caledonian.ac.uk', password: 'password', address1: "1 Hampden St", address2: "Glasgow", postcode: "G42 9BA" },
  { username: 'user', forename: 'User', surname: 'McUserface', email: 'pjk009@outlook.com', password: 'password', address1: "1 Mitchell Ave", address2: "Glasgow", postcode: 'G3 7DN' },
];

const polls = [
  {
    title: 'UK General Election',
    constituency: 'Glasgow North West',
    options: [
      {
        candidateName: 'Carol Monaghan',
        candidateAddress: '',
        candidateParty: 'SNP'
      },
      {
        candidateName: 'Patricia Ferguson',
        candidateAddress: '',
        candidateParty: 'Labour'
      },
      {
        candidateName: 'Ade Aibinu',
        candidateAddress: '',
        candidateParty: 'Conservative'
      },
      {
        candidateName: 'James Speirs',
        candidateAddress: '',
        candidateParty: 'Liberal Democrats'
      }
    ],
    date: "04/26/2020"
  },
  {
    title: 'UK General Election',
    constituency: 'Glasgow Central',
    options: [
      {
        candidateName: 'Alison Thewliss',
        candidateAddress: '',
        candidateParty: 'SNP'
      },
      {
        candidateName: 'Faten Hameed',
        candidateAddress: '',
        candidateParty: 'Labour'
      },
      {
        candidateName: 'Flora Scarabello',
        candidateAddress: '',
        candidateParty: 'Conservative'
      },
      {
        candidateName: 'Ewan Hoyle',
        candidateAddress: '',
        candidateParty: 'Liberal Democrats'
      },
      {
        candidateName: 'Elaine Gallagher',
        candidateAddress: '',
        candidateParty: 'Scottish Green'
      }
    ],
    date: "04/26/2020"
  },
  {
    title: 'UK General Election',
    candidateAddress: '',
    constituency: 'Glasgow South West',
    options: [
      {
        candidateName: 'Chris Stephens',
        candidateAddress: '',
        candidateParty: 'SNP'
      },
      {
        candidateName: 'Matt Kerr',
        candidateAddress: '',
        candidateParty: 'Labour Co-op'
      },
      {
        candidateName: 'Thomas Haddow',
        candidateAddress: '',
        candidateParty: 'Conservative'
      },
      {
        candidateName: 'Ben Denton-Cardew',
        candidateAddress: '',
        candidateParty: 'Liberal Democrats'
      },
      {
        candidateName: 'Peter Brown',
        candidateAddress: '',
        candidateParty: 'Brexit Party'
      }
    ],
    date: "04/26/2020"
  },
  {
    title: 'UK General Election',
    candidateAddress: '',
    constituency: 'Glasgow South',
    options: [
      {
        candidateName: 'Stewart McDonald',
        candidateAddress: '',
        candidateParty: 'SNP'
      },
      {
        candidateName: 'Johann Lamont',
        candidateAddress: '',
        candidateParty: 'Labour Co-op'
      },
      {
        candidateName: 'Kyle Thornton',
        candidateAddress: '',
        candidateParty: 'Conservative'
      },
      {
        candidateName: 'Carole Ford',
        candidateAddress: '',
        candidateParty: 'Liberal Democrats'
      },
      {
        candidateName: 'Dan Hutchison',
        candidateAddress: '',
        candidateParty: 'Scottish Green'
      },
      {
        candidateName: 'Danyaal Raja',
        candidateAddress: '',
        candidateParty: 'Brexit Party'
      }
    ],
    date: "04/26/2020"
  }
];

const seed = async () => {
  try {
    await db.Admin.remove();
    console.log('DROP ALL ADMINS');

    await db.Poll.remove();
    console.log('DROP ALL POLLS');

    await db.User.remove();
    console.log('DROP ALL USERS');

    await Promise.all(
      admin.map(async admin => {
        const data = await db.Admin.create(admin);
        await data.save();
      }),
    );
    console.log('CREATED ADMINS', JSON.stringify(admin));

    await Promise.all(
      user.map(async user => {
        const data = await db.User.create(user);
        await data.save();
      }),
    );
    console.log('CREATED USERS', JSON.stringify(admin));

    await Promise.all(
      polls.map(async poll => {
        poll.options = poll.options.map(option => ({ 
          candidateName: option.candidateName,
          candidateAddress: option.candidateAddress,
          candidateParty: option.candidateParty,         
          votes: 0 }));
        const data = await db.Poll.create(poll);
        const admin = await db.Admin.findOne({ username: 'admin' });
        data.admin = admin;
        admin.polls.push(data._id);
        await admin.save();
        await data.save();
      }),
    );
    console.log('CREATED POLLS', JSON.stringify(polls));
  } catch (err) {
    console.error(err);
  }
};

seed();
