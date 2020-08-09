import React from 'react';
import {connect} from 'react-redux';
import {Bar} from 'react-chartjs-2';

import {vote, authUser} from '../store/actions';

const color = () => {
    return ('#' + Math.random().toString(16).slice(2,8));
}


const Poll = ({poll, vote}) => {

    const answers = 
    poll.options && 
    poll.options.map(option => (
        <button 
        className="button" 
        onClick={() => vote(poll._id, {answer: option._id})} 
        key={option._id}>
            {option.candidateName} <br />
            {option.candidateParty}
        </button>
    ));

    const data = poll.options && {
        labels: poll.options.map(option => option.candidateName),
        datasets: [
            {
                label: poll.constituency,
                backgroundColor: poll.options.map(option => color()),
                borderColor: '#323643',
                data: poll.options.map(option => option.votes)
            }
        ]
    };

    return <div>
        <h3 className="poll-title">{poll.title}</h3>
        <h2 className="poll-constituency">{poll.constituency}</h2>
        <div className="candidate-holder">
            <div className="button-candidate button-center">{answers}</div>      
          </div>
        {poll.options && <Bar data={data} />}
    </div>;

};

export default connect(
    store => ({
        poll: store.currentPoll,
        user: authUser.user
    }), 
    {vote}
)(Poll);